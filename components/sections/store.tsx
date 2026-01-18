"use client"

import * as React from "react"
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Menu,
  Package,
  Headphones,
  Cable,
  HardDrive,
  Battery,
  MonitorSmartphone,
} from "lucide-react"
import { useStore, type Product } from "@/lib/store-context"

const categories = [
  { id: "all", name: "Todos", icon: Package },
  { id: "accessories", name: "Accesorios", icon: Headphones },
  { id: "cables", name: "Cables", icon: Cable },
  { id: "storage", name: "Almacenamiento", icon: HardDrive },
  { id: "batteries", name: "Baterías", icon: Battery },
  { id: "screens", name: "Pantallas", icon: MonitorSmartphone },
]

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  const isOutOfStock = !product.available || product.stock <= 0
  return (
    <article className="group relative rounded-2xl overflow-hidden bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <div className={`aspect-square overflow-hidden bg-background-secondary ${isOutOfStock ? "opacity-60" : ""}`}>
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/60 text-background text-sm font-semibold tracking-wide">
          Sin stock
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-primary rounded-b-2xl">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-primary-foreground font-semibold text-sm truncate">{product.name}</h3>
          <span className="text-xs text-primary-foreground/70">{product.stock} uds.</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-primary-foreground/80 font-bold">${product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
              isOutOfStock
                ? "bg-background/40 text-primary-foreground/50 cursor-not-allowed"
                : "bg-background text-primary hover:bg-primary-foreground hover:text-primary-foreground hover:scale-105 active:scale-95"
            }`}
          >
            {isOutOfStock ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  )
}

function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useStore()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Cart Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Tu Carrito</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-background-secondary flex items-center justify-center hover:bg-error/10 hover:text-error transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
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

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary">Total</span>
                <span className="text-2xl font-bold text-foreground">${cartTotal.toFixed(2)}</span>
              </div>
              <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:bg-primary-hover hover:shadow-lg">
                Comprar ahora
              </button>
              <button
                onClick={clearCart}
                className="w-full py-3 rounded-xl bg-background-secondary text-foreground-secondary font-medium transition-colors hover:text-error"
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export function StoreSection() {
  const [activeCategory, setActiveCategory] = React.useState("all")
  const [cartOpen, setCartOpen] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const { cartCount, addToCart, products: storeProducts } = useStore()

  const filteredProducts = React.useMemo(() => {
    if (activeCategory === "all") return storeProducts
    return storeProducts.filter((p) => p.category === activeCategory)
  }, [activeCategory, storeProducts])

  return (
    <section id="tienda" className="py-20 md:py-9 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <ShoppingCart className="w-4 h-4" />
            <span>Tienda online</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Accesorios y repuestos de <span className="text-primary">calidad</span>
          </h2>
          <p className="text-lg text-foreground-secondary leading-relaxed text-pretty">
            Encuentra todo lo que necesitas para tus dispositivos. Productos originales y compatibles con garantía
            incluida.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
          >
            <Menu className="w-5 h-5" />
            Categorías
          </button>

          {/* Sidebar - Mobile */}
          <div
            className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside
              className={`absolute top-0 left-0 h-full w-72 bg-primary p-6 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-primary-foreground">Categorías</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center text-primary-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeCategory === cat.id
                        ? "bg-background text-primary"
                        : "text-primary-foreground hover:bg-primary-foreground/10"
                    }`}
                  >
                    <cat.icon className="w-5 h-5" />
                    {cat.name}
                  </button>
                ))}
              </nav>
              <button
                onClick={() => {
                  setCartOpen(true)
                  setSidebarOpen(false)
                }}
                className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-background text-primary font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                Carrito
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </aside>
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-primary rounded-2xl p-6">
              <nav className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeCategory === cat.id
                        ? "bg-background text-primary rounded-r-none translate-x-2"
                        : "text-primary-foreground hover:bg-primary-foreground/10"
                    }`}
                  >
                    <cat.icon className="w-5 h-5" />
                    {cat.name}
                  </button>
                ))}
              </nav>
              <button
                onClick={() => setCartOpen(true)}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-background text-primary font-medium hover:bg-primary-foreground transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Carrito
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-secondary">No hay productos en esta categoría</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </section>
  )
}
