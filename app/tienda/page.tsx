import { Header } from "@/components/header"
import { StoreView } from "@/components/store/store-view"
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
      <main className="pb-16 md:pb-0 pt-0">
        <StoreView />
      </main>

      <Chatbox />
    </div>
  )
}
