import TopInvestors from "@/components/sections/apple-invite-transition/default"
import BentoFeatures from "@/components/sections/bento-features/default"
import CTA from "@/components/sections/cta/default"
import FAQ from "@/components/sections/faq/default"
import FeaturesOverview from "@/components/sections/features/default"
import Hero from "@/components/sections/hero/default"
import TechStack from "@/components/sections/tech-stack/default"
import ContactWithPixelBackground from "@/components/contact-with-pixelbackground"
import HowShadowKeepWorks from "@/components/sections/how-it-works"
import TestimonialsVerticalMarquee from "@/components/testimonials-with-verticalmarquee"
import Items from "@/components/sections/items/default"
import Navbar from "@/components/sections/navbar/default"
import Footer from "@/components/sections/footer/default"
import StaticLogoCloud from "@/components/ui/animated-logo-cloud"
import Pricing from "@/components/sections/pricing/default"
import { ScalesLayout } from "@/components/ui/scales"
import { BlurFade } from "@/components/ui/blur-fade"

export default function Page({ isOverlay = false }: { isOverlay?: boolean }) {
  return (
    <ScalesLayout active={false}>
      <Navbar />
      <Hero isOverlay={isOverlay} />
      {!isOverlay && (
        <>
          <BlurFade delay={0.25} inView>
            <StaticLogoCloud />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <BentoFeatures />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <TopInvestors />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <FeaturesOverview />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <HowShadowKeepWorks />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <TestimonialsVerticalMarquee />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <Pricing />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <FAQ />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <div className="w-full max-w-container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-6 items-stretch">
              <div className="lg:w-[62%] w-full flex">
                <TechStack className="w-full h-full" />
              </div>
              <div className="lg:w-[38%] w-full flex">
                <ContactWithPixelBackground className="w-full h-full" />
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <CTA />
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <Footer />
          </BlurFade>
        </>
      )}
    </ScalesLayout>
  )
}
