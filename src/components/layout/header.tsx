"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Code, Inbox } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useUser, useSupabase } from "@/hooks/use-supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const pathname = usePathname();
  const { user, isUserLoading, isAdmin } = useUser();
  const { supabase } = useSupabase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/20 backdrop-blur-xl">
      <div className="container flex h-20 items-center transition-all duration-300">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-2 group">
            <Image src="/images/profile-circle.png" alt="HopeEngineer Profile Logo" width={44} height={44} className="rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 border-2 border-transparent group-hover:border-primary/50 shadow-[0_0_15px_rgba(255,170,0,0.1)] group-hover:shadow-[0_0_20px_rgba(255,170,0,0.7)]" />
            <span className="hidden font-bold sm:inline-block font-headline text-lg tracking-wide text-gradient-light group-hover:text-white transition-colors">
              HopeEngineer
            </span>
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium font-code tracking-wider uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-all duration-300 py-2 relative group",
                  pathname === link.href ? "text-primary" : "text-white/60 hover:text-white"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full shadow-[0_0_10px_rgba(255,170,0,0.8)]"></span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background/80 backdrop-blur-2xl border-r border-white/10">
                <div className="flex flex-col space-y-6 p-4">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image src="/images/profile-circle.png" alt="HopeEngineer Profile Logo" width={36} height={36} className="rounded-full" />
                    <span className="font-bold font-headline text-gradient-light">HopeEngineer</span>
                  </Link>
                  <nav className="flex flex-col space-y-4 font-code uppercase text-sm tracking-wider">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "px-2 py-2 transition-colors",
                          pathname === link.href ? "text-primary border-l-2 border-primary" : "text-white/60 hover:text-white"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Image src="/images/profile-circle.png" alt="HopeEngineer Profile Logo" width={36} height={36} className="rounded-full" />
            <span className="font-bold font-headline text-gradient-light transition-colors">HopeEngineer</span>
          </Link>
          <nav className="flex items-center">
            {isUserLoading ? (
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/90 backdrop-blur-xl border border-white/10">
                  <DropdownMenuLabel className="font-code text-xs tracking-wider uppercase text-white/50">My System</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="focus:bg-white/10">
                    <Link href="/profile">Profile Core</Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuLabel className="font-code text-xs tracking-wider uppercase text-primary/80">Admin Override</DropdownMenuLabel>
                      <DropdownMenuItem asChild className="focus:bg-white/10">
                        <Link href="/inbox">
                          <Inbox className="mr-2 h-4 w-4" />
                          Inbox
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}

                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive-foreground focus:bg-destructive/80">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Terminate Session</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-4 md:flex">
                <Button variant="ghost" asChild className="font-code text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white">
                  <Link href="/login">Authenticate</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
