"use client"

import React from "react"

import GlowHover, {
  type GlowHoverCardItem,
} from "@/components/ui/smoothui/glow-hover-card"
import { PremiumCard } from "@/components/ui/custom"
import { Expandable, ExpandableCard, ExpandableContent, ExpandableTrigger } from "@/components/ui/expandable"
import GlobeWireframe from "@/components/ui/globe-wireframe"
import { MiniChart } from "@/components/mini-chart"
import Counter from "@/components/animata/text/counter"
import { BlurFade } from "@/components/ui/blur-fade"

const cards = [
  {
    id: "1",
    title: "Nature",
    description: "Beautiful landscapes and mountains.",
    image: "/images/nature.jpg",
  },
  {
    id: "2",
    title: "Technology",
    description: "Latest innovations and gadgets.",
    image: "/images/tech.jpg",
  },
  {
    id: "3",
    title: "Travel",
    description: "Explore amazing destinations.",
    image: "/images/travel.jpg",
  },
]


const bottomCards: GlowHoverCardItem[] = [
  {
    id: "envelope-encryption",
    theme: { hue: 24, saturation: 100, lightness: 50 },
    element: (
      <PremiumCard
        title="Envelope Encryption"
        description="Each secret encrypted with a unique DEK, wrapped by your organisation's KEK — industry-standard AES-256-GCM throughout."
        showGlow={true}
        className="h-full w-full"
      >
        <div className="relative w-full overflow-hidden rounded-xl" style={{ height: 280 }}>
          <img
            src="/envelope-encryption.jpg"
            alt="Envelope Encryption"
            className="h-full w-full object-cover fade-bottom"
          />
          {/* fade-y bottom + fade-x sides */}
          <div className="absolute inset-0" />
        </div>
      </PremiumCard>
    ),
  },
  {
    id: "multi-tenant-isolation",
    theme: { hue: 24, saturation: 100, lightness: 50 },
    element: (
      <PremiumCard
        title="Multi-Tenant Isolation"
        description="Full data isolation per organisation — dedicated R2 buckets, scoped keys, and separate encryption contexts."
        showGlow={true}
        className="h-full w-full"
      >
        <div className="relative w-full overflow-hidden rounded-xl" style={{ height: 280 }}>
          <img
            src="/tenant-isolation.jpg"
            alt="Multi-Tenant Isolation"
            className="h-full w-full object-cover fade-bottom"
          />
          <div className="absolute inset-0" />
        </div>
      </PremiumCard>
    ),
  },
  {
    id: "cloudflare-r2",
    theme: { hue: 24, saturation: 100, lightness: 50 },
    element: (
      <PremiumCard
        title="Cloudflare R2 Storage"
        description="Ciphertexts and wrapped keys stored in your own R2 bucket — zero egress fees, global edge availability."
        showGlow={true}
        className="h-full w-full"
      >
        <div className="relative w-full overflow-hidden rounded-xl" style={{ height: 280 }}>
          <img
            src="r2.jpg"
            alt="Cloudflare R2 Storage"
            className="h-full w-full object-cover fade-bottom"
          />
          <div className="absolute inset-0" />
        </div>
      </PremiumCard>
    ),
  },
]



export default function FeaturesOverview() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] px-6 py-20 text-white">
      <div className="w-full max-w-[1200px] space-y-32">

        {/* --- TOP SECTION: Text + Dashboard --- */}
        <BlurFade delay={0.25} inView>

          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_1.5fr] lg:gap-12">

            {/* Left Column: Text */}
            <div className="relative space-y-8">
              <div className="pointer-events-none absolute top-0 -left-32 h-64 w-64 rounded-full bg-[#ff5c00]/5 blur-3xl" />
              <div className="relative space-y-6">
                <div>
                  <h2 className="mb-4 text-xs font-bold tracking-widest text-[#ff5c00] uppercase">
                    Zero-Knowledge Architecture
                  </h2>
                  <h1 className="text-5xl leading-[1.1] font-bold tracking-tight text-zinc-50 lg:text-6xl">
                    <div className="fade-bottom">Everything you</div>
                    <div className="fade-bottom delay-100">need</div>
                    <div className="fade-bottom delay-200">at your fingertips</div>
                  </h1>
                </div>
                <p className="max-w-md text-lg leading-relaxed text-zinc-400">
                  A comprehensive platform built with zero-knowledge principles —
                  your secrets never leave your infrastructure unencrypted. We never
                  see your plaintext. Ever.
                </p>
              </div>
            </div>

            {/* Right Column: Dashboard UI */}
            <div className="self-start mt-2">
              <Expandable>
                <ExpandableCard
                  hoverToExpand={true}
                  collapsedSize={{ width: 720, height: 350 }}
                  expandedSize={{ width: 720, height: 560 }}
                  className="mx-auto [&>div]:shadow-none [&>div]:ring-0 [&>div>div]:shadow-none [&>div>div]:ring-0 [&>div>div>div]:bg-zinc-950 [&>div>div>div]:dark:bg-zinc-950 [&>div>div>div]:ring-1 [&>div>div>div]:ring-zinc-800 [&>div>div>div]:rounded-[2rem] [&>div>div>div]:p-8 [&>div>div>div]:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.08),inset_0_0_24px_0_rgba(255,255,255,0.02)]"
                >
                  <ExpandableTrigger className="text-left select-none cursor-pointer relative overflow-hidden w-full h-[280px] mb-4">
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      {/* Metrics info overlayed */}
                      <div className="mt-4">
                        <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Total Secrets</span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-4xl font-extrabold tracking-tight text-white fade-bottom">
                            <Counter targetValue={1284} direction={"up"} delay={0} />
                          </span>
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-[#142918] text-[#4ade80] border border-[#22542c]">
                            <span className="text-[10px]">↑</span> +12.5%
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium mt-2">
                          Trending up this month → Decryptions for the last 6 months
                        </p>
                      </div>
                    </div>

                    {/* Dome Globe Wireframe at the bottom */}
                    <div className="absolute top-[120px] left-1/2 w-[120%] aspect-square -translate-x-1/2 pointer-events-none fade-x">
                      <GlobeWireframe
                        className="w-full h-full opacity-80 sm:opacity-100 text-zinc-700/80 dark:text-zinc-800/80"
                        variant="solid"
                        scale={1.05}
                        rotateCities={["New York", "London", "Tokyo", "Mumbai", "Paris"]}
                        rotationSpeed={3000}
                        autoRotate={true}
                        autoRotateSpeed={0.3}
                        enableInteraction={false}
                      />
                    </div>
                  </ExpandableTrigger>
                  <ExpandableContent preset="slide-up">
                    <div className="mt-4 pb-6">
                      <MiniChart />
                    </div>
                  </ExpandableContent>
                </ExpandableCard>
              </Expandable>
            </div>
          </div>
        </BlurFade >
        {/* --- BOTTOM SECTION: 3 Feature Cards with GlowHover --- */}
        {/* --- BOTTOM SECTION: 3 Feature Cards with GlowHover --- */}
        <GlowHover
          items={bottomCards}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        />
      </div>
    </div>
  )
}
