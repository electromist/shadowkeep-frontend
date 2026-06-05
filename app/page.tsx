import CTA from "@/components/sections/cta/default"
import FAQ from "@/components/sections/faq/default"
import Hero from "@/components/sections/hero/default"
import Items from "@/components/sections/items/default"
import Logos from "@/components/sections/logos/default"
import Navbar from "@/components/sections/navbar/default"
import { Footer } from "@/components/ui/footer"
export default function Page() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Logos />
      <Items />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
