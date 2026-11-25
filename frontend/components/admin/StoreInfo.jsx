'use client'
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"
import { assets } from "@/assets/assets"

const StoreInfo = ({ store }) => {
    const logo = store.logoUrl || store.logo || assets.gs_logo

    return (
        <div className="flex-1 space-y-2 text-sm">
            <Image width={100} height={100} src={logo} alt={store.name} className="max-w-20 max-h-20 rounded-full object-contain shadow max-sm:mx-auto" />
            <div className="flex flex-col items-center gap-3 sm:flex-row">
                <h3 className="text-xl font-semibold text-slate-800">{store.name}</h3>
                <span className="text-sm">@{store.username}</span>
                <span className={`rounded-full px-4 py-1 text-xs font-semibold ${store.status === "pending" ? "bg-yellow-100 text-yellow-800" : store.status === "rejected" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {store.status}
                </span>
            </div>
            <p className="my-5 max-w-2xl text-slate-600">{store.description}</p>
            <p className="flex items-center gap-2"><MapPin size={16} />{store.address}</p>
            <p className="flex items-center gap-2"><Phone size={16} />{store.contact}</p>
            <p className="flex items-center gap-2"><Mail size={16} />{store.email}</p>
            <p className="mt-5 text-slate-700">Applied on <span className="text-xs">{new Date(store.createdAt).toLocaleDateString()}</span></p>
            <p className="text-xs text-slate-400">Owner ID: {store.ownerId}</p>
        </div>
    )
}

export default StoreInfo
