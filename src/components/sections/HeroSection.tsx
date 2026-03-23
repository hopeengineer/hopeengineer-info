'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <div className="container relative h-screen flex flex-col justify-center px-4 md:px-6 z-10 w-full">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          <h1 className="text-5xl font-headline font-bold tracking-tighter sm:text-6xl md:text-[5.5rem] lg:text-[7rem] leading-[1.1] text-foreground drop-shadow-2xl">
            Engineer Your <br className="hidden sm:block" />
            <span className="text-gradient-primary">Hope.</span>
          </h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl font-body leading-relaxed">
            I am Sameera aka hopeengineer, a software architect building robust, scalable systems that outlast the trends. I partner with those who are ready to stop drifting, turn their potential into purpose, and <strong className="text-emerald-400 font-medium">build something real.</strong>
          </p>
        </div>
        <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center mt-8 w-full sm:w-auto">
          <Link href="/work-with-me">
            <Button size="lg" className="w-full sm:w-[220px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 backdrop-blur-md font-semibold text-base py-6">
              Start a Project
            </Button>
          </Link>
          <Link href="/blog">
            <Button size="lg" variant="outline" className="w-full sm:w-[220px] border-white/20 hover:bg-white/10 hover:text-white glass font-semibold text-base py-6">
              Explore Thinking
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 animate-bounce">
        <span className="text-xs uppercase tracking-[0.3em] font-code mb-2">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}
