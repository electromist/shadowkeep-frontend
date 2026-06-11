"use client";

import { type VariantProps } from "class-variance-authority";
import { Menu } from "lucide-react";
import { ReactNode, useEffect } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import Navigation from "../../ui/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo = <img src="/logo.png" alt="ShadowKeep Logo" className="h-8 w-auto filter brightness-110" />,
  name = "ShadowKeep",
  homeUrl = "/",
  mobileLinks = [
    { text: "Documentation", href: "#" },
    { text: "Core API", href: "#" },
    { text: "Security Gimmicks", href: "#" },
  ],
  actions = [
    { text: "Login", href: "/login", isButton: false },
    {
      text: "Get Started",
      href: "/register",
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <header className={cn("sticky top-4 z-50 w-full max-w-container mx-auto px-4", className)}>
      <NavbarComponent className="rounded-full border glass-3 bg-zinc-950/45 backdrop-blur-md px-6 py-2.5 shadow-lg shadow-black/30">
        <NavbarLeft>
          <a
            href={homeUrl}
            className="flex items-center gap-2 text-xl font-bold"
          >
            {logo}
            {name}
          </a>
          {showNavigation && (customNavigation || <Navigation />)}
        </NavbarLeft>
        <NavbarRight>
          {actions.map((action) =>
            action.isButton ? (
              <Button
                key={`${action.href}-${action.text}`}
                variant={action.variant || "default"}
                asChild
              >
                <Link href={action.href}>
                  {action.icon}
                  {action.text}
                  {action.iconRight}
                </Link>
              </Button>
            ) : (
              <Link
                key={`${action.href}-${action.text}`}
                href={action.href}
                className="hidden text-sm md:block text-muted-foreground hover:text-foreground transition-colors"
              >
                {action.text}
              </Link>
            ),
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav className="grid gap-6 text-lg font-medium">
                <a
                  href={homeUrl}
                  className="flex items-center gap-2 text-xl font-bold"
                >
                  <span>{name}</span>
                </a>
                {mobileLinks.map((link) => (
                  <a
                    key={`${link.href}-${link.text}`}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.text}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </NavbarRight>
      </NavbarComponent>
    </header>
  );
}
