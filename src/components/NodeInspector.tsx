import { motion, AnimatePresence } from "framer-motion";
import { MindMapNode } from "@/types/mindmap";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NodeInspectorProps {
  node: MindMapNode | null;
  onClose: () => void;
}

export const NodeInspector = ({ node, onClose }: NodeInspectorProps) => {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed left-6 top-20 w-80 glass-panel p-6 rounded-xl z-20 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-primary">{node.label}</h3>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="hover:bg-primary/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {node.description && (
            <p className="text-muted-foreground mb-4">{node.description}</p>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Depth Level:</span>
              <span className="font-semibold">{node.depth}</span>
            </div>

            {node.children && node.children.length > 0 && (
              <div className="border-t border-border/50 pt-3">
                <span className="text-sm text-muted-foreground mb-2 block">
                  Sub-topics ({node.children.length}):
                </span>
                <ul className="space-y-1">
                  {node.children.map((child) => (
                    <li
                      key={child.id}
                      className="text-sm pl-4 border-l-2 border-primary/30 py-1"
                    >
                      {child.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-xs text-muted-foreground">
              💡 Click on nodes in 3D space to expand or collapse branches
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
