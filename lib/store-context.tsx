"use client"

import * as React from "react"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  brand: string
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
  deleteProduct: (productId: string) => void
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
  const [products, setProducts] = React.useState<Product[]>([])
  const [orders, setOrders] = React.useState<OrderRequest[]>([])
  const [contactMessages, setContactMessages] = React.useState<ContactMessage[]>([])

  // Load initial data from API
  React.useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/messages").then((r) => r.json()),
    ])
      .then(([productsData, ordersData, messagesData]) => {
        console.log("Products fetched from API:", productsData)
        console.log("Type of productsData:", typeof productsData)
        console.log("Is array?", Array.isArray(productsData))
        
        // Asegurarse de que productsData sea un array
        const productsArray = Array.isArray(productsData) ? productsData : []
        
        console.log("Products array:", productsArray)
        console.log("First product structure:", productsArray[0])
        
        if (productsArray.length > 0) {
          console.log("Product IDs:", productsArray.map(p => ({ id: p.id, name: p.name })))
        }
        
        setProducts(productsArray)
        setOrders(ordersData)
        setContactMessages(messagesData)
      })
      .catch(console.error)
  }, [])

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

  const addOrder = React.useCallback(async (order: Omit<OrderRequest, "id" | "createdAt" | "status">) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
    const newOrder = await res.json()
    setOrders((prev) => [newOrder, ...(Array.isArray(prev) ? prev : [])])
    return newOrder
  }, [])

  const updateOrderStatus = React.useCallback((orderId: string, status: OrderRequest["status"]) => {
    setOrders((prev) => (Array.isArray(prev) ? prev : []).map((order) => (order.id === orderId ? { ...order, status } : order)))
  }, [])

  const addContactMessage = React.useCallback(async (message: Omit<ContactMessage, "id" | "createdAt" | "status">) => {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
    const newMessage = await res.json()
    setContactMessages((prev) => [newMessage, ...(Array.isArray(prev) ? prev : [])])
    return newMessage
  }, [])

  const updateMessageStatus = React.useCallback((messageId: string, status: ContactMessage["status"]) => {
    setContactMessages((prev) => (Array.isArray(prev) ? prev : []).map((msg) => (msg.id === messageId ? { ...msg, status } : msg)))
  }, [])

  const cartTotal = React.useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])

  const cartCount = React.useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])

  const addProduct = React.useCallback(async (product: Omit<Product, "id">) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    const newProduct = await res.json()
    setProducts((prev) => [newProduct, ...(Array.isArray(prev) ? prev : [])])
    return newProduct
  }, [])

  const updateProductStock = React.useCallback(async (productId: string, stock: number) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    })
    const updated = await res.json()
    setProducts((prev) => (Array.isArray(prev) ? prev : []).map((p) => (p.id === productId ? updated : p)))
    return updated
  }, [])

  const toggleProductAvailability = React.useCallback(async (productId: string) => {
    const current = (Array.isArray(products) ? products : []).find((p) => p.id === productId)
    if (!current) return

    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !current.available }),
    })
    const updated = await res.json()
    setProducts((prev) => (Array.isArray(prev) ? prev : []).map((p) => (p.id === productId ? updated : p)))
    return updated
  }, [products])

  const deleteProduct = React.useCallback(async (productId: string) => {
    console.log("deleteProduct called with productId:", productId)
    
    if (!productId) {
      console.error("Product ID is undefined or empty in deleteProduct")
      throw new Error("ID de producto inválido")
    }

    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.details || errorData.error || "Error al eliminar producto")
    }
    
    setProducts((prev) => (Array.isArray(prev) ? prev : []).filter((p) => p.id !== productId))
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
        deleteProduct,
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
