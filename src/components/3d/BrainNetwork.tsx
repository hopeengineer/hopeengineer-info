'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BrainNetwork() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Increased particle count from 300 to 500 to ensure high density at the bottom of the scroll journey
  const particleCount = 500;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Wider spawn box for floating nodes
        positions[i * 3] = (Math.random() - 0.5) * 40;     // X
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40; // Y
        
        // Z axis stringing to fly through: from +25 down to -85
        positions[i * 3 + 2] = 25 - (Math.random() * 110); // Z

        // Very slow organic drift velocities (reduced 33% further for calmness)
        velocities[i * 3] = (Math.random() - 0.5) * 0.025;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.025;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.025;
    }
    return { positions, velocities };
  }, [particleCount]);

  const techColor = useMemo(() => new THREE.Color('hsl(30, 100%, 50%)').convertSRGBToLinear(), []);
  const humanityColor = useMemo(() => new THREE.Color('hsl(160, 80%, 50%)').convertSRGBToLinear(), []); // Bioluminescent organic green
  
  // Store node colors so we can use them for line gradients later
  const nodeColors = useRef<THREE.Color[]>([]);

  // Initialize colors and base matrices once
  useEffect(() => {
    if (meshRef.current) {
      const dummy = new THREE.Object3D();
      nodeColors.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        // Uniform small 3D spheres
        dummy.scale.set(0.8, 0.8, 0.8);
        dummy.updateMatrix();
        
        // S-ION Fusion: 80% Tech (Amber), 20% Humanity/Planet (Bioluminescent Green)
        const isHumanityNode = Math.random() > 0.8;
        const color = isHumanityNode ? humanityColor : techColor;
        nodeColors.current.push(color);
        
        meshRef.current.setMatrixAt(i, dummy.matrix);
        meshRef.current.setColorAt(i, color);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [positions, particleCount, techColor, humanityColor]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Dynamic frame loop for drifting and reconnecting lines
  useFrame((state, delta) => {
    // Optional global rotation for depth feel
    if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.02;
    }

    // 1. Drift positions
    for (let i = 0; i < particleCount; i++) {
        let x = positions[i * 3];
        let y = positions[i * 3 + 1];
        let z = positions[i * 3 + 2];

        x += velocities[i * 3];
        y += velocities[i * 3 + 1];
        z += velocities[i * 3 + 2];

        // Soft bounce off boundaries to keep nodes in view
        if (Math.abs(x) > 25) velocities[i * 3] *= -1;
        if (Math.abs(y) > 25) velocities[i * 3 + 1] *= -1;
        
        // Z bounds must match the extended spread from +25 down to -85
        if (z > 30 || z < -90) velocities[i * 3 + 2] *= -1;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        if (meshRef.current) {
            dummy.position.set(x, y, z);
            dummy.scale.set(0.8, 0.8, 0.8);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
    }

    if (meshRef.current) {
        meshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Re-calculate proximity connections 
    const indices = []; // For LineSegments pairs
    const colorsArr = [];
    
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;

            // Connect nodes dynamically if they float within 100 units squared of each other
            if (distSq < 100) {
                // Fetch the actual assigned colors of the two connecting nodes
                const colorA = nodeColors.current[i];
                const colorB = nodeColors.current[j];
                
                // Safety guard: useFrame might fire before useEffect assigns colors
                if (!colorA || !colorB) continue;

                indices.push(i, j);
                
                // Line color interpolates perfectly between Node A and Node B
                colorsArr.push(colorA.r, colorA.g, colorA.b);
                colorsArr.push(colorB.r, colorB.g, colorB.b);
            }
        }
    }

    // 3. Update Line geometry
    if (linesGeometryRef.current) {
        linesGeometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        linesGeometryRef.current.setAttribute('color', new THREE.Float32BufferAttribute(colorsArr, 3));
        linesGeometryRef.current.setIndex(indices);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lights to ensure true 3D volume on the nodes */}
      <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <ambientLight intensity={0.5} />
      
      <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]} frustumCulled={false}>
        {/* Tiny perfect 3D spheres representing the floating nodes */}
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          roughness={0.2}
          metalness={0.8}
          emissive={techColor}
          emissiveIntensity={0.5}
        />
      </instancedMesh>
      
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={linesGeometryRef} />
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
