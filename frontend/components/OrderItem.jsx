'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import { assets } from "@/assets/assets";

const OrderItem = ({ order }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
    const [ratingModal, setRatingModal] = useState(null);
    const { ratings } = useSelector(state => state.rating);

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={item.product?.id || index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image className="h-14 w-auto" src={item.product.images?.[0] || assets.product_img1} alt={item.product.name} width={50} height={50} />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty: {item.quantity}</p>
                                    <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                    {order.status === "DELIVERED" && (
                                        ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className="text-green-500 hover:bg-green-50 transition">Rate Product</button>
                                    )}
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>
                <td className="text-center max-md:hidden">{currency}{order.total}</td>
                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>
                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div className="flex items-center justify-center gap-1 rounded-full bg-slate-100 p-1 text-slate-600">
                        <DotIcon size={10} className="scale-250" />
                        {order.status.split('_').join(' ').toLowerCase()}
                    </div>
                </td>
            </tr>
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <br />
                    <div className="flex items-center">
                        <span className="mx-auto rounded bg-green-100 px-6 py-1.5 text-center text-green-700">{order.status.replace(/_/g, ' ').toLowerCase()}</span>
                    </div>
                </td>
            </tr>
            <tr><td colSpan={4}><div className="mx-auto w-6/7 border-b border-slate-300" /></td></tr>
        </>
    )
}

export default OrderItem
