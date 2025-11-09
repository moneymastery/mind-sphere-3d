import { useRef, useState } from "react";
import { Sphere, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Node3DProps {
  position: [number, number, number];
  label: string;
  depth: number;
  onClick?: () => void;
  isExpanded?: boolean;
}

export const Node3D = ({ position, label, depth, onClick, isExpanded }: Node3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Pulsing animation
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.setScalar(hovered ? scale * 1.2 : scale);
    }
  });

  // Color based on depth
  const getColor = () => {
    const colors = [
      "#3dd9eb", // cyan (primary)
      "#a78bfa", // purple
      "#d946ef", // magenta
      "#60a5fa", // blue
      "#34d399", // teal
    ];
    return colors[depth % colors.length];
  };

  const nodeSize = Math.max(0.3, 1 - depth * 0.15);

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[nodeSize, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      <Text
        position={[0, nodeSize + 0.4, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label}
      </Text>
      
      {/* Glow ring for expanded nodes */}
      {isExpanded && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[nodeSize * 1.2, nodeSize * 1.4, 32]} />
          <meshBasicMaterial
            color={getColor()}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
