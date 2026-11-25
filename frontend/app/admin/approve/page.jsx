'use client'
import { useAuth } from "@clerk/nextjs"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {
    const { getToken, isLoaded, isSignedIn } = useAuth()
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const fetchStores = useCallback(async signal => {
        const token = await getToken()
        const response = await fetch(`${apiBaseUrl}/api/admin/stores?status=pending`, {
            signal,
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Unable to load pending stores.")
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

    const handleApprove = async (storeId, status) => {
        const token = await getToken()
        const response = await fetch(`${apiBaseUrl}/api/admin/stores/${storeId}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ status })
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Store review failed.")
        setStores(current => current.filter(store => store._id !== storeId))
        toast.success(`Store ${status}.`)
    }

    if (!isLoaded || loading) return <Loading />

    return (
        <div className="mb-28 text-slate-500">
            <h1 className="text-2xl">Review <span className="font-medium text-slate-800">Store Applications</span></h1>
            {!isSignedIn && <p className="mt-4">Sign in with an administrator account.</p>}
            {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
            {isSignedIn && !error && stores.length === 0 && <p className="mt-8">No applications pending review.</p>}
            <div className="mt-4 flex max-w-4xl flex-col gap-4">
                {stores.map(store => (
                    <div key={store._id} className="flex max-w-4xl flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 md:flex-row md:items-end">
                        <StoreInfo store={store} />
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => toast.promise(handleApprove(store._id, "approved"), { loading: "Approving…" })} className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Approve</button>
                            <button onClick={() => toast.promise(handleApprove(store._id, "rejected"), { loading: "Rejecting…" })} className="rounded bg-slate-600 px-4 py-2 text-sm text-white hover:bg-slate-700">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
