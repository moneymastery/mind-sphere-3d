import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/components/Hero";
import { MindMapViewer } from "@/components/MindMap3D/MindMapViewer";
import { MindMapControls } from "@/components/MindMapControls";
import { NodeInspector } from "@/components/NodeInspector";
import { sampleMindMap } from "@/data/sampleMindMap";
import { MindMapNode } from "@/types/mindmap";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const [showViewer, setShowViewer] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [key, setKey] = useState(0);

  const handleExplore = () => {
    setShowViewer(true);
  };

  const handleBack = () => {
    setShowViewer(false);
    setSelectedNode(null);
  };

  const handleReset = () => {
    setKey((prev) => prev + 1);
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!showViewer ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onExplore={handleExplore} />
          </motion.div>
        ) : (
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen relative"
          >
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-20 glass-panel border-b border-border/50">
              <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="hover:bg-primary/20"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h1 className="text-xl font-bold text-primary">{sampleMindMap.title}</h1>
                    <p className="text-sm text-muted-foreground">{sampleMindMap.description}</p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                    Click nodes to expand
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30">
                    Drag to rotate
                  </span>
                </div>
              </div>
            </div>

            {/* 3D Viewer */}
            <div className="h-screen pt-20">
              <MindMapViewer
                key={key}
                rootNode={sampleMindMap.rootNode}
                onNodeClick={setSelectedNode}
              />
            </div>

            {/* Controls */}
            <MindMapControls onReset={handleReset} />

            {/* Node Inspector */}
            <NodeInspector
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
