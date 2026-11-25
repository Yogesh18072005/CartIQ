'use client'
import { XIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"

const initialAddress = {
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: ""
}

const AddressModal = ({ setShowAddressModal, onAddressSaved }) => {
    const { getToken } = useAuth()
    const [address, setAddress] = useState(initialAddress)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    const handleAddressChange = (event) => {
        setAddress(current => ({ ...current, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaving(true)
        setError("")

        try {
            const token = await getToken()
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            const response = await fetch(`${apiBaseUrl}/api/addresses`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(address)
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.message || "Unable to save address.")
            onAddressSaved?.(result.data)
            toast.success("Address saved.")
            setShowAddressModal(false)
        } catch (submitError) {
            setError(submitError.message)
            toast.error(submitError.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="relative flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl bg-white p-6 text-slate-700 shadow-xl">
                <button type="button" aria-label="Close address form" className="absolute right-4 top-4 text-slate-500" onClick={() => setShowAddressModal(false)}>
                    <XIcon size={24} />
                </button>
                <h2 className="text-2xl">Add delivery address</h2>
                {error && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
                <input name="name" value={address.name} onChange={handleAddressChange} className="w-full rounded border border-slate-200 p-3" type="text" placeholder="Full name" required maxLength={100} />
                <input name="email" value={address.email} onChange={handleAddressChange} className="w-full rounded border border-slate-200 p-3" type="email" placeholder="Email address" required />
                <input name="street" value={address.street} onChange={handleAddressChange} className="w-full rounded border border-slate-200 p-3" type="text" placeholder="Street address" required />
                <div className="grid grid-cols-2 gap-3">
                    <input name="city" value={address.city} onChange={handleAddressChange} className="w-full rounded border border-slate-200 p-3" placeholder="City" required />
                    <input name="state" value={address.state} onChange={handleAddressChange} className="w-full rounded border border-slate-200 p-3" placeholder="State" required />
                    <input name="zip" value={address.zip} onChange={handleAddressChange} className="w-full rounded border border-slate-200 p-3" placeholder="Postal code" required />
                    <input name="country" value={address.country} onChange={handleAddressChange} className="w-full rounded border border-slate-200 p-3" placeholder="Country" required />
                </div>
                <input name="phone" value={address.phone} onChange={handleAddressChange} className="w-full rounded border border-slate-200 p-3" type="tel" placeholder="Phone number" required />
                <button disabled={saving} className="rounded bg-slate-800 py-3 text-sm font-medium text-white disabled:opacity-60">
                    {saving ? "Saving..." : "Save address"}
                </button>
            </form>
        </div>
    )
}

export default AddressModal
