'use client'

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "react-hot-toast"

const categories = [
    "Fruits", "Dairy", "Bakery", "Beverages", "Snacks",
    "Grocery", "Personal Care", "Household", "Stationery", "Others"
]

export default function StoreAddProduct() {
    const { getToken } = useAuth()
    const [productInfo, setProductInfo] = useState({
        name: "", description: "", mrp: "", price: "", category: "", imageUrls: ""
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = event => {
        setProductInfo(current => ({ ...current, [event.target.name]: event.target.value }))
    }

    const onSubmitHandler = async event => {
        event.preventDefault()
        setLoading(true)
        try {
            const token = await getToken()
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            const images = productInfo.imageUrls.split(",").map(url => url.trim()).filter(Boolean)
            const response = await fetch(`${apiBaseUrl}/api/products`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    name: productInfo.name,
                    description: productInfo.description,
                    mrp: Number(productInfo.mrp),
                    price: Number(productInfo.price),
                    category: productInfo.category,
                    images,
                    inStock: true
                })
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.message || "Product could not be added.")
            toast.success("Product added successfully.")
            setProductInfo({ name: "", description: "", mrp: "", price: "", category: "", imageUrls: "" })
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="mb-28 max-w-2xl text-slate-600">
            <h1 className="text-2xl">Add new <span className="font-medium text-slate-800">product</span></h1>
            <p className="mt-2 text-sm text-slate-500">Products can be published after your store has been approved.</p>

            <label className="my-5 grid gap-2 text-sm">Product name
                <input required minLength={2} maxLength={160} name="name" value={productInfo.name} onChange={onChangeHandler} className="rounded border border-slate-200 p-3" />
            </label>
            <label className="my-5 grid gap-2 text-sm">Description
                <textarea required minLength={5} maxLength={5000} rows={4} name="description" value={productInfo.description} onChange={onChangeHandler} className="resize-y rounded border border-slate-200 p-3" />
            </label>
            <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm">MRP
                    <input required type="number" min="0" step="0.01" name="mrp" value={productInfo.mrp} onChange={onChangeHandler} className="rounded border border-slate-200 p-3" />
                </label>
                <label className="grid gap-2 text-sm">Selling price
                    <input required type="number" min="0" step="0.01" name="price" value={productInfo.price} onChange={onChangeHandler} className="rounded border border-slate-200 p-3" />
                </label>
            </div>
            <label className="my-5 grid gap-2 text-sm">Category
                <select required name="category" value={productInfo.category} onChange={onChangeHandler} className="rounded border border-slate-200 p-3">
                    <option value="">Choose category</option>
                    {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
            </label>
            <label className="my-5 grid gap-2 text-sm">Product image URLs (comma-separated, optional)
                <textarea name="imageUrls" rows={2} value={productInfo.imageUrls} onChange={onChangeHandler} placeholder="https://example.com/product.jpg" className="rounded border border-slate-200 p-3" />
            </label>
            <button disabled={loading} className="mt-4 rounded bg-slate-800 px-8 py-3 text-white disabled:opacity-60">
                {loading ? "Adding product…" : "Add product"}
            </button>
        </form>
    )
}
