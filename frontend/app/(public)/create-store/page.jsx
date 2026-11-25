'use client'

import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"

const initialStoreInfo = {
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    logoUrl: ""
}

export default function CreateStore() {
    const { getToken, isLoaded, isSignedIn } = useAuth()
    const [storeInfo, setStoreInfo] = useState(initialStoreInfo)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [existingStore, setExistingStore] = useState(null)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            setLoading(false)
            return
        }

        const controller = new AbortController()

        async function loadStoreStatus() {
            try {
                const token = await getToken()
                const response = await fetch(`${apiBaseUrl}/api/stores/me`, {
                    signal: controller.signal,
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
                })
                const result = await response.json()
                if (!response.ok) throw new Error(result.message || "Unable to check your store status.")
                setExistingStore(result.data)
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") setError(fetchError.message)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        loadStoreStatus()
        return () => controller.abort()
    }, [isLoaded, isSignedIn, getToken, apiBaseUrl])

    const onChangeHandler = (event) => {
        setStoreInfo(current => ({ ...current, [event.target.name]: event.target.value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setError("")
        setSuccess("")
        setSubmitting(true)

        try {
            const token = await getToken()
            const response = await fetch(`${apiBaseUrl}/api/stores`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(storeInfo)
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.message || "Store application could not be submitted.")
            setExistingStore(result.data)
            setSuccess("Your store application has been submitted and is waiting for administrator review.")
        } catch (submitError) {
            setError(submitError.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (!isLoaded || loading) return <Loading />

    if (!isSignedIn) {
        return <div className="min-h-[60vh] flex items-center justify-center px-6"><p className="text-slate-600">Please sign in before applying to create a store.</p></div>
    }

    return (
        <div className="mx-6 min-h-[70vh] my-16">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl text-slate-800">Create your store</h1>
                <p className="max-w-xl text-slate-500 mt-2">Submit your store details. A store must be approved before it can publish products.</p>

                {error && <p role="alert" className="mt-5 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                {success && <p role="status" className="mt-5 rounded bg-green-50 p-3 text-sm text-green-700">{success}</p>}

                {existingStore ? (
                    <div className="mt-8 max-w-xl rounded-xl border border-slate-200 p-6">
                        <h2 className="text-xl font-semibold text-slate-800">{existingStore.name}</h2>
                        <p className="mt-2 text-sm text-slate-500">Store: @{existingStore.username}</p>
                        <p className="mt-2 text-sm text-slate-500">Application status: <span className="font-semibold capitalize">{existingStore.status}</span></p>
                        <p className="mt-4 text-sm text-slate-500">{existingStore.status === "approved" ? "Your store is approved." : "You can publish products after administrator approval."}</p>
                    </div>
                ) : (
                    <form onSubmit={onSubmitHandler} className="mt-8 grid max-w-2xl gap-4">
                        <label className="grid gap-1 text-sm text-slate-600">Store name
                            <input required minLength={2} maxLength={100} name="name" value={storeInfo.name} onChange={onChangeHandler} className="rounded border border-slate-300 p-3" />
                        </label>
                        <label className="grid gap-1 text-sm text-slate-600">Store username
                            <input required pattern="[a-z0-9-]{3,30}" name="username" value={storeInfo.username} onChange={onChangeHandler} placeholder="your-store-name" className="rounded border border-slate-300 p-3" />
                        </label>
                        <label className="grid gap-1 text-sm text-slate-600">Description
                            <textarea name="description" maxLength={1000} rows={3} value={storeInfo.description} onChange={onChangeHandler} className="rounded border border-slate-300 p-3" />
                        </label>
                        <label className="grid gap-1 text-sm text-slate-600">Contact email
                            <input required type="email" name="email" value={storeInfo.email} onChange={onChangeHandler} className="rounded border border-slate-300 p-3" />
                        </label>
                        <label className="grid gap-1 text-sm text-slate-600">Contact number
                            <input required name="contact" value={storeInfo.contact} onChange={onChangeHandler} className="rounded border border-slate-300 p-3" />
                        </label>
                        <label className="grid gap-1 text-sm text-slate-600">Store address
                            <textarea required name="address" rows={2} value={storeInfo.address} onChange={onChangeHandler} className="rounded border border-slate-300 p-3" />
                        </label>
                        <label className="grid gap-1 text-sm text-slate-600">Store logo URL (optional)
                            <input type="url" name="logoUrl" value={storeInfo.logoUrl} onChange={onChangeHandler} placeholder="https://example.com/logo.png" className="rounded border border-slate-300 p-3" />
                        </label>
                        <button disabled={submitting} className="mt-3 w-fit rounded bg-slate-800 px-8 py-3 text-white disabled:opacity-60">
                            {submitting ? "Submitting..." : "Submit store application"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
