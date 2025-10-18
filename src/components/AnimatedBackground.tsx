
'use client';
import { useEffect, useRef, type ReactNode } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const AnimatedBackground = ({ children }: { children: ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 70;
    const maxDistance = 120;
    
    // Check if the theme variables are available before using them
    const rootStyle = getComputedStyle(document.documentElement);
    let accentColor = rootStyle.getPropertyValue('--accent').trim();
    if (!accentColor) {
        // Fallback color if CSS variable isn't loaded yet
        accentColor = '30 100% 50%'; 
    }
    const particleColor = `hsl(${accentColor})`;

    const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (!parent) return;

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 1,
            });
        }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particleColor;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 1 - distance / maxDistance;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrameId);
    };

  }, []);

  return (
    <div className="relative w-full h-full">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
        <div className="relative z-10">
            {children}
        </div>
    </div>
  );
};

export default AnimatedBackground;
