'use client';

import { useEffect, useRef, useState } from 'react';

// Hardward-accelerated CSS Orbs for zero JS performance cost
function GlowingOrbs() {
  const [orbs, setOrbs] = useState<{id: number, left: string, top: string, delay: string, duration: string, size: number}[]>([]);
  
  useEffect(() => {
    // Generate static random positions for 15 orbs off the main thread
    const newOrbs = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${20 + Math.random() * 60}%`,
      top: `${50 + Math.random() * 40}%`,
      delay: `-${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: Math.random() * 3 + 2, // 2px to 5px
    }));
    setOrbs(newOrbs);
  }, []);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {orbs.map(orb => (
        <div 
          key={orb.id}
          className="absolute rounded-full animate-float opacity-0 animate-fade-in-slow"
          style={{
            left: orb.left,
            top: orb.top,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            backgroundColor: 'hsl(30, 100%, 60%)',
            boxShadow: '0 0 15px 2px rgba(255,170,0,0.8)',
            animationDuration: orb.duration,
            animationDelay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

export function LiveSketch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Remove desynchronized for better cross-browser stability just in case
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const updateSize = () => {
      // 1:1 scaling
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Handle high-dpi displays safely
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      ctx.scale(dpr, dpr);
    };
    updateSize();

    const maxDepth = 9; // Keeps flawless 60fps

    let activeBranches: {
      x: number, y: number, 
      angle: number, 
      length: number, targetLength: number,
      depth: number, thickness: number,
      color: string
    }[] = [];

    // Seed the trunk safely in the center lower-third
    activeBranches.push({
      x: width / 2, // Exactly horizontal center
      y: height,    // Bottom of screen extending fully up
      angle: -Math.PI / 2,
      length: 0,
      targetLength: Math.min(height * 0.25, 200), // Responsive trunk height
      depth: 0,
      thickness: 12,
      color: `hsla(160, 80%, 50%, 0.8)`
    });

    // --- STORY LINES (House & Children) ---
    let storyLines: {
      sx: number, sy: number, ex: number, ey: number, 
      cx: number, cy: number, 
      progress: number, thickness: number, color: string
    }[] = [];

    const addLine = (sx: number, sy: number, ex: number, ey: number, thickness: number, color: string) => {
      storyLines.push({ sx, sy, ex, ey, cx: sx, cy: sy, progress: 0, thickness, color });
    };

    // Responsive positioning for the story
    const houseX = width * 0.75;
    const houseY = height - 60; // Slightly above bottom to show ground connection
    const s = Math.min(60, width * 0.05); // Dynamic scale
    const houseColor = 'hsla(30, 80%, 50%, 0.5)'; // Faint amber for the background story
    const kidColor = 'hsla(160, 60%, 50%, 0.5)'; // Faint bioluminescent green, touched by the tree

    // 1. Draw House Walls & Roof
    addLine(houseX, houseY, houseX, houseY - s, 2, houseColor); // Left wall
    addLine(houseX + s*1.5, houseY, houseX + s*1.5, houseY - s, 2, houseColor); // Right wall
    addLine(houseX - 10, houseY, houseX + s*1.5 + 10, houseY, 2, houseColor); // Floor / Ground line
    addLine(houseX - 10, houseY - s, houseX + s*0.75, houseY - s*1.5, 2, houseColor); // Roof left
    addLine(houseX + s*1.5 + 10, houseY - s, houseX + s*0.75, houseY - s*1.5, 2, houseColor); // Roof right

    // House Door
    addLine(houseX + s*0.5, houseY, houseX + s*0.5, houseY - s*0.4, 1.5, houseColor);
    addLine(houseX + s*1.0, houseY, houseX + s*1.0, houseY - s*0.4, 1.5, houseColor);
    addLine(houseX + s*0.5, houseY - s*0.4, houseX + s*1.0, houseY - s*0.4, 1.5, houseColor);

    // 2. Draw Children (Standing between tree and house)
    const kidX = houseX - s * 1.5;
    
    // Child 1 (Taller, pointing at the tree)
    addLine(kidX, houseY, kidX, houseY - 15, 2, kidColor); // Torso/Legs
    addLine(kidX, houseY - 15, kidX - 10, houseY - 25, 1.5, kidColor); // Arm pointing left/up to tree
    addLine(kidX, houseY - 15, kidX + 8, houseY - 5, 1.5, kidColor); // Arm down

    // Child 2 (Smaller, holding hands)
    const kid2X = kidX + 15;
    addLine(kid2X, houseY, kid2X, houseY - 10, 1.5, kidColor); // Torso
    addLine(kidX + 8, houseY - 5, kid2X, houseY - 8, 1.5, kidColor); // Holding hands

    let animationFrameId: number;

    const draw = () => {
      // Allow rendering to continue until both tree and story are fully drawn
      if (activeBranches.length === 0 && storyLines.length === 0) return;

      // 1. Draw Tree Branches 
      let nextBranches: typeof activeBranches = [];
      activeBranches.forEach(b => {
        const growthSpeed = Math.max(1, 4 - b.depth * 0.3); 
        
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);

        b.length += growthSpeed;
        const reachedTarget = b.length >= b.targetLength;
        const stepLength = reachedTarget ? (b.targetLength - (b.length - growthSpeed)) : growthSpeed;

        b.x += Math.cos(b.angle) * stepLength;
        b.y += Math.sin(b.angle) * stepLength;

        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.thickness;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 255, 170, 0.4)';
        ctx.stroke();

        if (reachedTarget) {
          if (b.depth < maxDepth) {
            const numChildren = b.depth < 4 ? 2 : (Math.random() > 0.4 ? 2 : 1);
            for (let i = 0; i < numChildren; i++) {
              const spread = (Math.PI / 3) * (1 - b.depth * 0.08); 
              const newAngle = b.angle + (Math.random() * spread - spread / 2) + (i === 0 ? -0.25 : 0.25);
              const newDepth = b.depth + 1;
              const newThickness = Math.max(0.5, b.thickness * 0.7);
              
              nextBranches.push({
                x: b.x, y: b.y, angle: newAngle,
                targetLength: b.targetLength * (0.7 + Math.random() * 0.2),
                length: 0, depth: newDepth, thickness: newThickness,
                color: `hsla(160, 80%, ${50 + newDepth * 2}%, ${0.9 - newDepth * 0.05})`
              });
            }
          }
        } else {
          nextBranches.push(b);
        }
      });
      activeBranches = nextBranches;

      // 2. Draw Story Lines (House & Children)
      let nextStoryLines: typeof storyLines = [];
      storyLines.forEach(line => {
        if (line.progress >= 1) return; // Done

        ctx.beginPath();
        ctx.moveTo(line.cx, line.cy);

        // Draw 2% of the line distance per frame for slow sketching effect
        line.progress += 0.015;
        if (line.progress > 1) line.progress = 1;

        line.cx = line.sx + (line.ex - line.sx) * line.progress;
        line.cy = line.sy + (line.ey - line.sy) * line.progress;

        ctx.lineTo(line.cx, line.cy);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.thickness;
        ctx.shadowBlur = 5;
        ctx.shadowColor = line.color.includes('160') ? 'rgba(0, 255, 170, 0.4)' : 'rgba(255, 170, 0, 0.4)';
        ctx.stroke();

        if (line.progress < 1) {
          nextStoryLines.push(line);
        } else {
          // If a torso line just finished, draw the head circle!
          if (line.sx === kidX && line.sy === houseY && line.ex === kidX && line.ey === houseY - 15) {
             ctx.beginPath();
             ctx.arc(kidX, houseY - 20, 4, 0, Math.PI * 2);
             ctx.fillStyle = kidColor;
             ctx.fill();
          }
          if (line.sx === kid2X && line.sy === houseY && line.ex === kid2X && line.ey === houseY - 10) {
             ctx.beginPath();
             ctx.arc(kid2X, houseY - 14, 3, 0, Math.PI * 2);
             ctx.fillStyle = kidColor;
             ctx.fill();
          }
        }
      });
      storyLines = nextStoryLines;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] flex justify-center items-end opacity-[0.35] pointer-events-none overflow-hidden mix-blend-screen">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <GlowingOrbs />
    </div>
  );
}
