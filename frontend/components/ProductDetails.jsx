'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { assets } from "@/assets/assets";

const ProductDetails = ({ product }) => {
    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const router = useRouter();
    const images = product.images?.length ? product.images : [assets.product_img1];
    const ratings = Array.isArray(product.rating) ? product.rating : [];
    const [mainImage, setMainImage] = useState(images[0]);

    const addToCartHandler = () => dispatch(addToCart({ productId }));
    const averageRating = ratings.length
        ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length
        : 0;
    const discount = product.mrp > 0
        ? Math.max(0, ((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {images.map((image, index) => (
                        <button type="button" key={index} onClick={() => setMainImage(image)} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer" aria-label={`View product image ${index + 1}`}>
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt={product.name} width={45} height={45} />
                        </button>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg">
                    <Image src={mainImage} alt={product.name} width={500} height={500} className="max-h-full w-auto object-contain" />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2' aria-label={`Average rating ${averageRating.toFixed(1)} out of 5`}>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{ratings.length} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p>{currency}{product.price}</p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                {discount > 0 && <div className="flex items-center gap-2 text-slate-500"><TagIcon size={14} /><p>Save {discount.toFixed(0)}% right now</p></div>}
                <div className="flex items-end gap-5 mt-10">
                    {cart[productId] && <div className="flex flex-col gap-3"><p className="text-lg text-slate-800 font-semibold">Quantity</p><p>{cart[productId]}</p></div>}
                    <button onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')} className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition">
                        {!cart[productId] ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
            </div>
        </div>
    )
}

export default ProductDetails
