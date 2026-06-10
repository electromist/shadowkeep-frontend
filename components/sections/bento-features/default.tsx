"use client";

import React, { forwardRef, useRef } from 'react';
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons"
import { BellIcon, Share2Icon, HardDrive, FileText, MessageSquare, MessageCircle, Database, User, Cpu, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { Marquee } from "@/components/ui/marquee"
import { AnimatedList } from "@/components/ui/animated-list"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { BlurFade } from "@/components/ui/blur-fade"

// ==========================================
// 1. Files List for Marquee
// ==========================================
const files = [
  {
    name: "database.db",
    body: "PostgreSQL backup containing isolated schemas and organization tables wrapped in AES ciphers.",
  },
  {
    name: "stripe_webhook.key",
    body: "Stripe integration endpoint signing secret used for verifying raw webhook payment triggers.",
  },
  {
    name: "jwt_signing.pem",
    body: "RS256 Private key used for signing session JWT tokens with 15-minute rotation expirations.",
  },
  {
    name: "google_oauth.json",
    body: "Client ID and client secret configuration mapping the Google OAuth authentication flow.",
  },
  {
    name: "r2_credentials.env",
    body: "Cloudflare R2 bucket access key IDs and endpoints storing encrypted file blobs securely.",
  },
]

// ==========================================
// 2. AnimatedList Demo Component
// ==========================================
interface NotificationItem {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications: NotificationItem[] = [
  {
    name: "File Encrypted & Uploaded",
    description: "production_keys.env -> Cloudflare R2",
    time: "10s ago",
    icon: "🔒",
    color: "#ff5c00",
  },
  {
    name: "Secure Token Issued",
    description: "JWT access_token created for Tenant A",
    time: "2m ago",
    icon: "🔑",
    color: "#FFB800",
  },
  {
    name: "Download Decrypted in RAM",
    description: "db_dump.sql retrieved & decrypted",
    time: "5m ago",
    icon: "⚡",
    color: "#00C9A7",
  },
  {
    name: "Google OAuth callback",
    description: "Authorized admin@acme.org",
    time: "12m ago",
    icon: "👤",
    color: "#1E86FF",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: NotificationItem) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,0.08),0_4px_30px_rgba(0,0,0,0.04)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,0.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-base">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-zinc-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60 text-zinc-600">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
        className,
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}

// ==========================================
// 3. AnimatedBeam Demo Component
// ==========================================
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] dark:bg-black dark:border-zinc-800",
        className,
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl",
        className,
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <HardDrive className="h-6 w-6 text-blue-500" />
          </Circle>
          <Circle ref={div2Ref}>
            <FileText className="h-6 w-6 text-green-500" />
          </Circle>
          <Circle ref={div3Ref}>
            <MessageSquare className="h-6 w-6 text-emerald-500" />
          </Circle>
          <Circle ref={div4Ref}>
            <MessageCircle className="h-6 w-6 text-sky-500" />
          </Circle>
          <Circle ref={div5Ref}>
            <Database className="h-6 w-6 text-purple-500" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <User className="h-8 w-8 text-indigo-500" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <Cpu className="h-6 w-6 text-orange-500" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
      />
    </div>
  );
}

// ==========================================
// 4. Features Array for Bento Card
// ==========================================
const features = [
  {
    Icon: FileTextIcon,
    name: "Envelope Encrypted Storage",
    description: "Every file upload gets a randomized unique DEK, wrapped by a secure Master Key.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: BellIcon,
    name: "Audit Log Alerts",
    description: "Get real-time push logs when files are uploaded, decrypted, or session tokens are rotated.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
    ),
  },
  {
    Icon: Share2Icon,
    name: "Secure API Pipeline",
    description: "Go REST API gateway seamlessly routing encrypted data to Cloudflare R2 and organization tables.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute top-4 right-2 h-[300px] border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Audit Timeline Filter",
    description: "Query and filter security history and transaction logs by database timestamp.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute top-10 right-0 origin-top scale-75 rounded-md border-0 bg-transparent [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90"
      />
    ),
  },
]

export default function BentoFeatures() {
  return (
    <section className="py-24 w-full max-w-container mx-auto px-4">
      <div className="flex flex-col items-center text-center mb-16 relative">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#FF7B2E]/5 blur-3xl" />
        <h2 className="mb-4 text-xs font-bold tracking-widest text-[#FF5C00] uppercase z-10">
          Multi-Tenant SaaS Security
        </h2>
        <BlurFade delay={0.75} inView>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 z-10 fade-bottom uppercase">
            It's All About Security Quality
          </h2>
        </BlurFade>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Generic secret managers won't protect you from cross-tenant leakage.
          With ShadowKeep, we construct a mathematically isolated architecture using scoped database contexts,
          server-wrapped envelope encryption, and dedicated R2 bucket directories.
        </p>
      </div>

      <div className="w-full">
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
