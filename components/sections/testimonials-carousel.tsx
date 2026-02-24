"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Star, Quote, Shield, Clock, Award, ThumbsUp } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "María González",
    role: "Emprendedora",
    avatar: "/woman-professional-portrait-smiling.jpg",
    content:
      "Excelente servicio. Mi laptop tenía problemas graves y TecnoKnG la dejó como nueva en menos de 24 horas. Muy profesional y precios justos.",
    rating: 5,
  },
  {
    id: 2,
    name: "Carlos Ramírez",
    role: "Diseñador Gráfico",
    avatar: "/man-creative-professional-portrait.jpg",
    content:
      "Recuperó todos mis archivos de trabajo de un disco duro que pensé que estaba perdido. Increíble trabajo y muy buena comunicación durante todo el proceso.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Estudiante Universitaria",
    avatar: "/woman-professional-portrait-smiling.jpg",
    content:
      "Le cambió la pantalla a mi celular en tiempo récord y quedó perfecto. Además los precios son muy accesibles para estudiantes. 100% recomendado.",
    rating: 5,
  },
  {
    id: 4,
    name: "Roberto Sánchez",
    role: "Contador",
    avatar: "/man-creative-professional-portrait.jpg",
    content:
      "Mi PC estaba muy lenta y después del mantenimiento que le hizo TecnoKnG funciona mejor que cuando la compré. Muy satisfecho con el resultado.",
    rating: 5,
  },
]

const highlights = [
  {
    icon: Shield,
    title: "Garantía en todos los servicios",
    description: "Respaldo de 30 a 90 días según el tipo de reparación",
  },
  {
    icon: Clock,
    title: "Diagnóstico gratuito",
    description: "Evaluación sin costo para que sepas exactamente qué necesita tu equipo",
  },
  {
    icon: Award,
    title: "Repuestos originales",
    description: "Solo uso componentes de calidad certificada",
  },
  {
    icon: ThumbsUp,
    title: "Atención personalizada",
    description: "Te mantengo informado en cada paso del proceso",
  },
]

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true)

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  React.useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <section id="resenas" className="py-10 md:py-9 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Lo que dicen mis clientes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Confianza y <span className="text-primary">resultados</span>
          </h2>
          <p className="text-lg text-foreground-secondary leading-relaxed text-pretty">
            La satisfacción de mis clientes es mi mejor carta de presentación. Conoce las experiencias de quienes ya
            confiaron en mi trabajo.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative mb-20"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-background-secondary rounded-2xl p-8 md:p-12 border border-border">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <div className="relative">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-20 h-20 rounded-2xl object-cover"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Quote className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Rating */}
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                          ))}
                        </div>

                        <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                          "{testimonial.content}"
                        </blockquote>

                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-foreground-secondary">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-xl bg-background-secondary border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-xl bg-background-secondary border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-foreground-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
