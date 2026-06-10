'use client';

import PixelBackground from '@/components/ui/pixel-background';
import { Button } from '@/components/ui/button';
import { StaggerButton } from '@/components/ui/stagger-button';
import { Mail, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';

interface ContactWithPixelBackgroundProps {
  title?: string;
  description?: string;
  salesEmail?: string;
  supportEmail?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export default function ContactWithPixelBackground({
  title = 'Get in Touch',
  description = "Have a question, feedback, or need security support? We're here to help you configure your secure multi-tenant cloud.",
  salesEmail = 'secops@shadowkeep.dev',
  supportEmail = 'support@shadowkeep.dev',
  ctaText = 'Get API Credentials',
  ctaHref = '#',
  className,
}: ContactWithPixelBackgroundProps) {
  return (
    <div className={cn('w-full h-full flex flex-col', className)}>
      <div className='border border-zinc-800/80 rounded-4xl bg-zinc-950/20 backdrop-blur-md h-full flex flex-col justify-center py-5 px-6 sm:px-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-zinc-800 bg-white dark:bg-white text-black z-20 rounded-xl px-4 py-1 whitespace-nowrap shadow-md'>
          <span className='text-xs font-semibold uppercase tracking-wider text-black'>Contact</span>
        </div>

        <div
          className='absolute inset-0 rounded-4xl overflow-hidden pointer-events-none z-0'
          style={{
            maskImage: 'linear-gradient(to bottom, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
          }}
        >
          <PixelBackground
            gap={6}
            speed={60}
            colors='#1a1a1a,#2a2a2a,#333333,#111111,#d4d4d4,#e5e5e5,#c4c4c4,#bababa'
            opacity={0.3}
            direction='top'
            className='w-full h-full absolute inset-0'
          />
        </div>

        <div className='relative flex flex-col items-center gap-4 text-center z-10'>
          <div className='flex flex-col items-center gap-2'>
            <BlurFade delay={0.75} inView>
              <h2 className='text-3xl sm:text-4xl font-black tracking-tight text-white fade-bottom uppercase'>
                {title}
              </h2>
            </BlurFade>
            <p className='mx-auto max-w-sm text-zinc-400 text-sm leading-relaxed'>
              {description}
            </p>
          </div>

          <div className='flex flex-col gap-2 w-full max-w-xs'>
            <Button asChild variant='outline' className='w-full h-8 min-w-0 gap-2 text-xs border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white rounded-full'>
              <a href={`mailto:${salesEmail}`} className='min-w-0'>
                <Mail className='w-3.5 h-3.5 shrink-0' />
                <span className='truncate'>{salesEmail}</span>
              </a>
            </Button>
            <Button asChild variant='outline' className='w-full h-8 min-w-0 gap-2 text-xs border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white rounded-full'>
              <a href={`mailto:${supportEmail}`} className='min-w-0'>
                <Headphones className='w-3.5 h-3.5 shrink-0' />
                <span className='truncate'>{supportEmail}</span>
              </a>
            </Button>
          </div>

          <Button asChild variant="default" className="shadow-md h-9 text-xs px-6 rounded-full">
            <a href={ctaHref}>
              {ctaText}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}