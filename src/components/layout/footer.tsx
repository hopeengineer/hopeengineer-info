import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-background/20 backdrop-blur-md relative z-20 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-4 md:px-0">
          <Code className="hidden h-5 w-5 text-primary md:block" />
          <p className="text-center font-code text-xs uppercase tracking-widest text-white/40 md:text-left">
            &copy; {currentYear} HopeEngineer Hub.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {SOCIAL_LINKS.map((social) => (
            <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" aria-label={social.name} className="text-white/40 hover:text-primary hover:bg-white/5 transition-all">
                <social.icon className="h-4 w-4" />
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
