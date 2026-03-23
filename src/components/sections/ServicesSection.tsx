'use client';

import { services } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollSection } from '../scroll/ScrollSection';
import Image from 'next/image';

export function ServicesSection() {
  return (
    <ScrollSection triggerOffset="top 80%" className="min-h-[120vh] py-24 md:py-32 flex items-center">
      <div className="container px-4 md:px-6 z-10">
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <h2 className="text-sm font-code tracking-[0.2em] text-primary uppercase mb-4">The S-ION Ecosystem</h2>
          <h3 className="text-4xl md:text-6xl font-headline font-bold text-gradient-light max-w-3xl leading-tight">
            Scalable Impact <br/> Architecture
          </h3>
          <p className="max-w-[700px] mt-6 text-muted-foreground md:text-xl font-body">
            From eco-friendly web infrastructure to AI-driven empowerment tools, every solution is built to sit at the intersection of Sustainability, Technology, and Humanity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <div 
              key={service.id} 
              className="glass-card group overflow-hidden flex flex-col"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative h-48 w-full overflow-hidden">
                {service.image ? (
                  <Image
                    src={service.image.imageUrl}
                    alt={service.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={service.image.imageHint}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-background opacity-50"></div>
                )}
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10"></div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col items-start bg-secondary/20 relative z-20">
                <h4 className="text-2xl font-headline font-bold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h4>
                <p className="text-sm font-semibold text-white/80 mb-4">{service.tagline}</p>
                <div 
                  className="text-muted-foreground text-sm flex-1 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: Array.isArray(service.description) ? service.description[0] : service.description }}
                />
                
                <div className="mt-8">
                  {service.externalUrl ? (
                    <Button variant="outline" className="glass border-white/20 hover:bg-primary/20 hover:border-primary/50" asChild>
                      <Link href={service.externalUrl} target="_blank" rel="noopener noreferrer">
                        Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" className="glass border-white/20 hover:bg-primary/20 hover:border-primary/50" asChild>
                      <Link href="/work-with-me">
                        Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
