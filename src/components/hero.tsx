'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const AnimatedHero = () => {
  const [particles, setParticles] = useState<
    {
      id: number;
      left: string;
      top: string;
      size: number;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center text-center overflow-hidden">
      <div className="hero-bg">
        {particles.map((p) => (
          <div
            key={p.id}
            className="hero-bg-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

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
