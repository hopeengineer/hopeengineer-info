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
              After years of building systems, chasing growth, and living fast, the mission shifted. I realized that technology should not just advance the world - it must uplift humanity.
            </p>
            <p>
              Today, my work flows through <strong className="text-white">S-ION</strong> (Sustainable Impact-Oriented Network). Every digital product, AI architecture, and automation system I engineer must pass one filter: <em className="text-primary/90">"Does this make life better for people and the planet?"</em>
            </p>
            <p className="text-sm md:text-base border-t border-white/10 pt-6 mt-6 text-white/70">
              If S-ION is the engine, the <strong className="text-white">S-ION Foundation</strong> is the soul - ensuring education, resources, and sustainable opportunities reach the underserved communities that need them most.
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
