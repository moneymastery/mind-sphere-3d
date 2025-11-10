import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw, Maximize2, Download } from "lucide-react";

interface MindMapControlsProps {
  onReset?: () => void;
  onFitToScreen?: () => void;
  onExport?: () => void;
}

export const MindMapControls = ({ onReset, onFitToScreen, onExport }: MindMapControlsProps) => {
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
        onClick={onFitToScreen}
        title="Fit to Screen - Auto-frame entire mind map"
      >
        <Maximize2 className="w-5 h-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="glass-panel hover:bg-primary/20"
        onClick={onReset}
        title="Reset View - Return to default camera position"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
      
      <Button
        size="icon"
        variant="outline"
        className="glass-panel hover:bg-primary/20"
        onClick={onExport}
        title="Export Mind Map - Download as JSON"
      >
        <Download className="w-5 h-5" />
      </Button>
    </motion.div>
  );
};
