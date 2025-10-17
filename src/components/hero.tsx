'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const AnimatedHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const particleCount = 70;
    const maxDistance = 120;
    
    const theme = getComputedStyle(document.documentElement);
    const accentColor = theme.getPropertyValue('--accent').trim();
    const particleColor = `hsl(${accentColor})`;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        
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

    const animate = () => {
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
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener('resize', resizeCanvas);
    };

  }, []);

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center text-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full bg-background" />

      <div className="container px-4 md:px-6 z-10">
        <div className="grid gap-6 lg:gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-foreground">
              Engineer Your Hope,
              <br />
              Build Your Future.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Exploring the intersection of technology, personal growth, and artificial intelligence.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <Link href="/work-with-me">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Work With Me
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="border-primary hover:bg-primary/20">
                Explore Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;
