'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { assets } from '@/assets/assets'

const ProductCard = ({ product }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
    const ratings = Array.isArray(product.rating) ? product.rating : []
    const averageRating = ratings.length
        ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length
        : 0
    const image = product.images?.[0] || assets.product_img1

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto'>
            <div className='bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center overflow-hidden'>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-105 transition duration-300' src={image} alt={product.name} />
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                    <div className='flex' aria-label={`Average rating ${averageRating.toFixed(1)} out of 5`}>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? '#00C950' : '#D1D5DB'} />
                        ))}
                    </div>
                </div>
                <p>{currency}{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard
