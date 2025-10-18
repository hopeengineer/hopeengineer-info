
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const Hero = () => {
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-portrait');
  return (
    <section className="w-full h-[80vh] flex items-center justify-center text-center overflow-hidden bg-background">
      <AnimatedBackground>
        <div className="container px-4 md:px-6 h-[80vh] flex items-center justify-center">
          <div className="grid gap-6 lg:gap-8">
            <div className="space-y-4 flex flex-col items-center">
                {heroImage && (
                    <Image 
                        src={heroImage.imageUrl}
                        alt="A portrait of HopeEngineer"
                        width={128}
                        height={128}
                        className="rounded-full object-cover aspect-square shadow-lg mb-4"
                        data-ai-hint={heroImage.imageHint}
                        priority
                    />
                )}
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
      </AnimatedBackground>
    </section>
  );
};

export default Hero;
