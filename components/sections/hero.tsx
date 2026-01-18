"use client"
import Link from "next/link"
import { ArrowRight, CheckCircle, Zap, Shield, Clock, Wrench, Sparkles, TrendingUp } from "lucide-react"

const features = [
  { icon: Zap, text: "Diagnóstico rápido" },
  { icon: Shield, text: "Garantía incluida" },
  { icon: Clock, text: "Servicio express" },
  { icon: Sparkles, text: "Atención personalizada" },
]

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-0 md:pt-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_49%,var(--color-border)_50%,transparent_51%,transparent_100%)] bg-[length:80px_100%] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:pb-10 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Wrench className="w-4 h-4" />
              <span>Técnico certificado con +5 años de experiencia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
              Hola, soy <span className="text-primary">DasTech</span>
            </h1>

            <p className="text-lg text-foreground-secondary leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
              Técnico especializado en reparación de computadoras, laptops y celulares. Te ofrezco soluciones rápidas,
              profesionales y con garantía. También encontrarás accesorios y repuestos de calidad en mi tienda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
              >
                Ver mis servicios
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-background-secondary text-foreground font-semibold border border-border transition-all duration-200 hover:border-primary hover:text-primary"
              >
                Ir a la tienda
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-background-secondary/50 border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-foreground-secondary font-medium text-center">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Card */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-primary to-primary-light p-1 shadow-2xl shadow-primary/20">
                <div className="w-full h-full rounded-[22px] bg-background flex items-center justify-center overflow-hidden">
                  <img
                    src="/professional-tech-repair-specialist-working-on-lap.jpg"
                    alt="DasTech - Especialista en reparación tecnológica"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute -top-4 -right-4 md:top-0 md:right-0 p-4 rounded-2xl bg-background shadow-xl border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">98%</p>
                    <p className="text-xs text-foreground-muted">Tasa de éxito</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-8 p-4 rounded-2xl bg-background shadow-xl border border-border animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">5+ años</p>
                    <p className="text-xs text-foreground-muted">De experiencia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  )
}
