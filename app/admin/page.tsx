"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  Package,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  ShoppingBag,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  Circle,
  ArrowRight,
  Send,
  Plus,
  X,
} from "lucide-react"
import { useStore, type OrderRequest, type ContactMessage } from "@/lib/store-context"
import { useToast } from "@/components/ui/toast"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "dastech2024"

const productCategories = [
  { id: "accessories", label: "Accesorios" },
  { id: "cables", label: "Cables" },
  { id: "storage", label: "Almacenamiento" },
  { id: "batteries", label: "Baterías" },
  { id: "screens", label: "Pantallas" },
]

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const { addToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("dastech_admin_auth", "true")
      onLogin()
      addToast("Sesión iniciada correctamente", "success")
    } else {
      setError("Usuario o contraseña incorrectos")
      addToast("Credenciales incorrectas", "error")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-foreground-secondary mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Usuario</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError("")
                }}
                className={`w-full px-4 py-3 pl-12 rounded-xl bg-background-secondary border ${
                  error ? "border-error" : "border-border"
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl bg-background-secondary border ${
                  error ? "border-error" : "border-border"
                } text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-error text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}

function KanbanOrderCard({
  order,
  onMoveToNext,
  onSendNotification,
}: {
  order: OrderRequest
  onMoveToNext: () => void
  onSendNotification: (type: "whatsapp" | "email") => void
}) {
  return (
    <div className="p-4 rounded-xl bg-background border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-xs text-foreground-muted">{order.id}</span>
          <h4 className="font-semibold text-foreground text-sm">{order.customerName}</h4>
        </div>
        <span className="text-xs text-foreground-muted">{new Date(order.createdAt).toLocaleDateString("es-ES")}</span>
      </div>

      <div className="space-y-1 text-xs text-foreground-secondary mb-3">
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3" />
          <span>{order.customerPhone}</span>
        </div>
        {order.customerEmail && (
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            <span className="truncate">{order.customerEmail}</span>
          </div>
        )}
      </div>

      <div className="p-2 rounded-lg bg-background-secondary mb-3">
        <div className="text-xs text-foreground-secondary">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="truncate">
                {item.name} x{item.quantity}
              </span>
            </div>
          ))}
          {order.items.length > 2 && <span className="text-foreground-muted">+{order.items.length - 2} más...</span>}
        </div>
        <div className="flex justify-between font-semibold text-foreground text-sm mt-2 pt-2 border-t border-border">
          <span>Total</span>
          <span className="text-primary">${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onSendNotification("whatsapp")}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors"
        >
          <Send className="w-3 h-3" />
          WhatsApp
        </button>
        {order.customerEmail && (
          <button
            onClick={() => onSendNotification("email")}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-medium hover:bg-blue-500/20 transition-colors"
          >
            <Mail className="w-3 h-3" />
            Email
          </button>
        )}
      </div>

      {order.status !== "completed" && order.status !== "cancelled" && (
        <button
          onClick={onMoveToNext}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          Mover a siguiente
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

function KanbanMessageCard({
  message,
  onMoveToNext,
  onSendNotification,
}: {
  message: ContactMessage
  onMoveToNext: () => void
  onSendNotification: (type: "whatsapp" | "email") => void
}) {
  return (
    <div className="p-4 rounded-xl bg-background border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-xs text-foreground-muted">{message.id}</span>
          <h4 className="font-semibold text-foreground text-sm">{message.name}</h4>
        </div>
        <span className="text-xs text-foreground-muted">{new Date(message.createdAt).toLocaleDateString("es-ES")}</span>
      </div>

      <div className="space-y-1 text-xs text-foreground-secondary mb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3" />
          <span className="truncate">{message.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3" />
          <span>{message.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-3 h-3" />
          <span>{message.service}</span>
        </div>
      </div>

      <div className="p-2 rounded-lg bg-background-secondary mb-3">
        <p className="text-xs text-foreground-secondary line-clamp-3">{message.message}</p>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onSendNotification("whatsapp")}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors"
        >
          <Send className="w-3 h-3" />
          WhatsApp
        </button>
        <button
          onClick={() => onSendNotification("email")}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-medium hover:bg-blue-500/20 transition-colors"
        >
          <Mail className="w-3 h-3" />
          Email
        </button>
      </div>

      {message.status !== "replied" && (
        <button
          onClick={onMoveToNext}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          Mover a siguiente
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = React.useState<"orders" | "messages">("orders")
  const [isProductModalOpen, setIsProductModalOpen] = React.useState(false)
  const [productForm, setProductForm] = React.useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: productCategories[0]?.id ?? "accessories",
    stock: "",
    available: true,
  })
  const {
    orders,
    updateOrderStatus,
    contactMessages,
    updateMessageStatus,
    products,
    addProduct,
    updateProductStock,
    toggleProductAvailability,
  } = useStore()
  const { addToast } = useToast()

  const ordersByStatus = {
    pending: orders.filter((o) => o.status === "pending"),
    contacted: orders.filter((o) => o.status === "contacted"),
    completed: orders.filter((o) => o.status === "completed"),
  }

  const messagesByStatus = {
    pending: contactMessages.filter((m) => m.status === "pending"),
    read: contactMessages.filter((m) => m.status === "read"),
    replied: contactMessages.filter((m) => m.status === "replied"),
  }

  const handleMoveOrder = (orderId: string, currentStatus: OrderRequest["status"]) => {
    const nextStatus: Record<string, OrderRequest["status"]> = {
      pending: "contacted",
      contacted: "completed",
    }
    if (nextStatus[currentStatus]) {
      updateOrderStatus(orderId, nextStatus[currentStatus])
      addToast("Pedido movido correctamente", "success")
    }
  }

  const handleMoveMessage = (messageId: string, currentStatus: ContactMessage["status"]) => {
    const nextStatus: Record<string, ContactMessage["status"]> = {
      pending: "read",
      read: "replied",
    }
    if (nextStatus[currentStatus]) {
      updateMessageStatus(messageId, nextStatus[currentStatus])
      addToast("Mensaje movido correctamente", "success")
    }
  }

  const handleSendNotification = (type: "whatsapp" | "email", phone: string, email?: string, name?: string) => {
    const message = encodeURIComponent(
      `Hola ${name || ""}! Gracias por contactar a DasTech. He recibido tu solicitud y me pondré en contacto contigo pronto. - DasTech`,
    )

    if (type === "whatsapp") {
      const cleanPhone = phone.replace(/\D/g, "")
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank")
      addToast("Abriendo WhatsApp...", "success")
    } else if (type === "email" && email) {
      const subject = encodeURIComponent("DasTech - Confirmación de solicitud")
      window.open(`mailto:${email}?subject=${subject}&body=${message}`, "_blank")
      addToast("Abriendo cliente de correo...", "success")
    }
  }

  const totalPendingOrders = ordersByStatus.pending.length
  const totalPendingMessages = messagesByStatus.pending.length
  const lowStockProducts = products.filter((product) => product.stock <= 3)

  const resetProductForm = () =>
    setProductForm({
      name: "",
      description: "",
      price: "",
      image: "",
      category: productCategories[0]?.id ?? "accessories",
      stock: "",
      available: true,
    })

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!productForm.name || !productForm.price || !productForm.image) {
      addToast("Completa los campos obligatorios", "error")
      return
    }

    addProduct({
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      image: productForm.image,
      category: productForm.category,
      stock: Number(productForm.stock) || 0,
      available: productForm.available,
    })

    addToast("Producto registrado correctamente", "success")
    setIsProductModalOpen(false)
    resetProductForm()
  }

  const handleStockChange = (productId: string, value: string) => {
    const stockValue = Number(value)
    if (Number.isNaN(stockValue) || stockValue < 0) {
      return
    }
    updateProductStock(productId, stockValue)
  }

  const handleToggleAvailability = (productId: string) => {
    toggleProductAvailability(productId)
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-foreground-secondary hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Volver</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-bold text-foreground">Panel Admin</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 sm:p-6 rounded-2xl bg-background border border-border">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{orders.length}</p>
                <p className="text-xs sm:text-sm text-foreground-secondary">Pedidos</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-background border border-border">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{totalPendingOrders}</p>
                <p className="text-xs sm:text-sm text-foreground-secondary">Pendientes</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-background border border-border">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{contactMessages.length}</p>
                <p className="text-xs sm:text-sm text-foreground-secondary">Mensajes</p>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-background border border-border">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-error/10 flex items-center justify-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{totalPendingMessages}</p>
                <p className="text-xs sm:text-sm text-foreground-secondary">Sin leer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <section className="bg-background rounded-2xl border border-border p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-foreground-secondary">Productos disponibles</p>
              <h2 className="text-xl font-bold text-foreground">Inventario en tiempo real</h2>
              <p className="text-xs text-foreground-muted mt-1">
                {lowStockProducts.length > 0
                  ? `${lowStockProducts.length} productos con bajo stock`
                  : "Inventario saludable"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg transition-shadow"
              >
                <Plus className="w-4 h-4" />
                Registrar producto
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground-secondary hover:text-primary"
              >
                Actualizar vista
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4 max-h-[32rem] overflow-y-auto pr-1 custom-scrollbar">
            {products.length === 0 ? (
              <p className="text-foreground-muted text-sm">Aún no hay productos registrados.</p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl bg-background-secondary border border-border flex flex-col gap-4 sm:flex-row sm:items-center"
                >
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-background">
                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground leading-tight">{product.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {productCategories.find((cat) => cat.id === product.category)?.label || product.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground-secondary line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex flex-col gap-3 w-full sm:w-48">
                    <div>
                      <p className="text-xs text-foreground-muted">Precio</p>
                      <p className="text-lg font-semibold text-foreground">${product.price}</p>
                    </div>
                    <div>
                      <label className="text-xs text-foreground-muted">Stock</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          min={0}
                          value={product.stock}
                          onChange={(e) => handleStockChange(product.id, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm"
                        />
                        <span className="text-xs text-foreground-muted">uds.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleAvailability(product.id)}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        product.available
                          ? "bg-primary/10 text-primary hover:bg-primary/20"
                          : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                      }`}
                    >
                      {product.available ? "Disponible" : "Pausado"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground-secondary hover:text-foreground border border-border"
            }`}
          >
            <Package className="w-5 h-5" />
            Pedidos
            {totalPendingOrders > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "orders" ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                }`}
              >
                {totalPendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === "messages"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground-secondary hover:text-foreground border border-border"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Mensajes
            {totalPendingMessages > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "messages" ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                }`}
              >
                {totalPendingMessages}
              </span>
            )}
          </button>
        </div>

        {activeTab === "orders" ? (
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {/* Por hacer */}
            <div className="bg-background rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Circle className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-foreground">Por hacer</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-medium">
                  {ordersByStatus.pending.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {ordersByStatus.pending.length === 0 ? (
                  <p className="text-center text-foreground-muted text-sm py-8">Sin pedidos</p>
                ) : (
                  ordersByStatus.pending.map((order) => (
                    <KanbanOrderCard
                      key={order.id}
                      order={order}
                      onMoveToNext={() => handleMoveOrder(order.id, order.status)}
                      onSendNotification={(type) =>
                        handleSendNotification(type, order.customerPhone, order.customerEmail, order.customerName)
                      }
                    />
                  ))
                )}
              </div>
            </div>

            {/* En proceso */}
            <div className="bg-background rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-foreground">En proceso</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
                  {ordersByStatus.contacted.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {ordersByStatus.contacted.length === 0 ? (
                  <p className="text-center text-foreground-muted text-sm py-8">Sin pedidos</p>
                ) : (
                  ordersByStatus.contacted.map((order) => (
                    <KanbanOrderCard
                      key={order.id}
                      order={order}
                      onMoveToNext={() => handleMoveOrder(order.id, order.status)}
                      onSendNotification={(type) =>
                        handleSendNotification(type, order.customerPhone, order.customerEmail, order.customerName)
                      }
                    />
                  ))
                )}
              </div>
            </div>

            {/* Completados */}
            <div className="bg-background rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-foreground">Completados</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                  {ordersByStatus.completed.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {ordersByStatus.completed.length === 0 ? (
                  <p className="text-center text-foreground-muted text-sm py-8">Sin pedidos</p>
                ) : (
                  ordersByStatus.completed.map((order) => (
                    <KanbanOrderCard
                      key={order.id}
                      order={order}
                      onMoveToNext={() => {}}
                      onSendNotification={(type) =>
                        handleSendNotification(type, order.customerPhone, order.customerEmail, order.customerName)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {/* Sin leer */}
            <div className="bg-background rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Circle className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-foreground">Sin leer</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-medium">
                  {messagesByStatus.pending.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {messagesByStatus.pending.length === 0 ? (
                  <p className="text-center text-foreground-muted text-sm py-8">Sin mensajes</p>
                ) : (
                  messagesByStatus.pending.map((message) => (
                    <KanbanMessageCard
                      key={message.id}
                      message={message}
                      onMoveToNext={() => handleMoveMessage(message.id, message.status)}
                      onSendNotification={(type) =>
                        handleSendNotification(type, message.phone, message.email, message.name)
                      }
                    />
                  ))
                )}
              </div>
            </div>

            {/* Leídos */}
            <div className="bg-background rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-foreground">Leídos</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
                  {messagesByStatus.read.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {messagesByStatus.read.length === 0 ? (
                  <p className="text-center text-foreground-muted text-sm py-8">Sin mensajes</p>
                ) : (
                  messagesByStatus.read.map((message) => (
                    <KanbanMessageCard
                      key={message.id}
                      message={message}
                      onMoveToNext={() => handleMoveMessage(message.id, message.status)}
                      onSendNotification={(type) =>
                        handleSendNotification(type, message.phone, message.email, message.name)
                      }
                    />
                  ))
                )}
              </div>
            </div>

            {/* Respondidos */}
            <div className="bg-background rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-foreground">Respondidos</h3>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                  {messagesByStatus.replied.length}
                </span>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {messagesByStatus.replied.length === 0 ? (
                  <p className="text-center text-foreground-muted text-sm py-8">Sin mensajes</p>
                ) : (
                  messagesByStatus.replied.map((message) => (
                    <KanbanMessageCard
                      key={message.id}
                      message={message}
                      onMoveToNext={() => {}}
                      onSendNotification={(type) =>
                        handleSendNotification(type, message.phone, message.email, message.name)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  React.useEffect(() => {
    const auth = localStorage.getItem("dastech_admin_auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("dastech_admin_auth")
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
