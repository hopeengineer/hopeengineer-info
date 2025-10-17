import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/data";

const WorkWithMePage = () => {
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Work With Me
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Let's collaborate to build something amazing. Here's how I can help.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.title} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20">
            <div className="relative h-48 w-full">
              <Image
                src={service.image.imageUrl}
                alt={service.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                data-ai-hint={service.image.imageHint}
              />
            </div>
            <CardHeader className="flex-1">
              <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="#">
                  Get Started
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

       <div className="mt-20 text-center">
        <h2 className="text-3xl font-headline font-bold mb-4">Ready to Begin?</h2>
        <p className="text-muted-foreground mb-6 max-w-prose mx-auto">
          If you have a project in mind or want to learn more about my services, don't hesitate to reach out. I'm excited to hear from you.
        </p>
        <Button size="lg">
          Contact Me
        </Button>
      </div>

    </div>
  );
};

export default WorkWithMePage;
