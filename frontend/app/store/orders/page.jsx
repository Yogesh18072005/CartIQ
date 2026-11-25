'use client'

import { useAuth } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { toast } from "react-hot-toast"

export default function StoreOrders() {
    const { getToken, isLoaded, isSignedIn } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    const fetchOrders = useCallback(async signal => {
        const token = await getToken()
        const response = await fetch(`${apiBaseUrl}/api/orders/store`, {
            signal,
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Unable to load store orders.")
        setOrders(result.data || [])
    }, [apiBaseUrl, getToken])

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            setLoading(false)
            return
        }
        const controller = new AbortController()
        fetchOrders(controller.signal)
            .catch(loadError => { if (loadError.name !== "AbortError") setError(loadError.message) })
            .finally(() => { if (!controller.signal.aborted) setLoading(false) })
        return () => controller.abort()
    }, [isLoaded, isSignedIn, fetchOrders])

    const updateOrderStatus = async (orderId, status) => {
        const token = await getToken()
        const response = await fetch(`${apiBaseUrl}/api/orders/store/${orderId}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ status })
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Order status could not be updated.")
        setOrders(current => current.map(order => order._id === orderId ? {
            ...order,
            status: result.data.status,
            items: order.items.map(item => ({ ...item, storeStatus: status }))
        } : order))
        toast.success("Order status updated.")
    }

    if (!isLoaded || loading) return <Loading />

    return (
        <div className="mb-28">
            <h1 className="mb-5 text-2xl text-slate-500">Store <span className="font-medium text-slate-800">Orders</span></h1>
            {!isSignedIn && <p className="text-slate-500">Sign in to view your store orders.</p>}
            {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
            {isSignedIn && !error && orders.length === 0 && <p className="text-slate-500">No orders found for your store.</p>}

            {orders.map(order => (
                <section key={order._id} className="mb-5 max-w-4xl rounded-lg border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                            <p className="font-semibold text-slate-800">{order.orderNumber}</p>
                            <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <p className="font-semibold text-slate-800">₹{order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toLocaleString()}</p>
                    </div>
                    <div className="my-4 space-y-3">
                        {order.items.map(item => (
                            <div key={item.product} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                                <div>
                                    <p className="font-medium text-slate-700">{item.name}</p>
                                    <p className="text-slate-500">Qty {item.quantity} · ₹{item.unitPrice} each</p>
                                </div>
                                <span className="rounded bg-slate-100 px-3 py-1 text-xs text-slate-600">{(item.storeStatus || "ORDER_PLACED").replaceAll("_", " ")}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-3">
                        <div className="text-sm text-slate-500">
                            <p>Customer: {order.address.name}</p>
                            <p>{order.address.city}, {order.address.state} · {order.address.phone}</p>
                            <p>Payment: Cash on Delivery</p>
                        </div>
                        <label className="grid gap-1 text-xs text-slate-500">Update fulfillment
                            <select
                                value={order.items[0]?.storeStatus || "ORDER_PLACED"}
                                onChange={event => toast.promise(updateOrderStatus(order._id, event.target.value), { loading: "Updating order…" })}
                                className="rounded border border-slate-300 p-2 text-sm text-slate-700"
                            >
                                <option value="ORDER_PLACED">Order placed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                            </select>
                        </label>
                    </div>
                </section>
            ))}
        </div>
    )
}
