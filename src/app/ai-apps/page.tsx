

import Link from "next/link";
import Image from "next/image";
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { aiApps } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import CountdownPopup from "@/components/CountdownPopup";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'AI Apps & Automations',
  description: 'A collection of custom-built artificial intelligence applications and data automations designed by HopeEngineer to solve real-world problems.',
  alternates: {
    canonical: '/ai-apps',
  },
};

const AiAppsPage = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        <AnimatedBackground><div/></AnimatedBackground>
      </div>
      <div className="relative z-10 container max-w-6xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <CountdownPopup />
        <header className="text-center mb-12">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            My AI Apps
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            A collection of custom-built AI applications designed to solve real-world problems.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {aiApps.map((app) => {
            const isAvailable = app.status === 'Available';
            return (
              <Card 
                key={app.title} 
                className={cn(
                  "flex flex-col transform transition-all duration-300 bg-background/80 backdrop-blur-sm",
                  isAvailable ? "hover:scale-105 hover:shadow-2xl hover:shadow-accent/20" : "opacity-60 cursor-not-allowed"
                )}
              >
                <CardHeader className="flex-row items-start gap-4">
                  <Image 
                    src={app.image.imageUrl}
                    alt={`${app.title} icon`}
                    width={56}
                    height={56}
                    className="rounded-lg border-2 border-border"
                    data-ai-hint={app.image.imageHint}
                  />
                  <div className="flex-1">
                    <CardTitle className="font-headline text-xl">{app.title}</CardTitle>
                  </div>
                   {app.badge && (
                      <Badge variant={isAvailable ? 'default' : 'secondary'} className={cn(isAvailable && "bg-accent text-accent-foreground")}>
                          {app.badge}
                      </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="flex-1">{app.description}</CardDescription>
                  <Button asChild variant="outline" className="mt-4 w-full" disabled={!isAvailable}>
                    {isAvailable ? (
                      <Link href={app.href} target="_blank" rel="noopener noreferrer">
                        Launch App
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    ) : (
                      <span>
                        Launch App
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AiAppsPage;
