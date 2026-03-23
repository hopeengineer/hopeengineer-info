'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { BrainNetwork } from './BrainNetwork';
import { ScrollCamera } from './ScrollCamera';
import { PostProcessing } from './PostProcessing';
import { LiveSketch } from './LiveSketch';

export default function Experience() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050814]">
      <LiveSketch />
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75, near: 0.1, far: 100 }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        dpr={[1, 2]} // Optimize pixel ratio
      >
        <fog attach="fog" args={['#050814', 5, 40]} /> {/* Fade into darkness */}
        
        {/* Ambient lighting to make colors pop */}
        <ambientLight intensity={0.5} />
        
        {/* Core elements */}
        <BrainNetwork />
        <ScrollCamera />
        
        {/* Post Processing for Cinematic Feel */}
        <PostProcessing />
      </Canvas>
    </div>
  );
}
