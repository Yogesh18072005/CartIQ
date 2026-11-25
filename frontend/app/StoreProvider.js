'use client'

import { useEffect, useRef } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { makeStore } from '../lib/store'
import { setProduct } from '@/lib/features/product/productSlice'

function ProductBootstrap() {
  const dispatch = useDispatch()

  useEffect(() => {
    const controller = new AbortController()
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    async function loadProducts() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/products?limit=50`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        })

        if (!response.ok) {
          throw new Error(`Products API returned ${response.status}`)
        }

        const result = await response.json()
        const products = Array.isArray(result.data)
          ? result.data.map((product) => ({
              ...product,
              id: product._id || product.id,
              storeId: product.store?._id || product.store
            }))
          : []

        dispatch(setProduct(products))
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Unable to load products from CartIQ API:', error)
          dispatch(setProduct([]))
        }
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [dispatch])

  return null
}

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <ProductBootstrap />
      {children}
    </Provider>
  )
}
