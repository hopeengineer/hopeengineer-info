
'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";
import Testimonials from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";

export default function WorkWithMePage() {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCustomAutomationClick = () => {
    setIsAiDialogOpen(false);
    setTimeout(() => {
      scrollToContactForm();
    }, 300);
  };

  return (
    <div className="relative pt-32 pb-24 z-10 w-full min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-gradient-light mb-6">
            Work With Me
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-body">
            Let's collaborate to build something amazing. Here's how I can help.
          </p>
        </header>

        {/* Testimonials */}
        <div className="mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <Testimonials />
        </div>

        {/* Services Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-headline font-bold text-gradient-light">My Services</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div 
                key={service.title} 
                className="glass-card overflow-hidden flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
                  <Image
                    src={service.image.imageUrl}
                    alt={service.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={service.image.imageHint}
                  />
                </div>
                
                <div className="flex-1 p-8 flex flex-col items-start bg-secondary/10">
                  <h3 className="font-headline text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                  {service.tagline && <p className="text-xs font-code uppercase tracking-wider text-primary mb-4">{service.tagline}</p>}
                  
                  <div className="text-muted-foreground text-sm flex-1 space-y-2 leading-relaxed mb-8">
                    {Array.isArray(service.description) ? (
                      <div className="space-y-3 text-muted-foreground leading-relaxed flex-1">
                        {service.description.map((line, index) => (
                          <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
                        ))}
                      </div>
                    ) : (
                      <p dangerouslySetInnerHTML={{ __html: service.description }} />
                    )}
                  </div>
                  
                  <div className="w-full mt-auto">
                    {service.id === 'ai-automation' ? (
                      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                            Get Started
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-panel border-white/10 sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="font-headline text-2xl text-gradient-light">AI Automation Inquiry</DialogTitle>
                            <DialogDescription className="text-white/60">
                              Choose an option below to get started with AI.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-6 space-y-6">
                            <div className="space-y-3">
                              <p className="text-sm font-body text-white/80">
                                For a personalized AI solution tailored to your needs, send me a message and we can design it together.
                              </p>
                              <Button onClick={handleCustomAutomationClick} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                Request Custom Automation
                              </Button>
                            </div>
                            
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
                              <div className="relative flex justify-center text-xs text-white/40 uppercase tracking-widest"><span className="bg-background px-2">Or</span></div>
                            </div>
                            
                            <div className="space-y-3">
                              <p className="text-sm font-body text-white/80">
                                Feel free to try out some of the AI applications I've already built.
                              </p>
                              <Button variant="outline" asChild className="w-full border-white/20 glass hover:bg-white/10">
                                <Link href="/ai-apps">
                                  Explore AI Apps <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : service.externalUrl ? (
                      <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        <Link href={service.externalUrl} target="_blank" rel="noopener noreferrer">
                          Get Started
                        </Link>
                      </Button>
                    ) : (
                      <Button onClick={scrollToContactForm} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                        Get Started
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div id="contact-form" className="max-w-3xl mx-auto glass-panel p-8 md:p-16 scroll-mt-32">
          <div className="text-center mb-12">
            <h2 className="text-xs font-code tracking-[0.2em] text-primary uppercase mb-4">Initialize Connection</h2>
            <h3 className="text-3xl md:text-5xl font-headline font-bold text-gradient-light mb-4">Ready to Begin?</h3>
            <p className="text-muted-foreground font-body">
              If you have a project in mind or want to learn more about my services, don't hesitate to reach out.
            </p>
          </div>
          
          <ContactForm />
        </div>

      </div>
    </div>
  );
}
