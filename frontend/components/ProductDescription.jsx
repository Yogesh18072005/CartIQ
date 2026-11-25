'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { assets } from "@/assets/assets"

const ProductDescription = ({ product }) => {
    const [selectedTab, setSelectedTab] = useState('Description')
    const ratings = Array.isArray(product.rating) ? product.rating : []
    const store = product.store || {}

    return (
        <div className="my-18 text-sm text-slate-600">
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
                {['Description', 'Reviews'].map(tab => (
                    <button className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold' : 'text-slate-400'} px-3 py-2 font-medium`} key={tab} onClick={() => setSelectedTab(tab)}>
                        {tab}
                    </button>
                ))}
            </div>

            {selectedTab === "Description" && <p className="max-w-xl">{product.description}</p>}

            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-3 mt-14">
                    {ratings.length ? ratings.map((item, index) => (
                        <div key={item._id || index} className="flex gap-5 mb-10">
                            <Image src={item.user?.image || assets.profile_pic1} alt="" className="size-10 rounded-full" width={100} height={100} />
                            <div>
                                <div className="flex items-center">
                                    {Array(5).fill('').map((_, star) => <StarIcon key={star} size={18} className="text-transparent mt-0.5" fill={item.rating >= star + 1 ? "#00C950" : "#D1D5DB"} />)}
                                </div>
                                <p className="text-sm max-w-lg my-4">{item.review}</p>
                                <p className="font-medium text-slate-800">{item.user?.name || "Verified customer"}</p>
                                <p className="mt-3 font-light">{item.createdAt ? new Date(item.createdAt).toDateString() : ""}</p>
                            </div>
                        </div>
                    )) : <p>No reviews yet.</p>}
                </div>
            )}

            {store.username && (
                <div className="flex gap-3 mt-14">
                    <Image src={store.logoUrl || store.logo || assets.gs_logo} alt={store.name || "Store"} className="size-11 rounded-full ring ring-slate-400 object-cover" width={100} height={100} />
                    <div>
                        <p className="font-medium text-slate-600">Product by {store.name || "CartIQ seller"}</p>
                        <Link href={`/shop/${store.username}`} className="flex items-center gap-1.5 text-green-500">View store <ArrowRight size={14} /></Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDescription
