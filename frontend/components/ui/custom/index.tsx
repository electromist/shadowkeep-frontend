"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional custom content, e.g. images, SVGs, interactive media, or animations */
  children?: ReactNode;
  /** Card header title */
  title?: string;
  /** Card body description text */
  description?: string;
  /** Toggle the premium inner glow effect */
  showGlow?: boolean;
  /** Custom inner glow color. Fallback inherits a subtle white reflection matching modern dark-mode designs */
  glowColor?: string;
  /** Class control for padding, defaults to 'p-8' */
  padding?: string;
}

export const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  (
    {
      children,
      title,
      description,
      showGlow = true,
      glowColor,
      padding = "p-8",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Uses project's theme variables/colors via Tailwind border & background utils
          "group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-zinc-100 transition-all duration-300",
          padding,
          className
        )}
        style={{
          boxShadow: showGlow
            ? `inset 0 1px 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 24px 0 ${glowColor || "rgba(255, 255, 255, 0.02)"}`
            : undefined,
        }}
        {...props}
      >
        {/* Top-center light reflection highlight to mimic modern glassmorphic designs */}
        {showGlow && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.03] to-transparent" />
        )}

        {/* Resizable / Customizable Media Container */}
        {children && (
          <div className="relative z-10 flex w-full items-center justify-center">
            {children}
          </div>
        )}

        {/* Text Details */}
        {(title || description) && (
          <div className={cn("relative z-10 space-y-2", children ? "mt-6" : "")}>
            {title && (
              <h3 className="text-xl font-semibold tracking-tight text-white">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm leading-relaxed text-zinc-400">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

PremiumCard.displayName = "PremiumCard";