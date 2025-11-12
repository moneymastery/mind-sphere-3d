import { useRef, useState } from "react";
import { Box, Billboard, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Node3DProps {
  position: [number, number, number];
  label: string;
  depth: number;
  onClick?: () => void;
  isExpanded?: boolean;
  isFocused?: boolean;
}

export const Node3D = ({ position, label, depth, onClick, isExpanded, isFocused }: Node3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle hover animation
  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.set(1.05, 1.05, 1.05);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  // Simple color palette based on depth
  const getColor = () => {
    const colors = [
      "#1e293b", // slate-800 for root
      "#334155", // slate-700 for level 1
      "#475569", // slate-600 for level 2
      "#64748b", // slate-500 for level 3
      "#94a3b8", // slate-400 for level 4+
    ];
    return colors[Math.min(depth, colors.length - 1)];
  };

  const boxSize: [number, number, number] = [2, 0.8, 0.3];

  return (
    <group position={position}>
      {/* Simple box node */}
      <Box
        ref={meshRef}
        args={boxSize}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={getColor()}
          roughness={0.4}
          metalness={0.1}
        />
      </Box>
      
      {/* Text label on the box */}
      <Billboard follow={true}>
        <Html
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            className="px-2 py-1 text-white text-center"
            style={{
              fontSize: depth === 0 ? '14px' : '12px',
              fontWeight: depth === 0 ? 'bold' : 'normal',
              whiteSpace: 'nowrap',
              maxWidth: '180px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {label}
          </div>
        </Html>
      </Billboard>
      
      {/* Simple focus indicator */}
      {isFocused && (
        <Box args={[boxSize[0] + 0.2, boxSize[1] + 0.2, boxSize[2] + 0.1]}>
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.3}
            wireframe
          />
        </Box>
      )}
    </group>
  );
};
