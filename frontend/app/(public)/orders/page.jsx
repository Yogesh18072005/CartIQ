'use client'
import PageTitle from "@/components/PageTitle"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import OrderItem from "@/components/OrderItem"
import Loading from "@/components/Loading"

export default function Orders() {
    const { getToken, isLoaded, isSignedIn } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            setLoading(false)
            return
        }

        const controller = new AbortController()
        async function loadOrders() {
            try {
                const token = await getToken()
                const response = await fetch(`${apiBaseUrl}/api/orders`, {
                    signal: controller.signal,
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
                })
                const result = await response.json()
                if (!response.ok) throw new Error(result.message || "Unable to load your orders.")
                setOrders((result.data || []).map(order => ({
                    ...order,
                    id: order._id,
                    orderItems: order.items.map(item => ({
                        ...item,
                        price: item.unitPrice,
                        product: {
                            id: item.product,
                            name: item.name,
                            images: item.image ? [item.image] : []
                        }
                    }))
                })))
            } catch (loadError) {
                if (loadError.name !== "AbortError") setError(loadError.message)
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }
        loadOrders()
        return () => controller.abort()
    }, [isLoaded, isSignedIn, getToken, apiBaseUrl])

    if (!isLoaded || loading) return <Loading />

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="my-16 max-w-7xl mx-auto">
                <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText="Go to home" />
                {!isSignedIn && <p className="text-slate-500">Please sign in to view your orders.</p>}
                {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
                {isSignedIn && !error && orders.length === 0 && <p className="py-16 text-center text-slate-500">You have no orders yet.</p>}
                {orders.length > 0 && (
                    <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-8 border-spacing-x-4">
                        <thead>
                            <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                <th className="text-left">Product</th>
                                <th className="text-center">Total Price</th>
                                <th className="text-left">Address</th>
                                <th className="text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>{orders.map(order => <OrderItem order={order} key={order.id} />)}</tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
