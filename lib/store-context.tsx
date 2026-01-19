"use client"

import * as React from "react"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
  available: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface OrderRequest {
  id: string
  items: CartItem[]
  total: number
  customerName: string
  customerPhone: string
  customerEmail: string
  notes: string
  status: "pending" | "contacted" | "completed" | "cancelled"
  createdAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: "pending" | "read" | "replied"
  createdAt: Date
}

const initialProducts: Product[] = [
  {
    id: "prd-1",
    name: "Cargador USB-C 65W",
    price: 35000,
    image: "/usb-c-charger-65w-fast-charging-black-modern.jpg",
    category: "accessories",
    description: "Cargador rápido compatible con laptops y celulares",
    stock: 15,
    available: true,
  },
  {
    id: "prd-2",
    name: "Mouse Inalámbrico Pro",
    price: 28000,
    image: "/wireless-ergonomic-mouse-black-sleek-design.jpg",
    category: "accessories",
    description: "Mouse ergonómico con sensor de alta precisión",
    stock: 20,
    available: true,
  },
  {
    id: "prd-3",
    name: "Cable HDMI 2.1 4K",
    price: 18000,
    image: "/hdmi-cable-4k-premium-braided.jpg",
    category: "cables",
    description: "Cable de alta velocidad para monitores 4K",
    stock: 30,
    available: true,
  },
  {
    id: "prd-4",
    name: "SSD NVMe 500GB",
    price: 65000,
    image: "/nvme-ssd-500gb-internal-drive.jpg",
    category: "storage",
    description: "Disco de estado sólido de alta velocidad",
    stock: 12,
    available: true,
  },
  {
    id: "prd-5",
    name: "Batería iPhone 13",
    price: 45000,
    image: "/iphone-battery-replacement-internal.jpg",
    category: "batteries",
    description: "Batería de reemplazo original",
    stock: 10,
    available: true,
  },
  {
    id: "prd-6",
    name: "Pantalla Samsung A54",
    price: 89000,
    image: "/samsung-phone-screen-amoled-replacement.jpg",
    category: "screens",
    description: "Pantalla AMOLED de reemplazo",
    stock: 6,
    available: true,
  },
  {
    id: "prd-7",
    name: "Teclado Mecánico RGB",
    price: 75000,
    image: "/mechanical-rgb-keyboard-gaming-black.jpg",
    category: "accessories",
    description: "Teclado gaming con switches mecánicos",
    stock: 9,
    available: true,
  },
  {
    id: "prd-8",
    name: "Cable USB-C a Lightning",
    price: 15000,
    image: "/usb-c-to-lightning-cable-white-braided.jpg",
    category: "cables",
    description: "Cable de carga rápida para iPhone",
    stock: 25,
    available: true,
  },
  {
    id: "prd-9",
    name: "Disco Duro Externo 1TB",
    price: 55000,
    image: "/external-hard-drive-1tb-portable-black.jpg",
    category: "storage",
    description: "Almacenamiento portátil USB 3.0",
    stock: 8,
    available: true,
  },
  {
    id: "prd-10",
    name: "Batería Samsung S22",
    price: 42000,
    image: "/samsung-galaxy-battery-replacement.jpg",
    category: "batteries",
    description: "Batería de reemplazo de alta capacidad",
    stock: 11,
    available: true,
  },
  {
    id: "prd-11",
    name: "Webcam HD 1080p",
    price: 38000,
    image: "/webcam-hd-1080p-streaming-black.jpg",
    category: "accessories",
    description: "Cámara web para videollamadas y streaming",
    stock: 14,
    available: true,
  },
  {
    id: "prd-12",
    name: "Cable DisplayPort 1.4",
    price: 22000,
    image: "/displayport-cable-premium-8k.jpg",
    category: "cables",
    description: "Cable para monitores gaming de alta frecuencia",
    stock: 18,
    available: true,
  },
]

interface StoreContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProductStock: (productId: string, stock: number) => void
  toggleProductAvailability: (productId: string) => void
  orders: OrderRequest[]
  addOrder: (order: Omit<OrderRequest, "id" | "createdAt" | "status">) => void
  updateOrderStatus: (orderId: string, status: OrderRequest["status"]) => void
  contactMessages: ContactMessage[]
  addContactMessage: (message: Omit<ContactMessage, "id" | "createdAt" | "status">) => void
  updateMessageStatus: (messageId: string, status: ContactMessage["status"]) => void
}

const StoreContext = React.createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [products, setProducts] = React.useState<Product[]>(initialProducts)
  const [orders, setOrders] = React.useState<OrderRequest[]>([])
  const [contactMessages, setContactMessages] = React.useState<ContactMessage[]>([])

  const addToCart = React.useCallback((product: Product) => {
    if (!product.available || product.stock <= 0) {
      return
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      const nextQuantity = existing ? existing.quantity + 1 : 1

      if (nextQuantity > product.stock) {
        return prev
      }

      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: nextQuantity } : item))
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = React.useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = React.useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }

      const product = products.find((p) => p.id === productId)
      const cappedQuantity = product ? Math.min(quantity, product.stock) : quantity

      setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity: cappedQuantity } : item)))
    },
    [removeFromCart, products],
  )

  const clearCart = React.useCallback(() => {
    setCart([])
  }, [])

  const addOrder = React.useCallback((order: Omit<OrderRequest, "id" | "createdAt" | "status">) => {
    const newOrder: OrderRequest = {
      ...order,
      id: `ORD-${Date.now()}`,
      status: "pending",
      createdAt: new Date(),
    }
    setOrders((prev) => [newOrder, ...prev])
    setProducts((prev) =>
      prev.map((product) => {
        const item = order.items.find((cartItem) => cartItem.id === product.id)
        if (!item) return product
        const updatedStock = Math.max(0, product.stock - item.quantity)
        return {
          ...product,
          stock: updatedStock,
          available: updatedStock === 0 ? false : product.available,
        }
      }),
    )
  }, [])

  const updateOrderStatus = React.useCallback((orderId: string, status: OrderRequest["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }, [])

  const addContactMessage = React.useCallback((message: Omit<ContactMessage, "id" | "createdAt" | "status">) => {
    const newMessage: ContactMessage = {
      ...message,
      id: `MSG-${Date.now()}`,
      status: "pending",
      createdAt: new Date(),
    }
    setContactMessages((prev) => [newMessage, ...prev])
  }, [])

  const updateMessageStatus = React.useCallback((messageId: string, status: ContactMessage["status"]) => {
    setContactMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg)))
  }, [])

  const cartTotal = React.useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  const cartCount = React.useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  const addProduct = React.useCallback((product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `PRD-${Date.now()}`,
    }
    setProducts((prev) => [newProduct, ...prev])
  }, [])

  const updateProductStock = React.useCallback((productId: string, stock: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product
        const safeStock = Math.max(0, stock)
        return {
          ...product,
          stock: safeStock,
          available: safeStock === 0 ? false : product.available,
        }
      }),
    )
  }, [])

  const toggleProductAvailability = React.useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, available: !product.available } : product)),
    )
  }, [])

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        products,
        addProduct,
        updateProductStock,
        toggleProductAvailability,
        orders,
        addOrder,
        updateOrderStatus,
        contactMessages,
        addContactMessage,
        updateMessageStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
