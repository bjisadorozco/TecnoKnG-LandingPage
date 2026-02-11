"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Package,
  MessageSquare,
  Clock,
  Phone,
  Mail,
  ShoppingBag,
  Plus,
  X,
  LogOut,
  Upload,
  Trash2,
  Send,
  Circle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Tag,
  Edit2,
  Save,
  Archive,
  Eye,
  History,
} from "lucide-react"
import { useStore, type OrderRequest, type ContactMessage } from "@/lib/store-context"
import { useAuth } from "@/lib/auth-context"
import { useCategories } from "@/lib/categories-context"
import { useBrands } from "@/lib/brands-context"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/ui/theme-toggle"

function AdminPage() {
  const { user, loading, logout, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { categories, loading: categoriesLoading, addCategory, updateCategory, deleteCategory } = useCategories()
  const { brands, loading: brandsLoading, addBrand, updateBrand, deleteBrand } = useBrands()

  // Estado para gestión de categorías
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false)
  const [newCategoryName, setNewCategoryName] = React.useState("")
  const [editingCategory, setEditingCategory] = React.useState<{id: string, label: string} | null>(null)

  // Estado para gestión de marcas
  const [isBrandModalOpen, setIsBrandModalOpen] = React.useState(false)
  const [newBrandName, setNewBrandName] = React.useState("")
  const [editingBrand, setEditingBrand] = React.useState<{id: string, name: string} | null>(null)

  // Funciones para gestión de categorías con persistencia
  const handleAddCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        toast({ 
          title: "Error",
          description: "El nombre de la categoría es requerido"
        })
        return
      }

      await addCategory(newCategoryName)
      setNewCategoryName("")
      toast({ 
        title: "Éxito",
        description: "Categoría agregada correctamente"
      })
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.message || "Error al agregar categoría"
      })
    }
  }

  const handleEditCategory = (category: {id: string, label: string}) => {
    setEditingCategory(category)
    setNewCategoryName(category.label)
  }

  const handleUpdateCategory = async () => {
    try {
      if (!editingCategory || !newCategoryName.trim()) {
        toast({ 
          title: "Error",
          description: "El nombre de la categoría es requerido"
        })
        return
      }

      await updateCategory(editingCategory.id, newCategoryName)
      setEditingCategory(null)
      setNewCategoryName("")
      toast({ 
        title: "Éxito",
        description: "Categoría actualizada correctamente"
      })
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.message || "Error al actualizar categoría"
      })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      if (!confirm("¿Estás seguro de que deseas eliminar esta categoría? Los productos en esta categoría no serán eliminados.")) {
        return
      }

      await deleteCategory(categoryId)
      toast({ 
        title: "Éxito",
        description: "Categoría eliminada correctamente"
      })
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.message || "Error al eliminar categoría"
      })
    }
  }

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false)
    setEditingCategory(null)
    setNewCategoryName("")
  }

  // Funciones para gestión de marcas con persistencia
  const handleAddBrand = async () => {
    try {
      if (!newBrandName.trim()) {
        toast({ 
          title: "Error",
          description: "El nombre de la marca es requerido"
        })
        return
      }

      await addBrand(newBrandName)
      setNewBrandName("")
      toast({ 
        title: "Éxito",
        description: "Marca agregada correctamente"
      })
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.message || "Error al agregar marca"
      })
    }
  }

  const handleEditBrand = (brand: {id: string, name: string}) => {
    setEditingBrand(brand)
    setNewBrandName(brand.name)
  }

  const handleUpdateBrand = async () => {
    try {
      if (!editingBrand || !newBrandName.trim()) {
        toast({ 
          title: "Error",
          description: "El nombre de la marca es requerido"
        })
        return
      }

      await updateBrand(editingBrand.id, newBrandName)
      setEditingBrand(null)
      setNewBrandName("")
      toast({ 
        title: "Éxito",
        description: "Marca actualizada correctamente"
      })
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.message || "Error al actualizar marca"
      })
    }
  }

  const handleDeleteBrand = async (brandId: string) => {
    try {
      if (!confirm("¿Estás seguro de que deseas eliminar esta marca? Los productos en esta marca no serán eliminados.")) {
        return
      }

      await deleteBrand(brandId)
      toast({ 
        title: "Éxito",
        description: "Marca eliminada correctamente"
      })
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.message || "Error al eliminar marca"
      })
    }
  }

  const closeBrandModal = () => {
    setIsBrandModalOpen(false)
    setEditingBrand(null)
    setNewBrandName("")
  }

  // Redirigir al login si no está autenticado o no es admin
  React.useEffect(() => {
    console.log('Admin page auth check:', { user: !!user, loading, isAdmin, email: user?.email, pathname: typeof window !== 'undefined' ? window.location.pathname : 'server' })
    
    // Si ya hay usuario y es admin, permitir acceso inmediatamente sin esperar loading
    if (user && isAdmin) {
      console.log('✅ Access granted to admin panel - Rendering admin content')
      return
    }
    
    // Si hay usuario pero loading es true, esperar un momento a que se resuelvan los claims
    if (user && loading) {
      console.log('⏳ User detected, waiting for claims...')
      return
    }
    
    // Si no está cargando y no hay usuario o no es admin, redirigir
    if (!loading) {
      if (!user || !isAdmin) {
        console.log('❌ Redirecting to login - User:', !!user, 'IsAdmin:', isAdmin)
        // Solo redirigir si no estamos ya en la página de login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
          router.push('/admin/login')
        }
      }
    }
  }, [user, loading, isAdmin])

  // Mostrar loading solo si no hay usuario (primer carga)
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground-secondary">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si hay usuario pero loading es true, mostrar el panel con un estado de carga sutil
  if (loading && user) {
    console.log('🔄 Showing admin panel while loading claims...')
    // Continuar y mostrar el panel, los claims se cargarán en background
  }

  // Si no está autenticado o no es admin, no renderizar nada (la redirección se encargará)
  if (!user || !isAdmin) {
    return null
  }

  return (
    <AdminDashboard 
      onLogout={logout} 
      productCategories={categories}
      isCategoryModalOpen={isCategoryModalOpen}
      setIsCategoryModalOpen={setIsCategoryModalOpen}
      newCategoryName={newCategoryName}
      setNewCategoryName={setNewCategoryName}
      editingCategory={editingCategory}
      setEditingCategory={setEditingCategory}
      handleAddCategory={handleAddCategory}
      handleEditCategory={handleEditCategory}
      handleUpdateCategory={handleUpdateCategory}
      handleDeleteCategory={handleDeleteCategory}
      closeCategoryModal={closeCategoryModal}
      productBrands={brands}
      isBrandModalOpen={isBrandModalOpen}
      setIsBrandModalOpen={setIsBrandModalOpen}
      newBrandName={newBrandName}
      setNewBrandName={setNewBrandName}
      editingBrand={editingBrand}
      setEditingBrand={setEditingBrand}
      handleAddBrand={handleAddBrand}
      handleEditBrand={handleEditBrand}
      handleUpdateBrand={handleUpdateBrand}
      handleDeleteBrand={handleDeleteBrand}
      closeBrandModal={closeBrandModal}
    />
  )
}

function KanbanOrderCard({
  order,
  onMoveToNext,
  onSendNotification,
  onArchive,
  onShowDetails,
}: {
  order: OrderRequest
  onMoveToNext: () => void
  onSendNotification: (type: "whatsapp" | "email") => void
  onArchive: () => void
  onShowDetails: () => void
}) {
  return (
    <div className="p-4 rounded-xl bg-background border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, index) => (
              <h4 key={index} className="font-semibold text-foreground text-sm truncate">
                {item.name} x{item.quantity}
              </h4>
            ))}
            {order.items.length > 2 && (
              <p className="text-xs text-foreground-muted">+{order.items.length - 2} más...</p>
            )}
          </div>
          <p className="text-xs text-foreground-secondary mt-2">{order.customerName}</p>
        </div>
        <span className="text-xs text-foreground-muted whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString("es-ES")}</span>
      </div>

      <div className="flex gap-2 mt-3">
        {order.status !== "completed" && order.status !== "cancelled" && (
          <button
            onClick={onMoveToNext}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <ArrowRight className="w-3 h-3" />
            Siguiente
          </button>
        )}
        {order.status === "completed" || order.status === "cancelled" ? (
          <button
            onClick={onArchive}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 text-xs font-medium hover:bg-orange-500/20 transition-colors"
          >
            <Archive className="w-3 h-3" />
            Archivar
          </button>
        ) : (
          <button
            onClick={onShowDetails}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-gray-500/10 text-gray-600 text-xs font-medium hover:bg-gray-500/20 transition-colors"
          >
            <Eye className="w-3 h-3" />
            Ver
          </button>
        )}
      </div>
    </div>
  )
}

function KanbanMessageCard({
  message,
  onMoveToNext,
  onSendNotification,
  onArchive,
  onShowDetails,
}: {
  message: ContactMessage
  onMoveToNext: () => void
  onSendNotification: (type: "whatsapp" | "email") => void
  onArchive: () => void
  onShowDetails: () => void
}) {
  return (
    <div className="p-4 rounded-xl bg-background border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-sm">{message.service}</h4>
          <p className="text-xs text-foreground-secondary mt-2">{message.name}</p>
        </div>
        <span className="text-xs text-foreground-muted whitespace-nowrap">{new Date(message.createdAt).toLocaleDateString("es-ES")}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onShowDetails}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-gray-500/10 text-gray-600 text-xs font-medium hover:bg-gray-500/20 transition-colors"
        >
          <Eye className="w-3 h-3" />
          Ver
        </button>
        {message.status === "replied" ? (
          <button
            onClick={onArchive}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 text-xs font-medium hover:bg-orange-500/20 transition-colors"
          >
            <Archive className="w-3 h-3" />
            Archivar
          </button>
        ) : (
          <button
            onClick={onMoveToNext}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            Siguiente
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}

function AdminDashboard({ 
  onLogout, 
  productCategories,
  isCategoryModalOpen,
  setIsCategoryModalOpen,
  newCategoryName,
  setNewCategoryName,
  editingCategory,
  setEditingCategory,
  handleAddCategory,
  handleEditCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  closeCategoryModal,
  productBrands,
  isBrandModalOpen,
  setIsBrandModalOpen,
  newBrandName,
  setNewBrandName,
  editingBrand,
  setEditingBrand,
  handleAddBrand,
  handleEditBrand,
  handleUpdateBrand,
  handleDeleteBrand,
  closeBrandModal
}: { 
  onLogout: () => void
  productCategories: {id: string, label: string}[]
  isCategoryModalOpen: boolean
  setIsCategoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  newCategoryName: string
  setNewCategoryName: React.Dispatch<React.SetStateAction<string>>
  editingCategory: {id: string, label: string} | null
  setEditingCategory: React.Dispatch<React.SetStateAction<{id: string, label: string} | null>>
  handleAddCategory: () => void
  handleEditCategory: (category: {id: string, label: string}) => void
  handleUpdateCategory: () => void
  handleDeleteCategory: (categoryId: string) => void
  closeCategoryModal: () => void
  productBrands: {id: string, name: string}[]
  isBrandModalOpen: boolean
  setIsBrandModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  newBrandName: string
  setNewBrandName: React.Dispatch<React.SetStateAction<string>>
  editingBrand: {id: string, name: string} | null
  setEditingBrand: React.Dispatch<React.SetStateAction<{id: string, name: string} | null>>
  handleAddBrand: () => void
  handleEditBrand: (brand: {id: string, name: string}) => void
  handleUpdateBrand: () => void
  handleDeleteBrand: (brandId: string) => void
  closeBrandModal: () => void
}) {
  const [activeTab, setActiveTab] = React.useState<"orders" | "messages">("orders")
  const [isProductModalOpen, setIsProductModalOpen] = React.useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = React.useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<OrderRequest | ContactMessage | null>(null)
  const [historyType, setHistoryType] = React.useState<"orders" | "messages">("orders")
  const [orderHistory, setOrderHistory] = React.useState<(OrderRequest & { archivedAt: Date })[]>([])
  const [messageHistory, setMessageHistory] = React.useState<(ContactMessage & { archivedAt: Date })[]>([])
  const [productForm, setProductForm] = React.useState({
    name: "",
    description: "",
    price: "",
    image: "",
    images: [] as string[],
    category: productCategories[0]?.id ?? "accessories",
    brand: productBrands[0]?.id ?? "",
    stock: "",
    available: true,
  })
  const {
    orders,
    updateOrderStatus,
    deleteOrder,
    contactMessages,
    updateMessageStatus,
    deleteMessage,
    products,
    addProduct,
    updateProductStock,
    toggleProductAvailability,
    deleteProduct,
  } = useStore()
  const { addToast } = useToast()

  const ordersByStatus = {
    pending: (Array.isArray(orders) ? orders : []).filter((o) => o.status === "pending"),
    contacted: (Array.isArray(orders) ? orders : []).filter((o) => o.status === "contacted"),
    completed: (Array.isArray(orders) ? orders : []).filter((o) => o.status === "completed"),
  }

  const messagesByStatus = {
    pending: (Array.isArray(contactMessages) ? contactMessages : []).filter((m) => m.status === "pending"),
    read: (Array.isArray(contactMessages) ? contactMessages : []).filter((m) => m.status === "read"),
    replied: (Array.isArray(contactMessages) ? contactMessages : []).filter((m) => m.status === "replied"),
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
      `Hola ${name || ""}! Gracias por contactar a TecnoKnG. He recibido tu solicitud y me pondré en contacto contigo pronto. - TecnoKnG`,
    )

    if (type === "whatsapp") {
      const cleanPhone = phone.replace(/\D/g, "")
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank")
      addToast("Abriendo WhatsApp...", "success")
    } else if (type === "email" && email) {
      const subject = encodeURIComponent("TecnoKnG - Confirmación de solicitud")
      window.open(`mailto:${email}?subject=${subject}&body=${message}`, "_blank")
      addToast("Abriendo cliente de correo...", "success")
    }
  }

  // Funciones para manejar historial
  const loadHistory = React.useCallback(async (type: "orders" | "messages") => {
    try {
      const response = await fetch(`/api/${type}/history`)
      const data = await response.json()
      
      if (type === "orders") {
        setOrderHistory(data)
      } else {
        setMessageHistory(data)
      }
    } catch (error) {
      console.error(`Error loading ${type} history:`, error)
      addToast(`Error al cargar historial de ${type === "orders" ? "pedidos" : "mensajes"}`, "error")
    }
  }, [addToast])

  const handleArchive = React.useCallback(async (type: "orders" | "messages", id: string) => {
    try {
      addToast(`Archivando ${type === "orders" ? "pedido" : "mensaje"}...`, "success")
      
      const response = await fetch(`/api/${type}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type === "orders" ? "orderId" : "messageId"]: id }),
      })
      
      if (response.ok) {
        addToast(`${type === "orders" ? "Pedido" : "Mensaje"} archivado correctamente`, "success")
        
        // Eliminar inmediatamente del estado local para que desaparezca de la UI
        if (type === "orders") {
          deleteOrder(id)
        } else {
          deleteMessage(id)
        }

        // Recargar historial para asegurar persistencia
        await loadHistory(type)
      } else {
        throw new Error("Error al archivar")
      }
    } catch (error) {
      console.error(`Error archiving ${type}:`, error)
      addToast(`Error al archivar ${type === "orders" ? "pedido" : "mensaje"}`, "error")
    }
  }, [addToast, deleteOrder, deleteMessage, loadHistory])

  const handleShowDetails = React.useCallback((item: OrderRequest | ContactMessage) => {
    setSelectedItem(item)
    setIsDetailModalOpen(true)
  }, [])

  const handleShowHistory = React.useCallback((type: "orders" | "messages") => {
    setHistoryType(type)
    loadHistory(type)
    setIsHistoryModalOpen(true)
  }, [loadHistory])

  const totalPendingOrders = ordersByStatus.pending.length
  const totalPendingMessages = messagesByStatus.pending.length
  const lowStockProducts = (Array.isArray(products) ? products : []).filter((product) => product.stock <= 3)

  const resetProductForm = React.useCallback(() => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      image: "",
      images: [] as string[],
      category: productCategories[0]?.id ?? "accessories",
      brand: productBrands[0]?.id ?? "",
      stock: "",
      available: true,
    })
  }, [productCategories, productBrands])

  const handleProductInputChange = <K extends keyof typeof productForm>(field: K, value: typeof productForm[K]) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const closeProductModal = React.useCallback(() => {
    setIsProductModalOpen(false)
    resetProductForm()
  }, [resetProductForm])

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!productForm.name || !productForm.price || !productForm.images.length) {
      addToast("Completa los campos obligatorios", "error")
      return
    }

    addProduct({
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      image: productForm.images[0] || "", // Usar la primera imagen como principal
      images: productForm.images,
      category: productForm.category,
      brand: productForm.brand,
      stock: Number(productForm.stock),
      available: productForm.available,
    })

    addToast("Producto registrado correctamente", "success")
    closeProductModal()
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

  const handleDeleteProduct = async (productId: string) => {
    console.log("handleDeleteProduct called with productId:", productId)
    
    if (!productId) {
      console.error("Product ID is undefined or empty")
      addToast("Error: ID de producto inválido", "error")
      return
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      console.log("Calling deleteProduct with ID:", productId)
      await deleteProduct(productId)
      addToast("Producto eliminado correctamente", "success")
    } catch (error) {
      console.error("Error deleting product:", error)
      addToast(`Error al eliminar producto: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    // Validate total file size (max 5MB each)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`La imagen ${file.name} es demasiado grande. Máximo 5MB por imagen.`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        alert(`El archivo ${file.name} no es una imagen válida.`)
        return false
      }
      return true
    })

    if (!validFiles.length) return

    // Process each file
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, result]
        }))
      }
      reader.onerror = () => {
        alert(`Error al leer la imagen ${file.name}. Intenta de nuevo.`)
      }
      reader.readAsDataURL(file)
    })
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
              <h1 className="text-lg font-bold text-foreground">Panel de Administración</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-3 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground-secondary hover:text-foreground border border-border"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="hidden sm:inline">Pedidos</span>
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
            className={`flex items-center gap-2 px-3 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "messages"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground-secondary hover:text-foreground border border-border"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Mensajes</span>
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
          <button
            onClick={() => handleShowHistory(activeTab)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl font-medium transition-colors bg-background text-foreground-secondary hover:text-foreground border border-border"
          >
            <History className="w-5 h-5" />
            <span className="hidden sm:inline">Historial</span>
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
                      onArchive={() => handleArchive("orders", order.id)}
                      onShowDetails={() => handleShowDetails(order)}
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
                      onArchive={() => handleArchive("orders", order.id)}
                      onShowDetails={() => handleShowDetails(order)}
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
                      onArchive={() => handleArchive("orders", order.id)}
                      onShowDetails={() => handleShowDetails(order)}
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
                      onArchive={() => handleArchive("messages", message.id)}
                      onShowDetails={() => handleShowDetails(message)}
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
                      onArchive={() => handleArchive("messages", message.id)}
                      onShowDetails={() => handleShowDetails(message)}
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
                      onArchive={() => handleArchive("messages", message.id)}
                      onShowDetails={() => handleShowDetails(message)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inventory */}
        <section className="bg-background rounded-2xl border border-border p-4 sm:p-6 mt-8">
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
            <div className="flex flex-row gap-3 flex-wrap">
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="flex-1 min-w-[60px] sm:min-w-[140px] flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg transition-shadow"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Productos</span>
              </button>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex-1 min-w-[60px] sm:min-w-[140px] flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground-secondary hover:text-primary"
              >
                <Tag className="w-4 h-4" />
                <span className="hidden sm:inline">Categorías</span>
              </button>
              <button
                onClick={() => setIsBrandModalOpen(true)}
                className="flex-1 min-w-[60px] sm:min-w-[140px] flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground-secondary hover:text-primary"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Marcas</span>
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex-1 min-w-[60px] sm:min-w-[140px] flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground-secondary hover:text-primary"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(!Array.isArray(products) || products.length === 0) ? (
              <p className="col-span-full text-center text-foreground-muted text-sm">Aún no hay productos registrados.</p>
            ) : (
              products.map((product, index) => {
                // Simple log to check if products have IDs
                if (!product.id) {
                  console.warn(`Product at index ${index} has no ID:`, product)
                }
                return (
                <div
                  key={product.id || `product-${index}`}
                  className="p-4 rounded-2xl bg-background-secondary border border-border flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-start gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-background">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 w-full">
                      <p className="font-semibold text-foreground leading-tight line-clamp-2">{product.name}</p>
                      <span className="inline-flex mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {productCategories.find((cat) => cat.id === product.category)?.label || product.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground-secondary line-clamp-3 min-h-[3.5rem]">{product.description}</p>

                    <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="min-w-[120px] flex flex-col gap-1">
                        <p className="text-xs text-foreground-muted">Precio</p>
                        <p className="text-lg font-semibold text-foreground">${product.price}</p>
                      </div>
                      <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                        <p className="text-xs text-foreground-muted">Stock</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={product.stock}
                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                            className="w-24 sm:w-28 px-3 py-2 rounded-xl bg-background border border-border text-sm"
                          />
                          <span className="text-xs text-foreground-muted">uds.</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleAvailability(product.id)}
                        className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          product.available
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                        }`}
                      >
                        {product.available ? "Disponible" : "Pausado"}
                      </button>
                      <button
                        onClick={() => {
                          if (!product.id) {
                            console.error("Product has no ID:", product)
                            addToast("Error: Producto sin ID válido", "error")
                            return
                          }
                          handleDeleteProduct(product.id)
                        }}
                        disabled={!product.id}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          !product.id 
                            ? "bg-foreground/5 text-foreground-muted cursor-not-allowed" 
                            : "bg-error/10 text-error hover:bg-error/20"
                        }`}
                        title={product.id ? "Eliminar producto" : "Producto sin ID válido"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                )
              })
            )}
          </div>
        </section>
      </main>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={closeProductModal} />
          <div className="relative z-10 w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
              <div>
                <p className="text-sm text-foreground-muted">Nuevo producto</p>
                <h3 className="text-2xl font-bold text-foreground">Registrar producto</h3>
              </div>
              <button
                onClick={closeProductModal}
                className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center hover:text-primary"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Nombre</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => handleProductInputChange("name", e.target.value)}
                      required
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-sm"
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Precio</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => handleProductInputChange("price", e.target.value)}
                      required
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Descripción</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => handleProductInputChange("description", e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-sm"
                    placeholder="Cuéntale al cliente por qué este producto es especial"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Categoría</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => handleProductInputChange("category", e.target.value)}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-sm"
                    >
                      {productCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Marca</label>
                    <select
                      value={productForm.brand}
                      onChange={(e) => handleProductInputChange("brand", e.target.value)}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-sm"
                    >
                      <option value="">Seleccionar marca</option>
                      {productBrands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Stock</label>
                    <input
                      type="number"
                      min={0}
                      value={productForm.stock}
                      onChange={(e) => handleProductInputChange("stock", e.target.value)}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Imágenes del producto</label>
                    <div className="space-y-3">
                      {productForm.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {productForm.images.map((image, index) => (
                            <div key={index} className="relative flex-shrink-0 group">
                              <div className="w-16 h-16 bg-background-secondary rounded-lg overflow-hidden border border-border">
                                <img
                                  src={image}
                                  alt={`Imagen ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductForm(prev => ({
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== index)
                                    }))
                                  }}
                                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor="product-images"
                          className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-lg bg-background-secondary hover:bg-background/50 transition-colors cursor-pointer"
                        >
                          <div className="text-center">
                            <Package className="w-6 h-6 text-foreground-muted mx-auto mb-1" />
                            <p className="text-sm text-foreground-secondary">
                              {productForm.images.length === 0
                                ? "Subir imágenes"
                                : `Agregar (${productForm.images.length}/5)`
                              }
                            </p>
                            <p className="text-xs text-foreground-muted mt-1">
                              JPG, PNG, WebP • 5MB máx.
                            </p>
                          </div>
                        </label>
                        <input
                          id="product-images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Disponibilidad</p>
                    <p className="text-xs text-foreground-muted">Controla si el producto aparece en la tienda</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleProductInputChange("available", !productForm.available)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      productForm.available ? "bg-primary/10 text-primary" : "bg-foreground/10 text-foreground"
                    }`}
                  >
                    {productForm.available ? "Activo" : "Pausado"}
                  </button>
                </div>

                <div className="flex flex-col-reverse gap-3 flex-row sm:flex-row sm:justify-end pt-4">
                  <button
                    type="button"
                    onClick={closeProductModal}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground-secondary hover:text-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestión de categorías */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl">
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div>
                <p className="text-sm text-foreground-muted">Gestión de categorías</p>
                <h3 className="text-xl font-bold text-foreground">
                  {editingCategory ? "Editar categoría" : "Agregar nueva categoría"}
                </h3>
              </div>
              <button
                onClick={closeCategoryModal}
                className="p-2 rounded-xl hover:bg-background-secondary transition-colors"
              >
                <X className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre de la categoría
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ej: Auriculares, Cargadores, etc."
                    className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Lista de categorías existentes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Categorías existentes
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {productCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-background-secondary border border-border"
                      >
                        <span className="text-sm text-foreground">{category.label}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-1.5 rounded-lg hover:bg-background transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-foreground-muted" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1.5 rounded-lg hover:bg-background transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-foreground-muted" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end p-6 border-t border-border">
              <button
                type="button"
                onClick={closeCategoryModal}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground font-medium hover:bg-background transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingCategory ? "Actualizar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestión de marcas */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl">
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div>
                <p className="text-sm text-foreground-muted">Gestión de marcas</p>
                <h3 className="text-xl font-bold text-foreground">
                  {editingBrand ? "Editar marca" : "Agregar nueva marca"}
                </h3>
              </div>
              <button
                onClick={closeBrandModal}
                className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
              >
                <X className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre de la marca
                </label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Samsung, Apple, Xiaomi..."
                />
              </div>

              {/* Lista de marcas existentes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Marcas existentes
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {productBrands.map((brand) => (
                    <div
                      key={brand.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background-secondary border border-border"
                    >
                      <span className="text-sm font-medium text-foreground">{brand.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="p-1.5 rounded hover:bg-background transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-foreground-muted" />
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand.id)}
                          className="p-1.5 rounded hover:bg-background transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {productBrands.length === 0 && (
                    <p className="text-center text-foreground-muted py-4">
                      No hay marcas registradas
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 p-6 border-t border-border">
              <button
                type="button"
                onClick={closeBrandModal}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground font-medium hover:bg-background transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={editingBrand ? handleUpdateBrand : handleAddBrand}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingBrand ? "Actualizar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
              <div>
                <p className="text-sm text-foreground-muted">
                  {"customerName" in selectedItem ? "Detalles del Pedido" : "Detalles del Mensaje"}
                </p>
                <h3 className="text-2xl font-bold text-foreground">
                  {"customerName" in selectedItem ? selectedItem.customerName : selectedItem.name}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center hover:text-primary"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {"customerName" in selectedItem ? (
                // Detalles de pedido
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Teléfono</p>
                      <p className="font-medium">{selectedItem.customerPhone}</p>
                    </div>
                    {selectedItem.customerEmail && (
                      <div>
                        <p className="text-sm text-foreground-muted mb-1">Email</p>
                        <p className="font-medium">{selectedItem.customerEmail}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Estado</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        selectedItem.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        selectedItem.status === "contacted" ? "bg-blue-100 text-blue-800" :
                        selectedItem.status === "completed" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {selectedItem.status === "pending" ? "Pendiente" :
                         selectedItem.status === "contacted" ? "Contactado" :
                         selectedItem.status === "completed" ? "Completado" :
                         "Cancelado"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Fecha</p>
                      <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString("es-ES")}</p>
                    </div>
                  </div>

                  {selectedItem.notes && (
                    <div>
                      <p className="text-sm text-foreground-muted mb-2">Notas del cliente</p>
                      <div className="p-3 rounded-lg bg-background-secondary border border-border">
                        <p className="text-sm">{selectedItem.notes}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-foreground-muted mb-2">Productos</p>
                    <div className="space-y-2">
                      {selectedItem.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-background-secondary border border-border">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-foreground-muted">Cantidad: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">${Number(item.price * item.quantity).toLocaleString("es-ES")}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">Total</p>
                        <p className="text-xl font-bold text-primary">${Number(selectedItem.total).toLocaleString("es-ES")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Detalles de mensaje
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Email</p>
                      <p className="font-medium">{selectedItem.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Teléfono</p>
                      <p className="font-medium">{selectedItem.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Servicio</p>
                      <p className="font-medium">{selectedItem.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Estado</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        selectedItem.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        selectedItem.status === "read" ? "bg-blue-100 text-blue-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {selectedItem.status === "pending" ? "Pendiente" :
                         selectedItem.status === "read" ? "Leído" :
                         "Respondido"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground-muted mb-1">Fecha</p>
                      <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString("es-ES")}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-foreground-muted mb-2">Mensaje</p>
                    <div className="p-4 rounded-lg bg-background-secondary border border-border">
                      <p className="text-sm whitespace-pre-wrap">{selectedItem.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between p-6 border-t border-border">
              <div className="flex gap-2">
                {"customerName" in selectedItem ? (
                  <>
                    <button
                      onClick={() => handleSendNotification("whatsapp", selectedItem.customerPhone, selectedItem.customerEmail, selectedItem.customerName)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 text-green-600 text-sm font-medium hover:bg-green-500/20 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      WhatsApp
                    </button>
                    {selectedItem.customerEmail && (
                      <button
                        onClick={() => handleSendNotification("email", selectedItem.customerPhone, selectedItem.customerEmail, selectedItem.customerName)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-600 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleSendNotification("whatsapp", selectedItem.phone, selectedItem.email, selectedItem.name)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 text-green-600 text-sm font-medium hover:bg-green-500/20 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleSendNotification("email", selectedItem.phone, selectedItem.email, selectedItem.name)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-600 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-background-secondary border border-border text-sm font-medium text-foreground-secondary hover:text-foreground"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de historial */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setIsHistoryModalOpen(false)} />
          <div className="relative z-10 w-full max-w-4xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
              <div>
                <p className="text-sm text-foreground-muted">Historial</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {historyType === "orders" ? "Historial de Pedidos" : "Historial de Mensajes"}
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center hover:text-primary"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="space-y-4">
                {(historyType === "orders" ? orderHistory : messageHistory).length === 0 ? (
                  <p className="text-center text-foreground-muted py-8">
                    No hay {historyType === "orders" ? "pedidos" : "mensajes"} en el historial
                  </p>
                ) : (
                  (historyType === "orders" ? orderHistory : messageHistory).map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-background-secondary border border-border">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {"customerName" in item ? item.customerName : item.name}
                          </h4>
                          <p className="text-sm text-foreground-muted mt-1">
                            {"customerName" in item ? `Total: $${Number(item.total).toLocaleString("es-ES")}` : `Servicio: ${item.service}`}
                          </p>
                          <p className="text-xs text-foreground-muted mt-2">
                            Archivado: {new Date(item.archivedAt).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`¿Estás seguro de eliminar permanentemente este ${historyType === "orders" ? "pedido" : "mensaje"}?`)) {
                              // Aquí podrías agregar la lógica para eliminar permanentemente
                              console.log("Eliminar permanentemente:", item.id)
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 text-xs font-medium hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-between p-6 border-t border-border">
              <button
                onClick={() => handleShowHistory(historyType)}
                className="px-4 py-3 rounded-xl bg-background-secondary border border-border text-sm font-medium text-foreground-secondary hover:text-foreground"
              >
                Actualizar
              </button>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
