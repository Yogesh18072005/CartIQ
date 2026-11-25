'use client'

import { useAuth } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Loading from "@/components/Loading"
import Image from "next/image"
import { assets } from "@/assets/assets"

export default function StoreManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹"
    const { getToken, isLoaded, isSignedIn } = useAuth()
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [error, setError] = useState("")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const fetchProducts = useCallback(async (signal) => {
        const token = await getToken()
        const response = await fetch(`${apiBaseUrl}/api/products/mine`, {
            signal,
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Unable to load products.")
        setProducts((result.data || []).map(product => ({ ...product, id: product._id || product.id })))
    }, [apiBaseUrl, getToken])

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            setLoading(false)
            return
        }
        const controller = new AbortController()
        fetchProducts(controller.signal)
            .catch(error => { if (error.name !== "AbortError") setError(error.message) })
            .finally(() => { if (!controller.signal.aborted) setLoading(false) })
        return () => controller.abort()
    }, [isLoaded, isSignedIn, fetchProducts])

    const toggleStock = async product => {
        const token = await getToken()
        const response = await fetch(`${apiBaseUrl}/api/products/${product.id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ inStock: !product.inStock })
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Stock status could not be updated.")
        setProducts(current => current.map(item => item.id === product.id ? { ...item, inStock: result.data.inStock } : item))
        toast.success("Stock status updated.")
    }

    if (!isLoaded || loading) return <Loading />

    return (
        <div className="mb-28">
            <h1 className="mb-5 text-2xl text-slate-500">Manage <span className="font-medium text-slate-800">Products</span></h1>
            {!isSignedIn && <p className="text-slate-500">Sign in to manage your store products.</p>}
            {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
            {isSignedIn && !error && products.length === 0 && <p className="text-slate-500">No products found for your store.</p>}
            {products.length > 0 && (
                <div className="overflow-x-auto rounded ring ring-slate-200">
                    <table className="w-full max-w-5xl text-left text-sm">
                        <thead className="bg-slate-50 uppercase tracking-wider text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="hidden px-4 py-3 md:table-cell">MRP</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">In stock</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {products.map(product => (
                                <tr key={product.id} className="border-t border-gray-200">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Image width={40} height={40} className="rounded p-1 shadow" src={product.images?.[0] || assets.product_img1} alt={product.name} />
                                            <span>{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-3 md:table-cell">{currency}{product.mrp.toLocaleString()}</td>
                                    <td className="px-4 py-3">{currency}{product.price.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={product.inStock} onChange={() => toast.promise(toggleStock(product), { loading: "Updating stock…" })} aria-label={`Toggle stock for ${product.name}`} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
