import Image from "next/image";
import Link from "next/link";
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SOCIAL_LINKS } from "@/lib/data";
import { Compass, Flame, RefreshCcw, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: 'About Sameera | HopeEngineer',
  description: 'A former software engineer who walked away from a stable life in the UK, overcame destructive habits, and rebuilt from scratch in Sri Lanka to create S-ION.',
  alternates: {
    canonical: '/about',
  },
};

const AboutPage = () => {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-me');

  return (
    <div className="min-h-screen pt-32 pb-24 overflow-hidden relative">
      {/* Background Cinematic Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-4 md:px-6 z-10 relative">
        
        {/* Header Section */}
        <header className="text-center mb-24 space-y-6">
          <h2 className="text-sm font-code tracking-[0.3em] text-primary uppercase">The Raw Truth</h2>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight text-foreground drop-shadow-xl">
            Pain Turned Into<br />
            <span className="text-muted-foreground text-3xl md:text-5xl font-medium mt-4 block">
              Direction.
            </span>
          </h1>
        </header>

        {/* Introduction */}
        <div className="space-y-8 text-xl font-body text-muted-foreground leading-relaxed mb-32 border-l-2 border-primary/30 pl-8">
          <p className="text-2xl text-white font-medium">
            I didn't leave because I failed.
          </p>
          <p>
            I left the UK at a time when most people would have stayed. I had a stable career in tech, years of experience, and a life that looked perfectly “figured out” from the outside.
          </p>
          <p className="text-white">
            But the truth? <strong className="text-primary font-semibold">I was drifting.</strong>
          </p>
        </div>

        {/* Act I: The Reality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/20 to-black blur-3xl rounded-full" />
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt="Sameera"
                width={400}
                height={400}
                className="rounded-2xl object-cover aspect-square border border-white/10 shadow-2xl relative z-10 grayscale opacity-80"
                priority
              />
            )}
          </div>
          <div className="space-y-8 text-lg font-body text-muted-foreground leading-relaxed">
            <h3 className="text-3xl font-headline text-white font-semibold flex items-center gap-3">
              <ShieldAlert className="text-rose-500 w-8 h-8" /> Losing Control
            </h3>
            <p>
              Behind the scenes, my life wasn’t aligned. I went through a dark phase of drinking heavily, partying constantly, and using substances. I was escaping instead of facing reality.
            </p>
            <p>
              It didn’t happen overnight. It built up slowly. What looked like “living life” was actually losing complete control of my direction.
            </p>
          </div>
        </div>

        {/* Act II: August 2023 */}
        <div className="mb-32">
          <Card className="glass-panel border-rose-500/20 bg-black/40 p-10 md:p-16">
            <CardContent className="p-0 space-y-8 text-center max-w-2xl mx-auto">
              <Flame className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-3xl font-headline text-white font-bold tracking-wide">
                The Moment Everything Changed
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In August 2023, I hit the absolute bottom. It wasn't just a realization; it was a physical moment. I was standing on a bridge in Widnes, ready to end it all for good. I had to face myself fully, looking at exactly where my path had led.
              </p>
              <p className="text-xl text-white/90 italic font-medium pt-6">
                That moment could’ve been the end. But instead, it became the ultimate turning point. Not because stepping back was easy - but because it forced everything to finally become real.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Act III: The Reset */}
        <div className="space-y-12 mb-32">
          <h3 className="text-3xl font-headline text-white font-semibold flex items-center gap-3 justify-center mb-12">
            <RefreshCcw className="text-emerald-500 w-8 h-8" /> The Decision That Changed My Life
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                I made a decision most people still don’t understand: <strong className="text-white">I walked away.</strong>
              </p>
              <p>
                Not just from a place, but from a version of myself. I quit drinking. I quit smoking. I quit substances. I completely let go of the lifestyle that was pulling me down.
              </p>
              <p>
                And then I did something even harder...
              </p>
            </div>
            <div className="glass-panel border-emerald-500/20 bg-emerald-950/10 p-8 rounded-2xl space-y-4">
              <h4 className="text-2xl font-headline text-emerald-400 font-semibold">
                I left the UK and came back to Sri Lanka.
              </h4>
              <p className="text-muted-foreground text-lg">
                Not because the UK was the problem. Not because I couldn’t succeed there. But because I needed a profound reset. I needed a new environment, and the space to rebuild with deep intention.
              </p>
            </div>
          </div>
        </div>

        {/* Act IV: The True Meaning of S-ION */}
        <div className="mb-32">
          <Card className="glass-panel border-primary/20 bg-black/40 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5" />
            <CardContent className="p-0 space-y-8 relative z-10">
              <Compass className="w-12 h-12 text-primary mb-6" />
              <h3 className="text-3xl font-headline text-white font-bold tracking-wide">
                The Truth Most People Miss
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                When I came back, I didn’t have everything figured out. What I had was clarity, pain turned into direction, and a deep need to build something meaningful. That’s where <strong className="text-white">S-ION</strong> started. Not as a business plan. But as a response to my past.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                What I went through defines how I build today. I don’t create for validation, trends, or quick wins. I build for impact, purpose, and long-term change. Because I know what it feels like to have potential but no direction—to be “doing well” but feel lost.
              </p>
              <div className="border-t border-white/10 pt-8 mt-8">
                <p className="text-2xl text-emerald-400 font-headline font-semibold">
                  S-ION isn’t just about sustainability or tech. It’s about redirection.
                </p>
                <p className="text-lg text-muted-foreground mt-4">
                  Taking people who feel stuck, lost, or misaligned, and helping them build something real. Because I’ve been there.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connect Section */}
        <div className="text-center space-y-8 pb-12">
          <p className="text-xl text-white font-medium">Ready to build something real?</p>
          <div className="flex justify-center items-center gap-6">
            {SOCIAL_LINKS.map(social => (
              <Link href={social.href} key={social.name} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-full border-white/20 hover:bg-white hover:text-black transition-all" aria-label={social.name}>
                  <social.icon className="w-5 h-5" />
                </Button>
              </Link>
            ))}
          </div>
          <div className="pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 h-14 text-lg rounded-full shadow-lg shadow-primary/25 transition-transform hover:scale-105">
              <Link href="mailto:csoft.sameera@gmail.com">
                Reach Out
              </Link>
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AboutPage;
