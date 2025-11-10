import { Line, Cone } from "@react-three/drei";
import * as THREE from "three";

interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}

export const ConnectionLine = ({ start, end, color = "hsl(192, 85%, 58%)" }: ConnectionLineProps) => {
  // Create a curved line
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 0.5,
      (start[2] + end[2]) / 2
    ),
    new THREE.Vector3(...end)
  );

  const points = curve.getPoints(30);

  // Calculate arrow position and rotation
  const arrowPos = points[Math.floor(points.length * 0.8)];
  const prevPos = points[Math.floor(points.length * 0.75)];
  const direction = new THREE.Vector3()
    .subVectors(arrowPos, prevPos)
    .normalize();
  
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction
  );

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={2.5}
        transparent
        opacity={0.7}
      />
      {/* Direction arrow */}
      <Cone
        args={[0.15, 0.3, 8]}
        position={[arrowPos.x, arrowPos.y, arrowPos.z]}
        quaternion={quaternion}
      >
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </Cone>
    </group>
  );
};
