import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/hero"
import { ServicesSection } from "@/components/sections/services"
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel"
import { AboutSection } from "@/components/sections/about"
import { ContactSection } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { Chatbox } from "@/components/chatbox"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-5 md:pb-0">
        <HeroSection />
        <ServicesSection />
        <TestimonialsCarousel />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <Chatbox />
    </div>
  )
}
