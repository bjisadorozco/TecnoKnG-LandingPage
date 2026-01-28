import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/hero"
import { ServicesSection } from "@/components/sections/services"
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel"
import { AboutSection } from "@/components/sections/about"
import { ContactSection } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { Chatbox } from "@/components/chatbox"
import { StoreView } from "@/components/store/store-view"

export default function Home() {
  const showLanding = true

  return (
    <div className="min-h-screen bg-background">
      {showLanding ? (
        <>
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
        </>
      ) : (
        <StoreView />
      )}
    </div>
  )
}
