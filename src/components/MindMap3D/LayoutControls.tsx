import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, GitBranch, Layers, Focus } from "lucide-react";
import { LayoutType } from "./layoutUtils";

interface LayoutControlsProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  maxDepth: number;
  visibleDepth: number;
  onDepthChange: (depth: number) => void;
  focusMode: boolean;
  onToggleFocus: () => void;
}

export const LayoutControls = ({
  currentLayout,
  onLayoutChange,
  maxDepth,
  visibleDepth,
  onDepthChange,
  focusMode,
  onToggleFocus,
}: LayoutControlsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-10"
    >
      <div className="glass-panel p-3 flex items-center gap-4">
        {/* Layout Mode Selector */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={currentLayout === "tree" ? "default" : "outline"}
            onClick={() => onLayoutChange("tree")}
            className="gap-2"
            title="Tree Layout - Hierarchical top-down structure"
          >
            <GitBranch className="w-4 h-4" />
            Tree
          </Button>
          
          <Button
            size="sm"
            variant={currentLayout === "radial" ? "default" : "outline"}
            onClick={() => onLayoutChange("radial")}
            className="gap-2"
            title="Radial Layout - Circular organization"
          >
            <Network className="w-4 h-4" />
            Radial
          </Button>
          
          <Button
            size="sm"
            variant={currentLayout === "force" ? "default" : "outline"}
            onClick={() => onLayoutChange("force")}
            className="gap-2"
            title="Force Layout - Physics-based automatic organization"
          >
            <Layers className="w-4 h-4" />
            Force
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Depth Level Control */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Depth:</span>
          <div className="flex gap-1">
            {Array.from({ length: maxDepth + 1 }, (_, i) => (
              <Badge
                key={i}
                variant={i <= visibleDepth ? "default" : "outline"}
                className="cursor-pointer px-2 py-0.5 text-xs"
                onClick={() => onDepthChange(i)}
              >
                {i}
              </Badge>
            ))}
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Focus Mode Toggle */}
        <Button
          size="sm"
          variant={focusMode ? "default" : "outline"}
          onClick={onToggleFocus}
          className="gap-2"
          title="Toggle Focus Mode - Center on selected node"
        >
          <Focus className="w-4 h-4" />
          Focus
        </Button>
      </div>
    </motion.div>
  );
};
