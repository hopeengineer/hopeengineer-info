'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollSection } from '../scroll/ScrollSection';

export function ContactCTASection() {
  return (
    <ScrollSection triggerOffset="top 80%" className="min-h-screen py-24 md:py-32 flex items-center justify-center text-center">
      <div className="container px-4 md:px-6 z-10">
        <div className="glass-panel max-w-3xl mx-auto p-12 md:p-24 relative overflow-hidden group">
          {/* Glowing accent orb inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 rounded-full"></div>
          
          <h2 className="text-sm font-code tracking-[0.2em] text-primary uppercase mb-6">Reach Out</h2>
          <h3 className="text-5xl md:text-7xl font-headline font-bold text-gradient-light mb-8">
            Ready to <br/> Build?
          </h3>
          <p className="text-muted-foreground text-lg md:text-xl font-body mb-10 max-w-xl mx-auto">
            Whether you need a full-scale AI automation system or technical consulting on your next project, let's engineer something that matters.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-8 py-6 text-lg rounded-full" asChild>
            <Link href="/work-with-me">
              Start a Conversation
            </Link>
          </Button>
        </div>
      </div>
    </ScrollSection>
  );
}
