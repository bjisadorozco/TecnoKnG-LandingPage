"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wrench, ShoppingBag, Phone, Menu, X, Cpu, MessageCircle, Info, Star, Settings } from "lucide-react"
import { ThemeToggle } from "./ui/theme-toggle"
import { useStore } from "@/lib/store-context"

const navItems = [
  { href: "/#inicio", label: "Inicio", icon: Home },
  { href: "/#servicios", label: "Servicios", icon: Wrench },
  { href: "/tienda", label: "Tienda", icon: ShoppingBag },
  { href: "/#sobre-mi", label: "Sobre mí", icon: Info },
  { href: "/#resenas", label: "Reseñas", icon: Star },
  { href: "/#contacto", label: "Contacto", icon: Phone },
]

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const { cartCount } = useStore()
  const isStorePage = pathname === "/tienda"
  const isAdminPage = pathname === "/admin"

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  if (isAdminPage) return null

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Das<span className="text-primary">Tech</span>
              </span>
            </Link>

            <div className="flex items-center gap-8">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={`text-foreground-secondary hover:text-primary transition-colors duration-200 font-medium text-sm flex items-center gap-1 ${
                        item.href === "/tienda" && isStorePage ? "text-primary" : ""
                      }`}
                    >
                      {item.label}
                      {item.href === "/tienda" && cartCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
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
                className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                title="Panel de Administración"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <header className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Das<span className="text-primary">Tech</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform active:scale-95"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-primary-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
      </div>

      <nav
        id="mobile-menu"
        className={`md:hidden fixed bottom-[72px] left-0 right-0 z-50 bg-background rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-border transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="p-6">
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6" />
          <ul className="grid grid-cols-3 gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-background-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  tabIndex={isOpen ? 0 : -1}
                >
                  <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  <span className="text-xs font-medium text-foreground-secondary group-hover:text-primary-foreground transition-colors">
                    {item.label}
                  </span>
                  {item.href === "/tienda" && cartCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center group-hover:bg-background group-hover:text-primary">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLinkClick}
                className="w-full flex flex-col items-center gap-2 p-4 rounded-2xl bg-background-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                tabIndex={isOpen ? 0 : -1}
              >
                <MessageCircle className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                <span className="text-xs font-medium text-foreground-secondary group-hover:text-primary-foreground transition-colors">
                  Chat
                </span>
              </button>
            </li>
            <li>
              <Link
                href="/admin"
                onClick={handleLinkClick}
                className="w-full flex flex-col items-center gap-2 p-4 rounded-2xl bg-background-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                tabIndex={isOpen ? 0 : -1}
              >
                <Settings className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                <span className="text-xs font-medium text-foreground-secondary group-hover:text-primary-foreground transition-colors">
                  Admin
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
