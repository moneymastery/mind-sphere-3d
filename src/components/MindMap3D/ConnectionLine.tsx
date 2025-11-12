import { Line } from "@react-three/drei";
import * as THREE from "three";

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
}

export const ConnectionLine = ({ start, end }: ConnectionLineProps) => {
  // Simple curved connection like traditional mind maps
  const midY = (start[1] + end[1]) / 2;
  
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3(start[0], midY, start[2]),
    new THREE.Vector3(end[0], midY, end[2]),
    new THREE.Vector3(...end)
  );

  const points = curve.getPoints(16);

  return (
    <Line
      points={points}
      color="#64748b"
      lineWidth={1.5}
      transparent
      opacity={0.5}
    />
  );
};
