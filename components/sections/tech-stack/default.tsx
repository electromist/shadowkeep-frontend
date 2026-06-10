"use client"

import React from 'react';
import { IconCloud } from "@/components/ui/icon-cloud"
import {
  siReact,
  siNextdotjs,
  siGo,
  siGithub,
  siDocker,
  siTailwindcss
} from "simple-icons";
import { BackgroundBeams } from '@/components/ui/background-beams';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';

interface SimpleIcon {
  title: string;
  slug: string;
  hex: string;
  path: string;
}

const SimpleIconComponent = ({ icon }: { icon: SimpleIcon }) => {
  // Override dark logos with white to maintain legibility on the dark theme
  const fill = icon.hex === "000000" || icon.hex === "181717" ? "#ffffff" : `#${icon.hex}`;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width="100"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{icon.title}</title>
      <path d={icon.path} fill={fill} />
    </svg>
  );
};

export default function TechStack({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex flex-col md:flex-row items-center justify-between gap-6 relative glass-5 rounded-4xl p-6 md:p-8 overflow-hidden", className)}>
      {/* Top transition line */}
      <div className="absolute top-0 left-4 right-4 border-t border-zinc-900" />

      <div className="flex-1 flex flex-col gap-4 text-left max-w-lg relative z-10">
        <div className="pointer-events-none absolute -top-10 -left-10 h-[200px] w-[200px] rounded-full bg-[#FF7B2E]/5 blur-3xl -z-10" />
        <h2 className="text-xs font-bold tracking-widest text-[#FF5C00] uppercase">
          Technology
        </h2>
        <BlurFade delay={0.75} inView>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white fade-bottom uppercase">
            Built For Speed
          </h2>
        </BlurFade>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Frontend powered by <span className="text-white font-semibold">React</span> and <span className="text-white font-semibold">Next.js</span> for a responsive user interface. Backend crafted using Go's <span className="text-white font-semibold">Standard Library</span> — zero third-party frameworks. We compiled everything into single-binary efficiency to deliver sub-millisecond encryption and decryption routines. Simple. Raw. Fast.
        </p>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-[200px] z-10">
        {/* Completely borderless, cardless cloud integration container */}
        <IconCloud
          icons={[
            <SimpleIconComponent key="react" icon={siReact} />,
            <SimpleIconComponent key="nextjs" icon={siNextdotjs} />,
            <SimpleIconComponent key="go" icon={siGo} />,
            <SimpleIconComponent key="github" icon={siGithub} />,
            <SimpleIconComponent key="tailwind" icon={siTailwindcss} />,
            <SimpleIconComponent key="docker" icon={siDocker} />,

            <SimpleIconComponent key="react2" icon={siReact} />,
            <SimpleIconComponent key="nextjs2" icon={siNextdotjs} />,
            <SimpleIconComponent key="go2" icon={siGo} />,
            <SimpleIconComponent key="github2" icon={siGithub} />,
            <SimpleIconComponent key="tailwind2" icon={siTailwindcss} />,
            <SimpleIconComponent key="docker2" icon={siDocker} />,

            <SimpleIconComponent key="react3" icon={siReact} />,
            <SimpleIconComponent key="nextjs3" icon={siNextdotjs} />,
            <SimpleIconComponent key="go3" icon={siGo} />,
            <SimpleIconComponent key="github3" icon={siGithub} />,
            <SimpleIconComponent key="tailwind3" icon={siTailwindcss} />,
            <SimpleIconComponent key="docker3" icon={siDocker} />,
          ]}
        />
      </div>
      <BackgroundBeams />
    </div>
  );
}
