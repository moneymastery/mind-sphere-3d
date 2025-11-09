export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  color?: string;
  depth: number;
  position?: [number, number, number];
  children?: MindMapNode[];
  expanded?: boolean;
}

export interface MindMapData {
  title: string;
  description?: string;
  rootNode: MindMapNode;
}
