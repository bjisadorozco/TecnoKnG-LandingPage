"use client"
import { Monitor, Laptop, Smartphone, HardDrive, Wifi, Shield, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Monitor,
    title: "Reparación de PC",
    description:
      "Diagnóstico completo, limpieza, cambio de componentes y optimización de rendimiento para tu computadora de escritorio.",
    price: "Desde $25",
  },
  {
    icon: Laptop,
    title: "Servicio de Laptops",
    description: "Reparación de pantallas, teclados, baterías, puertos y problemas de software en todas las marcas.",
    price: "Desde $30",
  },
  {
    icon: Smartphone,
    title: "Reparación Celulares",
    description: "Cambio de pantallas, baterías, puertos de carga, botones y recuperación de datos móviles.",
    price: "Desde $15",
  },
  {
    icon: HardDrive,
    title: "Recuperación de Datos",
    description: "Recupero información de discos duros dañados, memorias USB y tarjetas SD.",
    price: "Desde $40",
  },
  {
    icon: Wifi,
    title: "Redes y Conectividad",
    description: "Configuración de redes WiFi, cableado estructurado y solución de problemas de conexión.",
    price: "Desde $20",
  },
  {
    icon: Shield,
    title: "Seguridad Informática",
    description: "Eliminación de virus, instalación de antivirus, configuración de respaldos y protección de datos.",
    price: "Desde $18",
  },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-20 md:py-9 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Servicios profesionales</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Soluciones técnicas para <span className="text-primary">todos tus dispositivos</span>
          </h2>
          <p className="text-lg text-foreground-secondary leading-relaxed text-pretty">
            Cuento con las herramientas y experiencia necesarias para brindarte el mejor servicio en reparación y
            mantenimiento de tus equipos.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <article
              key={index}
              className="group relative p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{service.title}</h3>
                  <span className="text-primary font-bold text-sm">{service.price}</span>
                </div>
              </div>

              <p className="text-foreground-secondary text-sm leading-relaxed mb-4">{service.description}</p>

              <a
                href="#contacto"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors group/link"
              >
                Solicitar servicio
                <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </a>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-foreground-secondary mb-4">¿No encuentras lo que buscas?</p>
          <a
            href="#contacto"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
          >
            Contáctame para cotización personalizada
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
