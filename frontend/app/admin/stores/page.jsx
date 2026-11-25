'use client'
import { useAuth } from "@clerk/nextjs"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminStores() {
    const { getToken, isLoaded, isSignedIn } = useAuth()
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const fetchStores = useCallback(async signal => {
        const token = await getToken()
        const response = await fetch(`${apiBaseUrl}/api/admin/stores?status=approved`, {
            signal,
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Unable to load approved stores.")
        setStores(result.data || [])
    }, [apiBaseUrl, getToken])

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            setLoading(false)
            return
        }
        const controller = new AbortController()
        fetchStores(controller.signal)
            .catch(loadError => { if (loadError.name !== "AbortError") setError(loadError.message) })
            .finally(() => { if (!controller.signal.aborted) setLoading(false) })
        return () => controller.abort()
    }, [isLoaded, isSignedIn, fetchStores])

    const toggleIsActive = async store => {
        const token = await getToken()
        const response = await fetch(`${apiBaseUrl}/api/admin/stores/${store._id}/active`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ isActive: !store.isActive })
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Store status could not be changed.")
        setStores(current => current.map(item => item._id === store._id ? result.data : item))
        toast.success("Store status updated.")
    }

    if (!isLoaded || loading) return <Loading />

    return (
        <div className="mb-28 text-slate-500">
            <h1 className="text-2xl">Approved <span className="font-medium text-slate-800">Stores</span></h1>
            {!isSignedIn && <p className="mt-4">Sign in with an administrator account.</p>}
            {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
            {isSignedIn && !error && stores.length === 0 && <p className="mt-8">No approved stores found.</p>}
            <div className="mt-4 flex max-w-4xl flex-col gap-4">
                {stores.map(store => (
                    <div key={store._id} className="flex max-w-4xl flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 md:flex-row md:items-end">
                        <StoreInfo store={store} />
                        <label className="flex items-center gap-3 text-sm">
                            Active
                            <input type="checkbox" checked={store.isActive} onChange={() => toast.promise(toggleIsActive(store), { loading: "Updating…" })} />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}
