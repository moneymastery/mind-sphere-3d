import { Line } from "@react-three/drei";
import * as THREE from "three";

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
}

export const ConnectionLine = ({ start, end }: ConnectionLineProps) => {
  // Clean, professional connection lines like NotebookLM
  const startOffset = new THREE.Vector3(start[0], start[1] - 0.5, start[2]);
  const endOffset = new THREE.Vector3(end[0], end[1] + 0.5, end[2]);
  
  const midY = (startOffset.y + endOffset.y) / 2;
  
  const curve = new THREE.CubicBezierCurve3(
    startOffset,
    new THREE.Vector3(startOffset.x, midY, startOffset.z),
    new THREE.Vector3(endOffset.x, midY, endOffset.z),
    endOffset
  );

  const points = curve.getPoints(24);

  return (
    <Line
      points={points}
      color="#5F9CF7"
      lineWidth={2}
      transparent
      opacity={0.4}
    />
  );
};
