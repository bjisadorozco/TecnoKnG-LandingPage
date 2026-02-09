"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore'
import { firestoreDb } from '@/lib/firebase-client'

interface Brand {
  id: string
  name: string
  createdAt: Date
}

interface BrandsContextType {
  brands: Brand[]
  loading: boolean
  addBrand: (name: string) => Promise<void>
  updateBrand: (id: string, name: string) => Promise<void>
  deleteBrand: (id: string) => Promise<void>
  refreshBrands: () => Promise<void>
}

const BrandsContext = createContext<BrandsContextType | undefined>(undefined)

export function BrandsProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBrands = async () => {
    try {
      console.log('Fetching brands from Firestore...')
      const brandsQuery = query(collection(firestoreDb, 'brands'), orderBy('createdAt', 'asc'))
      const querySnapshot = await getDocs(brandsQuery)
      
      const brandsData: Brand[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        brandsData.push({
          id: doc.id,
          name: data.name,
          createdAt: data.createdAt?.toDate() || new Date()
        })
      })
      
      console.log('Brands fetched:', brandsData)
      setBrands(brandsData)
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const addBrand = async (name: string) => {
    try {
      console.log('Adding brand:', name)
      
      // Verificar si ya existe una marca con ese nombre
      const existingBrand = brands.find(brand => 
        brand.name.toLowerCase() === name.toLowerCase().trim()
      )
      
      if (existingBrand) {
        throw new Error('Ya existe una marca con ese nombre')
      }

      const brandData = {
        name: name.trim(),
        createdAt: new Date()
      }

      const docRef = await addDoc(collection(firestoreDb, 'brands'), brandData)
      console.log('Brand added with ID:', docRef.id)
      
      await fetchBrands()
    } catch (error) {
      console.error('Error adding brand:', error)
      throw error
    }
  }

  const updateBrand = async (id: string, name: string) => {
    try {
      console.log('Updating brand:', id, name)
      
      // Verificar si ya existe otra marca con ese nombre
      const existingBrand = brands.find(brand => 
        brand.id !== id && brand.name.toLowerCase() === name.toLowerCase().trim()
      )
      
      if (existingBrand) {
        throw new Error('Ya existe otra marca con ese nombre')
      }

      const brandRef = doc(firestoreDb, 'brands', id)
      await updateDoc(brandRef, {
        name: name.trim()
      })
      
      console.log('Brand updated successfully')
      await fetchBrands()
    } catch (error) {
      console.error('Error updating brand:', error)
      throw error
    }
  }

  const deleteBrand = async (id: string) => {
    try {
      console.log('Deleting brand:', id)
      
      const brandRef = doc(firestoreDb, 'brands', id)
      await deleteDoc(brandRef)
      
      console.log('Brand deleted successfully')
      await fetchBrands()
    } catch (error) {
      console.error('Error deleting brand:', error)
      throw error
    }
  }

  const refreshBrands = async () => {
    setLoading(true)
    await fetchBrands()
  }

  const value = {
    brands,
    loading,
    addBrand,
    updateBrand,
    deleteBrand,
    refreshBrands
  }

  return (
    <BrandsContext.Provider value={value}>
      {children}
    </BrandsContext.Provider>
  )
}

export function useBrands() {
  const context = useContext(BrandsContext)
  if (context === undefined) {
    throw new Error('useBrands must be used within a BrandsProvider')
  }
  return context
}
