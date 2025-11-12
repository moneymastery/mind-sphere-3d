import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera, Grid } from "@react-three/drei";
import { Suspense, useMemo, useState, useEffect } from "react";
import { MindMapNode } from "@/types/mindmap";
import { Node3D } from "./Node3D";
import { ConnectionLine } from "./ConnectionLine";
import { LayoutControls } from "./LayoutControls";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Maximize2, RotateCcw } from "lucide-react";
import {
  LayoutType,
  calculateTreeLayout,
  calculateRadialLayout,
  calculateForceLayout,
  NodePosition,
  getBoundingBox,
} from "./layoutUtils";
import * as THREE from "three";

interface MindMapViewerProps {
  rootNode: MindMapNode;
  onNodeClick?: (node: MindMapNode) => void;
}

// Camera animator component
const CameraAnimator = ({ targetPosition, targetLookAt }: { 
  targetPosition?: [number, number, number];
  targetLookAt?: [number, number, number];
}) => {
  const { camera } = useThree();

  useEffect(() => {
    if (targetPosition) {
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(...targetPosition);
      let progress = 0;

      const animate = () => {
        progress += 0.05;
        if (progress < 1) {
          camera.position.lerpVectors(startPos, endPos, progress);
          if (targetLookAt) {
            camera.lookAt(new THREE.Vector3(...targetLookAt));
          }
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [targetPosition, targetLookAt, camera]);

  return null;
};

export const MindMapViewer = ({ rootNode, onNodeClick }: MindMapViewerProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootNode.id]));
  const [layoutType, setLayoutType] = useState<LayoutType>("tree");
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [visibleDepth, setVisibleDepth] = useState(10);
  const [cameraTarget, setCameraTarget] = useState<{
    position?: [number, number, number];
    lookAt?: [number, number, number];
  }>({});

  // Get maximum depth in the tree
  const maxDepth = useMemo(() => {
    let max = 0;
    const traverse = (node: MindMapNode) => {
      max = Math.max(max, node.depth);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    traverse(rootNode);
    return max;
  }, [rootNode]);

  // Calculate positions based on selected layout
  const nodesWithPositions = useMemo(() => {
    let positions: NodePosition[];

    switch (layoutType) {
      case "tree":
        positions = calculateTreeLayout(rootNode, expandedNodes);
        break;
      case "radial":
        positions = calculateRadialLayout(rootNode, expandedNodes);
        break;
      case "force":
        positions = calculateForceLayout(rootNode, expandedNodes);
        break;
      default:
        positions = calculateTreeLayout(rootNode, expandedNodes);
    }

    // Filter by visible depth
    return positions.filter((p) => p.node.depth <= visibleDepth);
  }, [rootNode, expandedNodes, layoutType, visibleDepth]);

  // Generate connections
  const connections = useMemo(() => {
    const lines: { start: [number, number, number]; end: [number, number, number] }[] = [];

    const addConnections = (node: MindMapNode, parentPos: [number, number, number]) => {
      if (!node.children || !expandedNodes.has(node.id)) return;

      node.children.forEach((child) => {
        const childNodeData = nodesWithPositions.find((n) => n.node.id === child.id);
        if (childNodeData) {
          lines.push({ start: parentPos, end: childNodeData.position });
          addConnections(child, childNodeData.position);
        }
      });
    };

    const rootNodeData = nodesWithPositions.find((n) => n.node.id === rootNode.id);
    if (rootNodeData) {
      addConnections(rootNode, rootNodeData.position);
    }

    return lines;
  }, [nodesWithPositions, rootNode, expandedNodes]);

  const handleNodeClick = (node: MindMapNode) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(node.id)) {
        newSet.delete(node.id);
      } else {
        newSet.add(node.id);
      }
      return newSet;
    });
    
    // Set focused node
    setFocusedNode(node.id);
    
    // Animate camera to focused node
    const nodePos = nodesWithPositions.find((n) => n.node.id === node.id);
    if (nodePos) {
      const pos = nodePos.position;
      setCameraTarget({
        position: [pos[0], pos[1] + 3, pos[2] + 8],
        lookAt: pos,
      });
    }
    
    onNodeClick?.(node);
  };

  const handleReset = () => {
    setCameraTarget({
      position: [0, 5, 15],
      lookAt: [0, 0, 0],
    });
    setFocusedNode(null);
  };

  const handleFitToScreen = () => {
    const bbox = getBoundingBox(nodesWithPositions);
    const centerX = (bbox.minX + bbox.maxX) / 2;
    const centerY = (bbox.minY + bbox.maxY) / 2;
    const centerZ = (bbox.minZ + bbox.maxZ) / 2;
    
    const sizeX = bbox.maxX - bbox.minX;
    const sizeY = bbox.maxY - bbox.minY;
    const sizeZ = bbox.maxZ - bbox.minZ;
    const maxSize = Math.max(sizeX, sizeY, sizeZ);
    
    const distance = maxSize * 1.5;
    
    setCameraTarget({
      position: [centerX, centerY + distance * 0.5, centerZ + distance],
      lookAt: [centerX, centerY, centerZ],
    });
  };

  return (
    <div className="w-full h-full relative">
      <LayoutControls
        currentLayout={layoutType}
        onLayoutChange={setLayoutType}
        maxDepth={maxDepth}
        visibleDepth={visibleDepth}
        onDepthChange={setVisibleDepth}
        focusMode={focusedNode !== null}
        onToggleFocus={() => {
          if (focusedNode) {
            handleReset();
          }
        }}
      />
      
      {/* Side Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10"
      >
        <Button
          size="icon"
          variant="outline"
          className="glass-panel hover:bg-primary/20"
          onClick={handleFitToScreen}
          title="Fit to Screen"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
        
        <Button
          size="icon"
          variant="outline"
          className="glass-panel hover:bg-primary/20"
          onClick={handleReset}
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </motion.div>
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={60}
          enablePan={true}
        />
        
        <CameraAnimator 
          targetPosition={cameraTarget.position}
          targetLookAt={cameraTarget.lookAt}
        />
        
        <Suspense fallback={null}>
          {/* Simple, clean lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />
          
          {/* Subtle background grid */}
          <Grid
            args={[100, 100]}
            cellSize={2}
            cellThickness={0.3}
            cellColor="#e2e8f0"
            sectionSize={10}
            sectionThickness={0.5}
            sectionColor="#cbd5e1"
            fadeDistance={50}
            fadeStrength={1}
            position={[0, -8, 0]}
            infiniteGrid
          />

          {/* Render connections */}
          {connections.map((conn, idx) => (
            <ConnectionLine key={idx} start={conn.start} end={conn.end} />
          ))}

          {/* Render nodes */}
          {nodesWithPositions.map(({ node, position }) => (
            <Node3D
              key={node.id}
              position={position}
              label={node.label}
              depth={node.depth}
              onClick={() => handleNodeClick(node)}
              isExpanded={expandedNodes.has(node.id)}
              isFocused={focusedNode === node.id}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};
