import Link from "next/link"
import { Cpu, Mail, MapPin, MessageCircle } from "lucide-react"

const footerLinks = {
  services: [
    { label: "Reparación de PC", href: "/#servicios" },
    { label: "Servicio de Laptops", href: "/#servicios" },
    { label: "Reparación Celulares", href: "/#servicios" },
    { label: "Recuperación de Datos", href: "/#servicios" },
  ],
  pages: [
    { label: "Inicio", href: "/#inicio" },
    { label: "Sobre mí", href: "/#sobre-mi" },
    { label: "Tienda", href: "/tienda" },
    { label: "Contacto", href: "/#contacto" },
  ],
  legal: [
    { label: "Términos y Condiciones", href: "#" },
    { label: "Política de Privacidad", href: "#" },
    { label: "Garantías", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand + Services */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Tecno<span className="text-primary">KnG</span>
              </span>
            </Link>
            <p className="text-background/70 leading-relaxed max-w-md">
              Técnico especializado en reparación y mantenimiento de equipos tecnológicos. Tu confianza es mi prioridad.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="/#servicios" className="text-background/70 hover:text-primary transition-colors text-sm">
                Reparación de PC
              </a>
              <a href="/#servicios" className="text-background/70 hover:text-primary transition-colors text-sm">
                Servicio de Laptops
              </a>
              <a href="/#servicios" className="text-background/70 hover:text-primary transition-colors text-sm">
                Reparación Celulares
              </a>
              <a href="/#servicios" className="text-background/70 hover:text-primary transition-colors text-sm">
                Recuperación de Datos
              </a>
            </div>
          </div>
        </div>

        {/* Line separator */}
        <div className="border-t border-background/10 pt-8">
          {/* Contact Info + Social Icons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Contact Info - en línea */}
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="https://wa.me/573008220645"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-background/70 hover:text-primary transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                +57 300 822 0645
              </a>
              <a
                href="mailto:kgnprogram@gmail.com"
                className="flex items-center gap-2 text-background/70 hover:text-primary transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                kgnprogram@gmail.com
              </a>
              <div className="flex items-center gap-2 text-background/70 text-sm">
                <MapPin className="w-4 h-4" />
                Servicio a domicilio disponible
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61586899029457&sk=about"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/tecnokng/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    ry="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
              <a
                href="https://wa.me/573008220645"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-background/50 text-sm mt-6 text-center md:text-left">
            © {new Date().getFullYear()} TecnoKnG. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
