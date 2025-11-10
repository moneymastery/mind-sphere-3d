import { MindMapNode } from "@/types/mindmap";

export type LayoutType = "tree" | "radial" | "force";

export interface NodePosition {
  node: MindMapNode;
  position: [number, number, number];
}

// Tree Layout - Top-down hierarchical structure
export const calculateTreeLayout = (
  node: MindMapNode,
  expandedNodes: Set<string>,
  position: [number, number, number] = [0, 0, 0],
  levelWidth: number = 12
): NodePosition[] => {
  const result: NodePosition[] = [{ node, position }];

  if (!node.children || !expandedNodes.has(node.id)) {
    return result;
  }

  const childCount = node.children.length;
  const totalWidth = Math.max(levelWidth, childCount * 3);
  const spacing = totalWidth / (childCount + 1);

  node.children.forEach((child, index) => {
    const x = position[0] - totalWidth / 2 + spacing * (index + 1);
    const y = position[1] - 4; // Move down for each level
    const z = position[2] - 2; // Move back for depth perception

    const childPosition: [number, number, number] = [x, y, z];
    const childResults = calculateTreeLayout(
      child,
      expandedNodes,
      childPosition,
      totalWidth / childCount
    );
    result.push(...childResults);
  });

  return result;
};

// Improved Radial Layout with collision detection
export const calculateRadialLayout = (
  node: MindMapNode,
  expandedNodes: Set<string>,
  position: [number, number, number] = [0, 0, 0],
  angle: number = 0,
  radius: number = 6,
  levelOffset: number = 0
): NodePosition[] => {
  const result: NodePosition[] = [{ node, position }];

  if (!node.children || !expandedNodes.has(node.id)) {
    return result;
  }

  const childCount = node.children.length;
  const angleStep = (Math.PI * 2) / childCount;
  const newRadius = radius * 0.85;

  node.children.forEach((child, index) => {
    const childAngle = angle + angleStep * index;
    const x = position[0] + Math.cos(childAngle) * radius;
    const y = position[1] - 3 - (index % 2); // Alternate Y levels to reduce overlap
    const z = position[2] + Math.sin(childAngle) * radius;

    const childPosition: [number, number, number] = [x, y, z];
    const childResults = calculateRadialLayout(
      child,
      expandedNodes,
      childPosition,
      childAngle,
      newRadius,
      levelOffset + 1
    );
    result.push(...childResults);
  });

  return result;
};

// Force-directed layout simulation (simplified)
export const calculateForceLayout = (
  node: MindMapNode,
  expandedNodes: Set<string>,
  iterations: number = 50
): NodePosition[] => {
  // Collect all nodes first
  const allNodes: MindMapNode[] = [];
  const collectNodes = (n: MindMapNode) => {
    allNodes.push(n);
    if (n.children && expandedNodes.has(n.id)) {
      n.children.forEach(collectNodes);
    }
  };
  collectNodes(node);

  // Initialize positions
  const positions = new Map<string, [number, number, number]>();
  allNodes.forEach((n, i) => {
    const angle = (i / allNodes.length) * Math.PI * 2;
    const radius = 5 + n.depth * 2;
    positions.set(n.id, [
      Math.cos(angle) * radius,
      -n.depth * 3,
      Math.sin(angle) * radius,
    ]);
  });

  // Simple force simulation
  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map<string, [number, number, number]>();
    
    allNodes.forEach((n) => {
      forces.set(n.id, [0, 0, 0]);
    });

    // Repulsion between all nodes
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const n1 = allNodes[i];
        const n2 = allNodes[j];
        const pos1 = positions.get(n1.id)!;
        const pos2 = positions.get(n2.id)!;

        const dx = pos2[0] - pos1[0];
        const dy = pos2[1] - pos1[1];
        const dz = pos2[2] - pos1[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;

        const force = 0.5 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;

        const f1 = forces.get(n1.id)!;
        const f2 = forces.get(n2.id)!;
        f1[0] -= fx; f1[1] -= fy; f1[2] -= fz;
        f2[0] += fx; f2[1] += fy; f2[2] += fz;
      }
    }

    // Apply forces
    allNodes.forEach((n) => {
      const pos = positions.get(n.id)!;
      const force = forces.get(n.id)!;
      pos[0] += force[0];
      pos[1] += force[1];
      pos[2] += force[2];
    });
  }

  return allNodes.map((n) => ({
    node: n,
    position: positions.get(n.id)!,
  }));
};

// Get bounding box for nodes
export const getBoundingBox = (positions: NodePosition[]) => {
  const xs = positions.map((p) => p.position[0]);
  const ys = positions.map((p) => p.position[1]);
  const zs = positions.map((p) => p.position[2]);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs),
  };
};
