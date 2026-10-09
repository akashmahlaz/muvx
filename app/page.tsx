import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import TheLine from "@/components/landing/TheLine"
import TrustStrip from "@/components/landing/TrustStrip"
import EmailToLoad from "@/components/landing/EmailToLoad"
import Autonomy from "@/components/landing/Autonomy"
import Rules from "@/components/landing/Rules"
import Stats from "@/components/landing/Stats"
import Pricing from "@/components/landing/Pricing"
import FinalCTA from "@/components/landing/FinalCTA"
import Footer from "@/components/landing/Footer"

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#f5f2ec]">
      <Navbar />
      <Hero />
      <TheLine />
      <TrustStrip />
      <EmailToLoad />
      <Autonomy />
      <Rules />
      <Stats />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  )
}
