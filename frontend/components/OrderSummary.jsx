'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AddressModal from './AddressModal'
import { clearCart } from '@/lib/features/cart/cartSlice'

const OrderSummary = ({ totalPrice, items }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
    const { getToken, isLoaded, isSignedIn } = useAuth()
    const dispatch = useDispatch()
    const router = useRouter()
    const [addresses, setAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState('')
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [loadingAddresses, setLoadingAddresses] = useState(true)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [error, setError] = useState('')

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            setLoadingAddresses(false)
            return
        }

        const controller = new AbortController()
        async function loadAddresses() {
            try {
                const token = await getToken()
                const response = await fetch(`${apiBaseUrl}/api/addresses`, {
                    signal: controller.signal,
                    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
                })
                const result = await response.json()
                if (!response.ok) throw new Error(result.message || 'Unable to load saved addresses.')
                setAddresses(result.data || [])
                setSelectedAddressId(result.data?.[0]?._id || '')
            } catch (fetchError) {
                if (fetchError.name !== 'AbortError') setError(fetchError.message)
            } finally {
                if (!controller.signal.aborted) setLoadingAddresses(false)
            }
        }
        loadAddresses()
        return () => controller.abort()
    }, [isLoaded, isSignedIn, getToken, apiBaseUrl])

    const handleAddressSaved = (address) => {
        setAddresses(current => [address, ...current])
        setSelectedAddressId(address._id)
    }

    const handlePlaceOrder = async () => {
        if (!isSignedIn) {
            toast.error('Please sign in before placing an order.')
            return
        }
        if (!selectedAddressId) {
            toast.error('Add or select a delivery address first.')
            return
        }
        if (!items.length) {
            toast.error('Your cart is empty.')
            return
        }

        setPlacingOrder(true)
        setError('')
        try {
            const token = await getToken()
            const response = await fetch(`${apiBaseUrl}/api/orders`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    paymentMethod: 'COD',
                    items: items.map(item => ({ productId: item.id, quantity: item.quantity }))
                })
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.message || 'Order could not be placed.')
            dispatch(clearCart())
            toast.success(`Order ${result.data.orderNumber} placed successfully.`)
            router.push('/orders')
        } catch (placeError) {
            setError(placeError.message)
            toast.error(placeError.message)
        } finally {
            setPlacingOrder(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-md sm:p-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-slate-700">Order summary</h2>

            <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium text-slate-700">Delivery address</p>
                    <button type="button" onClick={() => setShowAddressModal(true)} className="text-green-700 hover:underline">Add address</button>
                </div>
                {loadingAddresses ? <p>Loading saved addresses…</p> : addresses.length ? (
                    <select value={selectedAddressId} onChange={event => setSelectedAddressId(event.target.value)} className="w-full rounded border border-slate-300 p-3">
                        {addresses.map(address => (
                            <option key={address._id} value={address._id}>
                                {address.name} — {address.street}, {address.city}
                            </option>
                        ))}
                    </select>
                ) : <p className="rounded bg-amber-50 p-3 text-amber-800">Add a delivery address before placing your order.</p>}
                {!isSignedIn && isLoaded && <p className="mt-2 text-amber-700">Sign in to save an address and place an order.</p>}
            </div>

            <div className="flex justify-between border-y border-slate-200 py-5">
                <span>Subtotal</span>
                <span className="font-medium">{currency}{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-5 text-lg font-semibold text-slate-800">
                <span>Total</span>
                <span>{currency}{totalPrice.toLocaleString()}</span>
            </div>
            <p className="mb-4 text-xs text-slate-500">Payment method: Cash on Delivery. Online payment is not enabled.</p>
            {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}
            <button type="button" disabled={placingOrder || loadingAddresses || !isSignedIn} onClick={handlePlaceOrder} className="w-full rounded-lg bg-green-600 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60">
                {placingOrder ? 'Placing order…' : 'Place order'}
            </button>
            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} onAddressSaved={handleAddressSaved} />}
        </div>
    )
}

export default OrderSummary
