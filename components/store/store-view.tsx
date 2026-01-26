"use client"

import * as React from "react"
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Package,
  Headphones,
  Cable,
  HardDrive,
  Battery,
  MonitorSmartphone,
  Search,
  ChevronLeft,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useStore, type Product } from "@/lib/store-context"
import { useToast } from "@/components/ui/toast"

const categories = [
  { id: "all", name: "Todos los productos", icon: Package },
  { id: "accessories", name: "Accesorios", icon: Headphones },
  { id: "cables", name: "Cables", icon: Cable },
  { id: "storage", name: "Almacenamiento", icon: HardDrive },
  { id: "batteries", name: "Baterías", icon: Battery },
  { id: "screens", name: "Pantallas", icon: MonitorSmartphone },
]

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  const isOutOfStock = !product.available || product.stock <= 0
  return (
    <article className="group bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative">
      <div className={`aspect-square overflow-hidden bg-background-secondary ${isOutOfStock ? "opacity-70" : ""}`}>
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/60 text-background font-semibold text-lg tracking-wide">
          Agotado
        </div>
      )}
      <div className="p-4 bg-primary">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-primary-foreground font-semibold text-sm truncate" title={product.name}>
            {product.name}
          </h3>
          <span className="text-xs font-medium text-primary-foreground/70">{product.stock} uds.</span>
        </div>
        <p className="text-primary-foreground/80 font-bold mb-3">${product.price}</p>
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
            isOutOfStock
              ? "bg-background/60 text-primary-foreground/50 cursor-not-allowed"
              : "bg-background text-primary hover:bg-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {isOutOfStock ? "Sin stock" : "Agregar"}
        </button>
      </div>
    </article>
  )
}

function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, addOrder } = useStore()
  const { addToast } = useToast()
  const [showCheckout, setShowCheckout] = React.useState(false)
  const [formData, setFormData] = React.useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
  })

  const handleCheckout = () => {
    if (!formData.customerName || !formData.customerPhone) {
      addToast("Por favor completa los campos requeridos", "error")
      return
    }

    addOrder({
      items: [...cart],
      total: cartTotal,
      ...formData,
    })

    clearCart()
    setShowCheckout(false)
    setFormData({ customerName: "", customerPhone: "", customerEmail: "", notes: "" })
    onClose()
    addToast("Pedido enviado correctamente. Te contactaré pronto por WhatsApp o email.", "success")
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">{showCheckout ? "Finalizar pedido" : "Tu Carrito"}</h2>
            <button
              onClick={() => {
                if (showCheckout) {
                  setShowCheckout(false)
                } else {
                  onClose()
                }
              }}
              className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center hover:bg-error/10 hover:text-error transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {showCheckout ? (
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nombre completo *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email (opcional)</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notas adicionales</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="¿Alguna indicación especial?"
                  />
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="font-medium text-foreground mb-2">Resumen del pedido</h4>
                  <div className="space-y-1 text-sm text-foreground-secondary">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-bold text-foreground mt-3 pt-3 border-t border-border">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-16 h-16 text-foreground-muted mb-4" />
                  <p className="text-foreground-secondary">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-background-secondary">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                        <p className="text-primary font-bold">${item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center hover:border-primary transition-colors"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center hover:border-primary transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error/10 transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {cart.length > 0 && (
            <div className="p-6 border-t border-border space-y-4">
              {!showCheckout && (
                <div className="flex items-center justify-between">
                  <span className="text-foreground-secondary">Total</span>
                  <span className="text-2xl font-bold text-foreground">${cartTotal.toFixed(2)}</span>
                </div>
              )}
              <button
                onClick={showCheckout ? handleCheckout : () => setShowCheckout(true)}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:bg-primary-hover hover:shadow-lg"
              >
                {showCheckout ? "Enviar pedido" : "Comprar ahora"}
              </button>
              {!showCheckout && (
                <button
                  onClick={clearCart}
                  className="w-full py-3 rounded-xl bg-background-secondary text-foreground-secondary font-medium transition-colors hover:text-error"
                >
                  Vaciar carrito
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function MobileCategorySidebar({
  isOpen,
  onClose,
  activeCategory,
  setActiveCategory,
  cartCount,
  onOpenCart,
}: {
  isOpen: boolean
  onClose: () => void
  activeCategory: string
  setActiveCategory: (category: string) => void
  cartCount: number
  onOpenCart: () => void
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-foreground/50 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-primary via-primary to-primary/90 z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-primary-foreground">TecnoKnG</span>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id)
                  onClose()
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-primary-foreground text-primary font-semibold"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </nav>

          {/* <button
            onClick={() => {
              onOpenCart()
              onClose()
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-colors mt-4"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">Carrito</span>
            {cartCount > 0 && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-bold">
                {cartCount}
              </span>
            )}
          </button> */}

          <p className="text-primary-foreground/50 text-xs mb-15 lg:mb-0 mt-6">© 2026 TecnoKnG</p>
        </div>
      </aside>
    </>
  )
}

export function StoreView() {
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [cartOpen, setCartOpen] = React.useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { cart, cartCount, addToCart, products } = useStore()
  const { addToast } = useToast()

  const filteredProducts = React.useMemo(() => {
    let filtered = Array.isArray(products) ? products : []
    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query),
      )
    }
    return filtered
  }, [activeCategory, searchQuery, products])

  const handleAddToCart = (product: Product) => {
    const inCart = cart.find((item) => item.id === product.id)
    if (!product.available || product.stock <= (inCart?.quantity || 0)) {
      addToast("Este producto no tiene stock disponible", "error")
      return
    }
    addToCart(product)
    addToast(`${product.name} agregado al carrito`, "success")
  }

  const activeCategoryName = categories.find((c) => c.id === activeCategory)?.name || "Todos los productos"

  return (
    <section className="min-h-screen bg-background-secondary">
      <div className="relative">
        <div className="pointer-events-none hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-background-secondary via-background/80 to-transparent backdrop-blur-[12px] opacity-90 z-10" />
        <div className="pointer-events-none hidden lg:block absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-background-secondary via-background/80 to-transparent backdrop-blur-[12px] opacity-90 z-10" />

        {/* <div className="relative z-20 px-4 py-4 lg:px-6 lg:py-0 lg:max-w-7xl lg:mx-auto"> */}
          <div className="relative z-20 px-4 py-4 lg:px-0 lg:py-0 lg:mx-auto">
          <div className="flex min-h-screen gap-6 lg:gap-0">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-primary via-primary to-primary/90 sticky top-0 h-screen">
            <nav className="flex-1 px-4 space-y-1 pt-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeCategory === category.id
                      ? "bg-primary-foreground text-primary font-semibold"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </nav>
            <div className="px-4 pb-6 text-center text-primary-foreground/60 text-xs">© 2026 DasTech</div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border -mx-4 -mt-4">
              <div className="flex items-center justify-between px-4 py-3 gap-3">
                <Link href="/" className="text-lg font-bold text-foreground flex-shrink-0">
                  Tecno<span className="text-primary">KnG</span>
                </Link>
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex-1 justify-center"
                >
                  <Package className="w-5 h-5" />
                  <span>Categorías</span>
                </button>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setCartOpen(true)}
                    className="relative w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-white text-xs font-bold flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <Link
                    href="/admin"
                    className="w-10 h-10 rounded-xl border border-border text-foreground flex items-center justify-center bg-background-secondary hover:border-primary hover:text-primary transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="sr-only">Panel administrativo</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Products Area */}
            <div className="p-4 lg:px-8 lg:py-10">
              {/* Search */}
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <button
                    onClick={() => setCartOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-sm font-medium">Ver carrito</span>
                    {cartCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-foreground bg-background-secondary hover:border-primary hover:text-primary transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-medium">Panel admin</span>
                  </Link>
                </div>
              </div>

              {/* Category Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">{activeCategoryName}</h1>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-background rounded-2xl">
                  <Package className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                  <p className="text-foreground-secondary">No se encontraron productos</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              )}
            </div>
          </main>
          </div>
        </div>
      </div>

      {/* Mobile Category Sidebar */}
      <MobileCategorySidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </section>
  )
}
