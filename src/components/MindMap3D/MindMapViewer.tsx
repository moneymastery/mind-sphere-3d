import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useMemo, useState } from "react";
import { MindMapNode } from "@/types/mindmap";
import { Node3D } from "./Node3D";
import { ConnectionLine } from "./ConnectionLine";

interface MindMapViewerProps {
  rootNode: MindMapNode;
  onNodeClick?: (node: MindMapNode) => void;
}

export const MindMapViewer = ({ rootNode, onNodeClick }: MindMapViewerProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootNode.id]));

  // Calculate positions for all nodes in 3D space
  const calculatePositions = (
    node: MindMapNode,
    position: [number, number, number] = [0, 0, 0],
    angle: number = 0,
    radius: number = 4
  ): { node: MindMapNode; position: [number, number, number] }[] => {
    const result: { node: MindMapNode; position: [number, number, number] }[] = [
      { node, position },
    ];

    if (!node.children || !expandedNodes.has(node.id)) {
      return result;
    }

    const childCount = node.children.length;
    const angleStep = (Math.PI * 2) / childCount;

    node.children.forEach((child, index) => {
      const childAngle = angle + angleStep * index;
      const x = position[0] + Math.cos(childAngle) * radius;
      const y = position[1] - 2; // Move down for each level
      const z = position[2] + Math.sin(childAngle) * radius;

      const childPosition: [number, number, number] = [x, y, z];
      const childResults = calculatePositions(
        child,
        childPosition,
        childAngle,
        radius * 0.7
      );
      result.push(...childResults);
    });

    return result;
  };

  const nodesWithPositions = useMemo(
    () => calculatePositions(rootNode),
    [rootNode, expandedNodes]
  );

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
    onNodeClick?.(node);
  };

  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 15]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
        />
        
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a78bfa" />
          
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
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
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
};
