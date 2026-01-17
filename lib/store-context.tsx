"use client"

import * as React from "react"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
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

interface StoreContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
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
  const [orders, setOrders] = React.useState<OrderRequest[]>([])
  const [contactMessages, setContactMessages] = React.useState<ContactMessage[]>([])

  const addToCart = React.useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
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
      setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    },
    [removeFromCart],
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
