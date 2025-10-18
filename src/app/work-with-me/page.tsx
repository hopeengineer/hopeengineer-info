

'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/data";
import Testimonials from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

const WorkWithMePage = () => {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleCustomAutomationClick = () => {
    setIsAiDialogOpen(false);
    // Use a timeout to ensure the dialog has closed before scrolling
    setTimeout(() => {
      scrollToContactForm();
    }, 300);
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
          <AnimatedBackground><div/></AnimatedBackground>
      </div>
      <div className="relative z-10 container max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Work With Me
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Let's collaborate to build something amazing. Here's how I can help.
          </p>
        </header>

        <Testimonials />

        <div className="mt-20">
          <h2 className="text-3xl font-headline font-bold text-center mb-12">My Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20">
                <div className="relative h-48 w-full">
                  <Image
                    src={service.image.imageUrl}
                    alt={service.title}
                    fill
                    style={{objectFit: 'cover'}}
                    className="rounded-t-lg"
                    data-ai-hint={service.image.imageHint}
                  />
                </div>
                <CardHeader className="flex-1">
                  <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                  {service.tagline && <p className="text-sm text-foreground/90 font-semibold pt-1">{service.tagline}</p>}
                  <CardDescription className="pt-4">
                    {Array.isArray(service.description) ? (
                      <div className="space-y-2">
                        {service.description.map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    ) : (
                      service.description
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.id === 'ai-automation' ? (
                     <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                          Get Started
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-headline text-2xl">AI Automation Inquiry</DialogTitle>
                          <DialogDescription>
                            Choose an option below to get started with AI.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                           <p>
                            For a personalized AI solution tailored to your needs, send me a message and we can design it together.
                          </p>
                          <Button onClick={handleCustomAutomationClick} className="w-full">
                            Request Custom Automation
                          </Button>
                          <p className="pt-4">
                            Or, feel free to try out some of the AI applications I've already built.
                          </p>
                          <Button variant="outline" asChild className="w-full">
                             <Link href="/ai-apps">
                              Explore AI Apps <ArrowRight className="ml-2 h-4 w-4" />
                             </Link>
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : service.externalUrl ? (
                    <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href={service.externalUrl} target="_blank" rel="noopener noreferrer">
                        Get Started
                      </Link>
                    </Button>
                  ) : (
                    <Button onClick={scrollToContactForm} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      Get Started
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

         <div className="mt-20 text-center">
          <h2 className="text-3xl font-headline font-bold mb-4">Ready to Begin?</h2>
          <p className="text-muted-foreground mb-6 max-w-prose mx-auto">
            If you have a project in mind or want to learn more about my services, don't hesitate to reach out. I'm excited to hear from you.
          </p>
          <Button size="lg" onClick={scrollToContactForm}>
            Contact Me
          </Button>
        </div>
        
        <div className="mt-20">
          <ContactForm />
        </div>

      </div>
    </div>
  );
};

export default WorkWithMePage;
