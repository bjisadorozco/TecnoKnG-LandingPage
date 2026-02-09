import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreProvider } from "@/lib/store-context"
import { AuthProvider } from "@/lib/auth-context"
import { CategoriesProvider } from "@/lib/categories-context"
import { BrandsProvider } from "@/lib/brands-context"
import { ToastProvider } from "@/components/ui/toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TecnoKnG | Servicios Técnicos Profesionales",
  description:
    "Servicios técnicos profesionales de reparación y mantenimiento de computadoras, laptops y celulares. Diagnóstico rápido, garantía incluida y atención personalizada.",
  generator: "v0.app",
  keywords: ["reparación", "computadoras", "laptops", "celulares", "servicio técnico", "tecnología", "TecnoKnG"],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a73e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CategoriesProvider>
              <BrandsProvider>
                <StoreProvider>
                  <ToastProvider>{children}</ToastProvider>
                </StoreProvider>
              </BrandsProvider>
            </CategoriesProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
