"use client"
import { Award, CheckCircle, Clock, Star, User } from "lucide-react"

const stats = [
  { icon: Award, value: "5+", label: "Años de experiencia" },
  { icon: CheckCircle, value: "500+", label: "Equipos reparados" },
  { icon: Clock, value: "48h", label: "Tiempo promedio" },
  { icon: Star, value: "4.9", label: "Calificación promedio" },
]

export function AboutSection() {
  return (
    <section id="sobre-mi" className="py-10 md:py-9 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative group">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden">
              <img
                src="/professional-tech-repair-technician-portrait-frien.jpg"
                alt="TecnoKnG - Técnico profesional"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary via-primary-light to-primary opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
            <div
              className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-primary to-primary-light bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                padding: "2px",
                background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                borderRadius: "1.5rem",
              }}
            />

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -right-3 md:bottom-4 md:-right-8 p-3 rounded-2xl bg-primary text-primary-foreground shadow-xl animate-pulse-slow">
              <p className="text-2xl font-bold mb-1">Tec. Deison Silva</p>
              {/* <p className="text-sm text-primary-foreground/80">Tasa de éxito</p> */}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-center md:justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <User className="w-4 h-4" />
                <span>Sobre mí</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance text-center md:text-left">
              Pasión por la <span className="text-primary">tecnología</span>
            </h2>

            <div className="space-y-4 text-foreground-secondary leading-relaxed mb-8 text-center md:text-left">
              <p>
                Soy técnico certificado con más de 5 años de experiencia en el sector tecnológico. Mi misión es
                brindarte soluciones rápidas, confiables y accesibles para todos tus dispositivos.
              </p>
              <p>
                Me especializo en diagnósticos precisos y reparaciones de alta calidad, utilizando herramientas
                profesionales y repuestos originales para garantizar el mejor resultado en cada servicio que realizo.
              </p>
              <p>
                Cada dispositivo que llega a mis manos recibe atención personalizada. Mi compromiso es devolverte tu
                equipo funcionando como nuevo, con la tranquilidad de una garantía que respalda mi trabajo.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-sm text-foreground-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
