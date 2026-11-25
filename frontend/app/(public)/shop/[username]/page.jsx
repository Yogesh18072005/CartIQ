'use client'
import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"
import { assets } from "@/assets/assets"

export default function StoreShop() {
    const { username } = useParams()
    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const controller = new AbortController()
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

        async function fetchStoreData() {
            try {
                const response = await fetch(`${apiBaseUrl}/api/stores/${encodeURIComponent(username)}`, {
                    signal: controller.signal,
                    headers: { Accept: "application/json" }
                })
                const result = await response.json()
                if (!response.ok) throw new Error(result.message || "Unable to load this store.")

                const store = result.data.store
                setStoreInfo({
                    ...store,
                    logo: store.logoUrl || assets.gs_logo
                })
                setProducts((result.data.products || []).map(product => ({
                    ...product,
                    id: product._id || product.id,
                    storeId: product.store
                })))
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") setError(fetchError.message)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        fetchStoreData()
        return () => controller.abort()
    }, [username])

    if (loading) return <Loading />

    return (
        <div className="min-h-[70vh] mx-6">
            {storeInfo && (
                <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
                    <Image src={storeInfo.logo} alt={storeInfo.name} className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md" width={200} height={200} />
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-semibold text-slate-800">{storeInfo.name}</h1>
                        <p className="text-sm text-slate-600 mt-2 max-w-lg">{storeInfo.description}</p>
                        <div className="space-y-2 text-sm text-slate-500 mt-4">
                            <div className="flex items-center"><MapPinIcon className="w-4 h-4 text-gray-500 mr-2" /><span>{storeInfo.address}</span></div>
                            <div className="flex items-center"><MailIcon className="w-4 h-4 text-gray-500 mr-2" /><span>{storeInfo.email}</span></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto mb-40">
                <h1 className="text-2xl mt-12">Shop <span className="text-slate-800 font-medium">Products</span></h1>
                {error ? <p role="alert" className="mt-5 text-red-600">{error}</p> : products.length ? (
                    <div className="mt-5 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
                        {products.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : <p className="mt-5 text-slate-500">This store has no products available yet.</p>}
            </div>
        </div>
    )
}
