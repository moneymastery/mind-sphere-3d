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
      <div className="glass-panel px-4 py-2 flex items-center gap-4 nb-transition">
        {/* Layout Mode Selector */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={currentLayout === "tree" ? "default" : "ghost"}
            onClick={() => onLayoutChange("tree")}
            className="gap-2 nb-transition"
            title="Tree Layout - Hierarchical top-down structure"
          >
            <GitBranch className="w-4 h-4" />
            Tree
          </Button>
          
          <Button
            size="sm"
            variant={currentLayout === "radial" ? "default" : "ghost"}
            onClick={() => onLayoutChange("radial")}
            className="gap-2 nb-transition"
            title="Radial Layout - Circular organization"
          >
            <Network className="w-4 h-4" />
            Radial
          </Button>
          
          <Button
            size="sm"
            variant={currentLayout === "force" ? "default" : "ghost"}
            onClick={() => onLayoutChange("force")}
            className="gap-2 nb-transition"
            title="Force Layout - Physics-based automatic organization"
          >
            <Layers className="w-4 h-4" />
            Force
          </Button>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Depth Level Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Depth:</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(maxDepth + 1, 6) }, (_, i) => (
              <Badge
                key={i}
                variant={i <= visibleDepth ? "default" : "secondary"}
                className="cursor-pointer px-2 py-0.5 text-xs nb-transition hover:scale-105"
                onClick={() => onDepthChange(i)}
              >
                {i}
              </Badge>
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Focus Mode Toggle */}
        <Button
          size="sm"
          variant={focusMode ? "default" : "ghost"}
          onClick={onToggleFocus}
          className="gap-2 nb-transition"
          title="Toggle Focus Mode - Center on selected node"
        >
          <Focus className="w-4 h-4" />
          {focusMode ? "Focused" : "Focus"}
        </Button>
      </div>
    </motion.div>
  );
};
