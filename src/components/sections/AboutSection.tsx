'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollSection } from '../scroll/ScrollSection';

export function AboutSection() {
  return (
    <ScrollSection className="min-h-screen py-24 md:py-32 flex items-center">
      <div className="container px-4 md:px-6 z-10 max-w-4xl mx-auto">
        <div className="glass-panel p-8 md:p-16 space-y-8 flex flex-col items-center text-center">
          <h2 className="text-sm font-code tracking-[0.2em] text-primary uppercase">The Mission</h2>
          <h3 className="text-3xl md:text-5xl font-headline font-semibold text-foreground leading-tight">
            Building for <br className="md:hidden" />
            <span className="text-muted-foreground">Impact, Not Validation</span>
          </h3>
          
          <div className="space-y-6 text-muted-foreground md:text-lg font-body leading-relaxed max-w-2xl mx-auto text-left sm:text-center">
            <p>
              I left a stable tech career in the UK at a time when most people would have stayed. From the outside, my life looked "figured out," but behind the scenes, I was losing control to a lifestyle of escaping reality.
            </p>
            <p>
              In August 2023, I hit a profound breaking point. I made the decision to walk away from everything - quitting substances, leaving the UK, and returning to Sri Lanka to completely reset. 
            </p>
            <p className="text-sm md:text-base border-t border-white/10 pt-6 mt-6 text-white/70">
              That pain turned into direction. Today, my engineering flows exclusively through <strong className="text-white">S-ION</strong> - building scalable technology and AI systems designed not for validation, but to create real impact and redirection for others.
            </p>
          </div>
          
          <div className="pt-6">
            <Link href="/about">
              <Button variant="link" className="text-primary hover:text-primary/80 px-0 group text-lg">
                Read the Origin Story <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}
