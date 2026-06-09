import TopInvestors from "@/components/sections/apple-invite-transition/default"
import BentoFeatures from "@/components/sections/bento-features/default"
import CTA from "@/components/sections/cta/default"
import FAQ from "@/components/sections/faq/default"
import FeaturesOverview from "@/components/sections/features/default"
import Hero from "@/components/sections/hero/default"
import CloudIntegrations from "@/components/sections/integrations/default"
import HowShadowKeepWorks from "@/components/sections/how-it-works"
import TestimonialsVerticalMarquee from "@/components/testimonials-with-verticalmarquee"
import Items from "@/components/sections/items/default"
import Navbar from "@/components/sections/navbar/default"
import { Footer } from "@/components/ui/footer"
import StaticLogoCloud from "@/components/ui/static-logo-cloud"
export default function Page() {
  return (
    <div>
      <Navbar />
      <Hero />
      <StaticLogoCloud />
      <BentoFeatures />
      <TopInvestors />
      <FeaturesOverview />
      <CloudIntegrations />
      <HowShadowKeepWorks />
      <TestimonialsVerticalMarquee />
      <Items />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
