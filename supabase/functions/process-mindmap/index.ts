import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileType, fileName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing ${fileType} file: ${fileName}`);

    // Handle JSON files
    if (fileType === "application/json") {
      try {
        const mindMapData = JSON.parse(atob(fileData.split(',')[1]));
        console.log("JSON parsed successfully");
        return new Response(JSON.stringify({ success: true, mindMap: mindMapData }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("JSON parsing error:", error);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid JSON format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Handle image files with AI
    if (fileType.startsWith("image/")) {
      console.log("Processing image with AI...");
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a mind map extraction assistant. Extract text and structure from images and convert them into a hierarchical mind map JSON format. Return ONLY valid JSON without any markdown formatting or code blocks."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this image and extract a mind map structure. Return a JSON object with this exact structure:
{
  "title": "Main Topic",
  "description": "Brief description",
  "rootNode": {
    "id": "root",
    "label": "Main Topic",
    "description": "Description of main topic",
    "color": "#8B5CF6",
    "depth": 0,
    "children": [
      {
        "id": "unique-id",
        "label": "Subtopic",
        "description": "Description",
        "color": "#3B82F6",
        "depth": 1,
        "children": []
      }
    ]
  }
}

Extract all visible text and organize it hierarchically. Generate at least 3-5 main branches with 2-3 sub-items each. Use appropriate colors from this palette: #8B5CF6, #3B82F6, #10B981, #F59E0B, #EF4444. Return ONLY the JSON object.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: fileData
                  }
                }
              ]
            }
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ success: false, error: "Rate limit exceeded. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ success: false, error: "AI credits exhausted. Please add credits to continue." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        throw new Error("AI processing failed");
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error("No content received from AI");
      }

      // Remove markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      console.log("AI response content:", content);

      try {
        const mindMapData = JSON.parse(content);
        console.log("Mind map generated successfully from image");
        return new Response(JSON.stringify({ success: true, mindMap: mindMapData }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to generate valid mind map structure" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: "Unsupported file type" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Process mindmap error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});