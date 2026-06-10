'use client';

import { motion } from 'motion/react';
import KineticTestimonial from '@/components/ui/kinetic-testimonials';

const testimonials = [
  {
    name: 'Maren Holst',
    handle: 'Founder · Cramer',
    review:
      'Deploying ShadowKeep as a single compiled Go binary simplified our DevOps setup. We completely replaced our bloated cloud HSM with a local PostgreSQL + R2 backend.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format',
  },
  {
    name: 'Jonas Albrecht',
    handle: 'CTO · Kinear',
    review:
      'We integrated ShadowKeep in less than a day. Our multi-tenant schema isolation worries are gone, and Go\'s concurrency model handles our high-volume secure uploads with zero latency.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format',
  },
  {
    name: 'Sade Okonkwo',
    handle: 'Security Engineer · Xercel',
    review:
      'Their implementation of AES-256-GCM envelope encryption is highly clean. No bloated third-party dependencies — just pure, fast Go standard library security.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&auto=format',
  },
  {
    name: 'Erik Sundqvist',
    handle: 'Lead Architect · Wotion',
    review:
      'The JWT key rotation with short-lived access tokens and 7-day refresh tokens worked seamlessly out-of-the-box with our React SPA client.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&auto=format',
  },
  {
    name: 'Aisha Patel',
    handle: 'Product Designer · Ripe',
    review:
      'Having structured file metadata safely stored in PostgreSQL while direct ciphertext blobs land securely in Cloudflare R2 has drastically reduced our storage fees.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80&auto=format',
  },
  {
    name: 'Liam Chen',
    handle: 'VP Engineering · SitHub',
    review:
      'ShadowKeep\'s memory-only decryption pipeline guarantees that decryption keys and plaintexts never persist to host storage. Simple, clean, and extremely fast.',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&q=80&auto=format',
  }
];

export default function TestimonialsVerticalMarquee() {
  return (
    <section className='relative w-full max-w-container mx-auto bg-background px-4'>
      <div className='relative z-10 flex flex-col items-center w-full'>
        <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8 relative z-10 py-12 md:py-16">
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-[#FF7B2E]/10 blur-3xl -z-10" />
          <h3 className="text-xs font-bold tracking-widest text-[#FF5C00] uppercase">
            Testimonials
          </h3>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight fade-bottom uppercase text-foreground">
            Loved by thousands of happy creators
          </h2>
          <p className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl">
            Hear from our community of builders, designers, and creators who trust us to power their vision
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className='w-full'
        >
          <KineticTestimonial
            testimonials={testimonials}
            title=''
            subtitle=''
            desktopColumns={5}
            tabletColumns={3}
            mobileColumns={2}
            speed={1}
          />
        </motion.div>
      </div>
    </section>
  );
}