
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Code, Inbox } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { getAuth } from "firebase/auth";
import { LogoIcon } from "../icons";

const Header = () => {
  const pathname = usePathname();
  const { user, isUserLoading, isAdmin } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              HopeEngineer Hub
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 p-4">
                  <Link href="/" className="flex items-center space-x-2">
                     <Code className="h-6 w-6 text-primary" />
                     <span className="font-bold font-headline">HopeEngineer Hub</span>
                  </Link>
                  <nav className="flex flex-col space-y-2">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium",
                          pathname === link.href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">HopeEngineer</span>
          </Link>
          <nav className="flex items-center">
          {isUserLoading ? (
              <div /> 
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                       <DropdownMenuItem asChild>
                        <Link href="/inbox">
                          <Inbox className="mr-2 h-4 w-4" />
                          Inbox
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
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
