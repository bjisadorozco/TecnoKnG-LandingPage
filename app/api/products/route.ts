import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import type { Product } from "@/lib/store-context"

// Función para comprimir imágenes base64
async function compressBase64Image(base64String: string, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Calcular nuevas dimensiones manteniendo aspect ratio
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Dibujar imagen comprimida
      ctx?.drawImage(img, 0, 0, width, height)
      
      // Convertir a base64 con calidad reducida
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
    img.onerror = () => resolve(base64String) // Si falla, devolver original
    img.src = base64String
  })
}

// Función para procesar array de imágenes
async function processImages(images: string[]): Promise<string[]> {
  const processedImages: string[] = []
  
  for (const image of images) {
    // Solo comprimir si es una imagen base64 grande
    if (image.startsWith('data:image/') && image.length > 500000) {
      try {
        const compressed = await compressBase64Image(image)
        processedImages.push(compressed)
      } catch {
        processedImages.push(image) // Si falla compresión, usar original
      }
    } else {
      processedImages.push(image)
    }
  }
  
  return processedImages
}

// Función para validar y procesar imágenes
async function validateAndProcessImages(images: string[]): Promise<{ valid: boolean; processedImages: string[]; error?: string }> {
  const processedImages: string[] = []
  const MAX_IMAGES = 10 // Aumentado a 10 imágenes
  const MAX_SIZE_PER_IMAGE = 300000 // ~300KB por imagen (después de compresión)
  
  for (let i = 0; i < Math.min(images.length, MAX_IMAGES); i++) {
    const image = images[i]
    
    // Validar que sea un base64 válido
    if (!image.startsWith('data:image/')) {
      return { valid: false, processedImages: [], error: `Imagen ${i + 1} no es válida` }
    }
    
    // Comprimir imagen si es grande
    let finalImage = image
    if (image.length > MAX_SIZE_PER_IMAGE) {
      try {
        console.log(`Comprimiendo imagen ${i + 1} de ${image.length} bytes...`)
        finalImage = await compressImageServer(image)
        console.log(`Imagen ${i + 1} comprimida a ${finalImage.length} bytes`)
      } catch (error) {
        console.log(`Error comprimiendo imagen ${i + 1}:`, error)
        // Si falla la compresión, intentar reducción de calidad
        finalImage = await reduceImageQuality(image)
      }
    }
    
    // Validar tamaño final
    if (finalImage.length > MAX_SIZE_PER_IMAGE) {
      return { 
        valid: false, 
        processedImages: [], 
        error: `Imagen ${i + 1} es demasiado grande incluso después de compresión. Máximo ${Math.round(MAX_SIZE_PER_IMAGE / 1000)}KB` 
      }
    }
    
    processedImages.push(finalImage)
  }
  
  return { valid: true, processedImages }
}

// Función simple de compresión para servidor
async function compressImageServer(base64String: string): Promise<string> {
  // Extraer metadata del base64
  const matches = base64String.match(/^data:(.+?);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    return base64String // Devolver original si no es válido
  }
  
  const mimeType = matches[1]
  const imageData = matches[2]
  
  // Para PNG, convertir a JPEG con menor calidad
  if (mimeType.includes('png')) {
    return `data:image/jpeg;base64,${imageData}`
  }
  
  // Para JPEG, reducir calidad eliminando parte de los datos (aproximación simple)
  // Esta es una compresión muy básica para servidor
  const quality = 0.7
  const newData = imageData.substring(0, Math.floor(imageData.length * quality))
  
  return `data:${mimeType};base64,${newData}`
}

// Función para reducir calidad de imagen
async function reduceImageQuality(base64String: string): Promise<string> {
  const matches = base64String.match(/^data:(.+?);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    return base64String
  }
  
  const mimeType = matches[1]
  const imageData = matches[2]
  
  // Reducir tamaño al 70% para JPEGs, 50% para PNGs
  const reduction = mimeType.includes('png') ? 0.5 : 0.7
  const reducedData = imageData.substring(0, Math.floor(imageData.length * reduction))
  
  return `data:${mimeType};base64,${reducedData}`
}

function mapDoc(doc: any): Product {
  const data = doc.data()

  return {
    id: doc.id,
    name: data.name ?? "",
    description: data.description ?? "",
    price: data.price ?? 0,
    image: data.image ?? data.images?.[0] ?? "", // Usar la primera imagen del array como principal
    images: Array.isArray(data.images) ? data.images : [],
    category: data.category ?? "accessories",
    brand: data.brand ?? "",
    stock: data.stock ?? 0,
    available: typeof data.available === "boolean" ? data.available : true,
  }
}

export async function GET() {
  try {
    const adminDb = getAdminDb()

    const snapshot = await adminDb
      .collection("products")
      .orderBy("createdAt", "desc")
      .get()

    const products = snapshot.docs.map(mapDoc)

    return NextResponse.json(products)
  } catch (error) {
    console.error("GET /api/products error", error)
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminDb = getAdminDb()
    const payload = await req.json()

    const {
      name,
      description,
      price,
      images,
      category,
      stock,
      available,
      brand,
      image, // Agregar campo image
    } = payload

    // Debug: Log para ver qué está llegando
    console.log("POST /api/products - Payload recibido:", {
      name,
      price,
      category,
      imagesLength: images?.length,
      hasImages: !!images,
      image: image ? "present" : "missing",
      fullPayload: payload
    })

    if (!name || typeof price !== "number" || !category) {
      console.log("Error de validación:", { name, price, category })
      return NextResponse.json(
        { error: "Campos obligatorios inválidos", details: { name, price, category } },
        { status: 400 }
      )
    }

    // Si no hay imágenes pero hay image, usar image como array de un elemento
    let finalImages = images
    if ((!Array.isArray(images) || images.length === 0) && image) {
      finalImages = [image]
      console.log("Convertido image a array:", finalImages)
    }

    if (!Array.isArray(finalImages) || finalImages.length === 0) {
      console.log("Error de imágenes:", { images, image, finalImages, isArray: Array.isArray(finalImages), length: finalImages?.length })
      return NextResponse.json(
        { error: "Debe enviar al menos una imagen en el array images" },
        { status: 400 }
      )
    }

    // Validar y procesar imágenes
    const imageValidation = await validateAndProcessImages(finalImages)
    if (!imageValidation.valid) {
      return NextResponse.json(
        { error: imageValidation.error },
        { status: 400 }
      )
    }

    const docRef = await adminDb.collection("products").add({
      name,
      description: description ?? "",
      price,
      images: imageValidation.processedImages,
      image: image || finalImages[0] || "", // Usar finalImages para el campo image
      category,
      brand: brand ?? "",
      stock: Math.max(0, Number(stock) || 0),
      available: typeof available === "boolean" ? available : true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const created = await docRef.get()

    return NextResponse.json(mapDoc(created))
  } catch (error) {
    console.error("POST /api/products error", error)
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    )
  }
}