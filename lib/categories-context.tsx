"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy 
} from 'firebase/firestore'
import { firestoreDb } from '@/lib/firebase-client'

interface Category {
  id: string
  label: string
  createdAt: string
  updatedAt: string
}

interface CategoriesContextType {
  categories: Category[]
  loading: boolean
  addCategory: (label: string) => Promise<void>
  updateCategory: (id: string, label: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  refreshCategories: () => Promise<void>
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refreshCategories = async () => {
    try {
      setLoading(true)
      const categoriesRef = collection(firestoreDb, 'categories')
      const q = query(categoriesRef, orderBy('createdAt', 'asc'))
      const querySnapshot = await getDocs(q)
      
      const categoriesData: Category[] = []
      querySnapshot.forEach((doc) => {
        categoriesData.push({
          id: doc.id,
          ...doc.data()
        } as Category)
      })
      
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async (label: string) => {
    try {
      const categoryId = label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")

      const categoryRef = doc(firestoreDb, 'categories', categoryId)
      const categoryDoc = await getDoc(categoryRef)
      
      if (categoryDoc.exists()) {
        throw new Error('Esta categoría ya existe')
      }

      const newCategory: Category = {
        id: categoryId,
        label,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await setDoc(categoryRef, newCategory)
      await refreshCategories()
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  }

  const updateCategory = async (id: string, label: string) => {
    try {
      const categoryRef = doc(firestoreDb, 'categories', id)
      
      await updateDoc(categoryRef, {
        label,
        updatedAt: new Date().toISOString()
      })
      
      await refreshCategories()
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const categoryRef = doc(firestoreDb, 'categories', id)
      await deleteDoc(categoryRef)
      await refreshCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  useEffect(() => {
    refreshCategories()
  }, [])

  const value = {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories
  }

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (context === undefined) {
    throw new Error('useCategories debe ser usado dentro de un CategoriesProvider')
  }
  return context
}
