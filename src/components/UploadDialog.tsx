import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, FileJson, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { MindMapData } from "@/types/mindmap";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (mindMap: MindMapData) => void;
}

export const UploadDialog = ({ open, onOpenChange, onUploadComplete }: UploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/json"];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or JSON file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 25MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const fileDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });

      const fileData = await fileDataPromise;
      setUploadProgress(30);

      // Call edge function to process the file
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-mindmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            fileData,
            fileType: selectedFile.type,
            fileName: selectedFile.name,
          }),
        }
      );

      setUploadProgress(70);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      setUploadProgress(100);

      if (result.success && result.mindMap) {
        toast({
          title: "Success!",
          description: `${selectedFile.name} processed successfully`,
        });

        // Call the callback with the processed mind map
        onUploadComplete?.(result.mindMap);

        // Reset and close
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        onOpenChange(false);
      } else {
        throw new Error("Failed to process mind map");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-primary/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Upload Mind Map</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a notebook image (PNG/JPG) or existing mind map (JSON) to visualize in 3D
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isUploading ? (
            <div className="glass-panel p-8 rounded-lg border border-primary/30 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-lg font-medium text-foreground mb-2">
                Processing your mind map...
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Using AI to analyze and structure your content
              </p>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground mt-2">{uploadProgress}%</p>
            </div>
          ) : !selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,application/json"
                onChange={handleFileInput}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">
                Supported: PNG, JPG, JSON (max 25MB)
              </p>
            </div>
          ) : (
            <div className="glass-panel p-4 rounded-lg border border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedFile.type.startsWith("image/") ? (
                    <FileImage className="w-8 h-8 text-primary" />
                  ) : (
                    <FileJson className="w-8 h-8 text-secondary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 node-glow"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Process File
                </>
              )}
            </Button>
          </div>

          <div className="glass-panel p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-semibold">Coming soon:</span> AI-powered
              processing will convert notebook images to mind maps using OCR and generate
              structured visualizations from your uploads
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
