import { useRef, useState } from "react";
import { Sphere, Text, Billboard, Html } from "@react-three/drei";
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

  // Subtle pulsing animation
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      meshRef.current.scale.setScalar(hovered ? scale * 1.15 : scale);
    }
  });

  // Educational-friendly color palette
  const getColor = () => {
    const colors = [
      "hsl(192, 85%, 58%)", // Primary - bright cyan
      "hsl(262, 83%, 58%)", // Secondary - purple
      "hsl(173, 58%, 39%)", // Accent - teal
      "hsl(217, 91%, 60%)", // Blue
      "hsl(142, 76%, 36%)", // Green
      "hsl(45, 93%, 47%)",  // Yellow
    ];
    return colors[depth % colors.length];
  };

  const nodeSize = Math.max(0.4, 1.2 - depth * 0.15);
  const fontSize = Math.max(0.25, 0.4 - depth * 0.04);

  return (
    <group position={position}>
      {/* Main sphere */}
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
          emissiveIntensity={hovered ? 0.5 : 0.25}
          roughness={0.3}
          metalness={0.6}
        />
      </Sphere>
      
      {/* Billboard text that always faces camera */}
      <Billboard position={[0, nodeSize + 0.6, 0]} follow={true}>
        <Html
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            className="px-3 py-1.5 rounded-md shadow-lg"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              border: `2px solid ${getColor()}`,
              color: 'white',
              fontSize: `${fontSize * 16}px`,
              fontWeight: depth === 0 ? 'bold' : 'normal',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
              textAlign: 'center',
            }}
          >
            {label}
          </div>
        </Html>
      </Billboard>
      
      {/* Glow ring for expanded nodes */}
      {isExpanded && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[nodeSize * 1.3, nodeSize * 1.5, 32]} />
          <meshBasicMaterial
            color={getColor()}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Focus indicator */}
      {isFocused && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[nodeSize * 1.6, nodeSize * 1.8, 32]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight color={getColor()} intensity={2} distance={10} />
        </>
      )}
      
      {/* Depth indicator platform */}
      {depth > 0 && (
        <mesh position={[0, -nodeSize - 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[nodeSize * 0.8, 16]} />
          <meshBasicMaterial
            color={getColor()}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
