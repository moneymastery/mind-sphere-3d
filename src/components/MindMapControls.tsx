import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";

interface MindMapControlsProps {
  onReset?: () => void;
}

export const MindMapControls = ({ onReset }: MindMapControlsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10"
    >
      <Button
        size="icon"
        variant="outline"
        className="glass-panel hover:bg-primary/20"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="glass-panel hover:bg-primary/20"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="glass-panel hover:bg-primary/20"
        onClick={onReset}
        title="Reset View"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="glass-panel hover:bg-primary/20"
        title="Fullscreen"
      >
        <Maximize2 className="w-5 h-5" />
      </Button>
    </motion.div>
  );
};
