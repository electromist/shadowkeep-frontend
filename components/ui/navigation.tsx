"use client"

import Link from "next/link"
import * as React from "react"
import { ReactNode } from "react"


import { cn } from "@/lib/utils"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu"

interface ComponentItem {
  title: string
  href: string
  description: string
}

interface MenuItem {
  title: string
  href?: string
  isLink?: boolean
  content?: ReactNode
}

interface NavigationProps {
  menuItems?: MenuItem[]
  components?: ComponentItem[]
  logo?: ReactNode
  logoTitle?: string
  logoDescription?: string
  logoHref?: string
  introItems?: {
    title: string
    href: string
    description: string
  }[]
}

export default function Navigation({
  menuItems = [
    {
      title: "Security Shield",
      content: "default",
    },
    {
      title: "Core Platform",
      content: "components",
    },
    {
      title: "API Reference",
      isLink: true,
      href: "#",
    },
  ],
  components = [
    {
      title: "Multi-Tenant Schema Isolation",
      href: "#",
      description:
        "Separate database scopes per organization mapped using strict tenant context queries.",
    },
    {
      title: "OAuth 2.0 & JWT Sessions",
      href: "#",
      description:
        "Long-lived 7-day refresh tokens and short-lived 15-minute access tokens for API requests.",
    },
    {
      title: "AES-256-GCM Envelope Wrap",
      href: "#",
      description:
        "Files encrypted with a unique, randomized DEK, wrapped by a securely stored Master Key.",
    },
    {
      title: "PostgreSQL & R2 Integration",
      href: "#",
      description:
        "Structured metadata tracked in PostgreSQL with raw encrypted payloads uploaded to Cloudflare R2.",
    },
    {
      title: "API Rate Limiting",
      href: "#",
      description:
        "Parametrized inputs, SQL injection shields, and rate limiters protecting public auth endpoints.",
    },
    {
      title: "Memory-Only Decryption",
      href: "#",
      description:
        "Unwrapped DEK decryption happens strictly in volatile RAM, returning clean stream bytes.",
    },
  ],
  logo = <img src="/logo.png" alt="ShadowKeep Logo" className="h-8 w-auto filter brightness-110" />,
  logoTitle = "ShadowKeep",
  logoDescription = "A self-hostable multi-tenant security backend built with Go standard library and PostgreSQL.",
  logoHref = "/",
  introItems = [
    {
      title: "Quantum Nonce Shield",
      href: "#",
      description: "High-entropy entropy pool rotation for every AES-GCM operation.",
    },
    {
      title: "One-Click GDPR Burner",
      href: "#",
      description: "Instantly purge organization ciphertexts from both DB and R2 in 100ms.",
    },
    {
      title: "Polymorphic Key Rotator",
      href: "#",
      description: "Dynamically rotate the environment Master Key without disrupting live active sessions.",
    },
  ],
}: NavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.isLink ? (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link href={item.href || ""}>{item.title}</Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-muted/30 to-muted/10 p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href={logoHref}
                          >
                            {logo}
                            <div className="mt-4 mb-2 text-lg font-medium">
                              {logoTitle}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {logoDescription}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {introItems.map((intro) => (
                        <ListItem
                          key={intro.title}
                          href={intro.href}
                          title={intro.title}
                        >
                          {intro.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : item.content === "components" ? (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
