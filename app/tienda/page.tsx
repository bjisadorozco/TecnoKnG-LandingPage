import { Header } from "@/components/header"
import { StoreView } from "@/components/store/store-view"
import { Footer } from "@/components/footer"
import { Chatbox } from "@/components/chatbox"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tienda | DasTech - Accesorios y Repuestos",
  description: "Encuentra los mejores accesorios y repuestos para tus dispositivos. Productos de calidad con garantía.",
}

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 md:pb-0 pt-0 md:pt-20">
        <StoreView />
      </main>
      {/* <Footer /> */}
      
      <Chatbox />
    </div>
  )
}
