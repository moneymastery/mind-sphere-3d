import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Upload, Sparkles } from "lucide-react";
import { UploadDialog } from "./UploadDialog";

export const Hero = ({ onExplore }: { onExplore: () => void }) => {
  const [uploadOpen, setUploadOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Mind Mapping</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 glow-text">
            MindSphere 3D
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Transform your notes into{" "}
            <span className="text-primary font-semibold">interactive 3D mind maps</span>
          </p>
          
          <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
            Your Notes. Your Ideas. In Motion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 node-glow px-8 py-6 text-lg"
              onClick={onExplore}
            >
              <Brain className="w-5 h-5 mr-2" />
              Explore 3D Demo
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-6 text-lg"
              onClick={() => setUploadOpen(true)}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Your Map
            </Button>
          </div>
        </motion.div>

        {/* Upload Dialog */}
        <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          {[
            {
              icon: Brain,
              title: "AI Generation",
              description: "Convert text and notebooks into structured mind maps",
            },
            {
              icon: Sparkles,
              title: "3D Visualization",
              description: "Explore ideas in immersive 3D space",
            },
            {
              icon: Upload,
              title: "Easy Upload",
              description: "Import existing maps or create from scratch",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="glass-panel p-6 rounded-xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
