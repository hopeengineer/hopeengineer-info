import Link from "next/link";
import { Code } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Code className="hidden h-6 w-6 text-primary md:block" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} HopeEngineer Hub. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {SOCIAL_LINKS.map((social) => (
            <Link key={social.name} href={social.href}>
              <Button variant="ghost" size="icon" aria-label={social.name}>
                <social.icon className="h-5 w-5" />
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
