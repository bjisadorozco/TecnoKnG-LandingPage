"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Wrench,
  ShoppingBag,
  Phone,
  Grid3X3,
  X,
  Cpu,
  Info,
  Star,
  User,
  User2,
} from "lucide-react"
import { ThemeToggle } from "./ui/theme-toggle"
import { useStore } from "@/lib/store-context"
import { getLogoByPage } from "@/lib/assets"

const navItems = [
  { href: "/#inicio", label: "Inicio", icon: Home },
  // { href: "/#servicios", label: "Servicios", icon: Wrench },
  { href: "/#sobre-mi", label: "Sobre mí", icon: Info },
  { href: "/#resenas", label: "Reseñas", icon: Star },
  { href: "/#contacto", label: "Contacto", icon: Phone },
  { href: "/tienda", label: "Tienda", icon: ShoppingBag },
]

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  const pathname = usePathname()
  const { cartCount } = useStore()

  const isStorePage = pathname === "/tienda"
  const isAdminPage = pathname === "/admin"
  
  // Obtener el logo según la página
  const currentLogo = getLogoByPage(isStorePage)

  /* Scroll desktop */
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Lock body */
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
  }, [isOpen])

  if (isAdminPage) return null

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <header
        className={
          isStorePage
            ? "hidden md:block relative bg-background border-b"
            : `hidden md:block fixed top-0 left-0 right-0 z-50 transition ${
                scrolled ? "glass shadow-lg border-b" : "bg-transparent"
              }`
        }
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={currentLogo.src}
              alt="TecnoKnG Logo"
              className={`w-auto ${isStorePage ? "h-14 -my-2" : "h-10"}`}
            />
          </Link>

          <div className="flex items-center gap-8">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-sm hover:text-primary ${
                      item.href === "/tienda" && isStorePage ? "text-primary" : ""
                    }`}
                  >
                    {item.label}
                    {item.href === "/tienda" && cartCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-xs text-primary-foreground">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <ThemeToggle />

            <Link
              href="/admin"
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
            >
              <User2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MOBILE FOOTER ================= */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-60 glass border-t">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Texto izquierda */}
          <div>

              <>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  TecnoKnG
                </p>
                <p className="text-sm font-semibold">Navegación</p>
              </>
          </div>

          {/* Botón derecha */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Grid3X3 className="w-5 h-5 text-primary-foreground" />
            )}
          </button>
        </div>
      </footer>

      {/* ================= OVERLAY ================= */}
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ================= MOBILE MENU ================= */}
      <nav
        className={`md:hidden fixed left-0 right-0 bottom-[70px] z-50
        bg-background rounded-t-3xl border-t shadow-[0_-10px_40px_rgba(0,0,0,0.2)]
        transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="p-6">
          {/* Header del menú (SOLO cuando está abierto) */}
          {isOpen && (
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src={currentLogo.src}
                  alt="TecnoKnG Logo"
                  className={`w-auto ${isStorePage ? "h-12 -my-1.5" : "h-9"}`}
                />
              </Link>

              {/* Toggle SOLO aquí */}
              <ThemeToggle />
            </div>
          )}

          <ul className="grid grid-cols-3 gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl
                  bg-muted hover:bg-primary hover:text-primary-foreground transition"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl
                bg-muted hover:bg-primary hover:text-primary-foreground transition"
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Admin</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
