
'use client';

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/data";
import Testimonials from "@/components/testimonials";
import { ContactForm } from "@/components/contact-form";

const WorkWithMePage = () => {

  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
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
                <CardDescription>
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
                <Button onClick={scrollToContactForm} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Get Started
                </Button>
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
  );
};

export default WorkWithMePage;
