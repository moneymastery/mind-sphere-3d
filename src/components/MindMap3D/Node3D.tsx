import { useRef, useState } from "react";
import { RoundedBox, Billboard, Html } from "@react-three/drei";
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

  // Smooth scale animation
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.08 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
  });

  // NotebookLM-style colors - clean blues and grays
  const getColor = () => {
    if (depth === 0) return "#4C8BF5"; // Google blue for root
    if (depth === 1) return "#5F9CF7";
    if (depth === 2) return "#72ADF9";
    return "#8AC0FC"; // Lighter blue for deeper nodes
  };

  const boxSize: [number, number, number] = [3.5, 1, 0.15];

  return (
    <group position={position}>
      {/* Rounded box with NotebookLM aesthetic */}
      <RoundedBox
        ref={meshRef}
        args={boxSize}
        radius={0.08}
        smoothness={4}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={getColor()}
          roughness={0.2}
          metalness={0.05}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.15 : 0.05}
        />
      </RoundedBox>
      
      {/* Clean text label */}
      <Billboard follow={true}>
        <Html
          center
          distanceFactor={5}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: depth === 0 ? '16px' : '13px',
              fontWeight: depth === 0 ? '600' : '500',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '-0.01em',
              padding: '2px 8px',
            }}
          >
            {label}
          </div>
        </Html>
      </Billboard>
      
      {/* Subtle focus ring */}
      {isFocused && (
        <RoundedBox args={[boxSize[0] + 0.15, boxSize[1] + 0.15, boxSize[2] + 0.05]} radius={0.1} smoothness={4}>
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </RoundedBox>
      )}
    </group>
  );
};
