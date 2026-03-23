'use client';

import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  triggerOffset?: string; // e.g., 'top 80%'
  yOffset?: number; // Starting Y position for parallax
}

export function ScrollSection({ 
  children, 
  className, 
  triggerOffset = 'top 70%',
  yOffset = 50 
}: ScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const el = contentRef.current;

    // Set initial state
    gsap.set(el, { y: yOffset, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: triggerOffset,
      onEnter: () => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
        });
      },
      // Optional: reverse animation when scrolling back up past the start
      onLeaveBack: () => {
        gsap.to(el, {
          y: yOffset,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.in',
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, [triggerOffset, yOffset]);

  return (
    <section ref={sectionRef} className={cn("relative min-h-screen flex items-center justify-center pointer-events-none", className)}>
      <div 
        ref={contentRef} 
        className="w-full h-full pointer-events-auto"
      >
        {children}
      </div>
    </section>
  );
}
