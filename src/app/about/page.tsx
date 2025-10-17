import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SOCIAL_LINKS } from "@/lib/data";

const AboutPage = () => {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-me');

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          About Me
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          The mind and mission behind HopeEngineer Hub.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1 flex justify-center">
          {aboutImage && (
            <Image 
              src={aboutImage.imageUrl}
              alt="A portrait of HopeEngineer"
              width={300}
              height={300}
              className="rounded-full object-cover aspect-square border-4 border-primary shadow-lg"
              data-ai-hint={aboutImage.imageHint}
            />
          )}
        </div>
        <div className="md:col-span-2 space-y-6 text-lg text-foreground/80">
          <p>
            Hello! I'm the HopeEngineer. My journey is one of passion for technology and a deep-seated belief in human potential. I started this platform as a way to merge my love for engineering with my desire to inspire hope and drive positive change.
          </p>
          <p>
            With a background in software engineering and a fascination with artificial intelligence, I've spent years building complex systems and solving intricate problems. However, I realized that the most powerful systems we can build are not just made of code, but of people, ideas, and shared aspirations.
          </p>
          <p>
            HopeEngineer Hub is my corner of the internet to share what I've learned, explore the frontiers of AI, and help others engineer their own paths to success and fulfillment. Whether you're a fellow engineer, a creative professional, or just someone curious about the future, I'm glad you're here.
          </p>
        </div>
      </div>

      <div className="mt-20">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-headline">Connect With Me</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
             <p className="text-muted-foreground text-center max-w-md">
              Let's connect on social media or discuss how we can work together. I'm always open to new ideas and collaborations.
            </p>
            <div className="flex items-center space-x-4">
              {SOCIAL_LINKS.map(social => (
                <Link href={social.href} key={social.name} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" aria-label={social.name}>
                    <social.icon className="w-5 h-5" />
                  </Button>
                </Link>
              ))}
            </div>
            <div className="pt-4">
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="mailto:contact@hopeengineer.com">
                  Send me an Email
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
