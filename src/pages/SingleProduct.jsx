import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; 
import { IoCartOutline, IoChevronBackOutline, IoStar, IoCheckmarkCircleOutline, IoHeartOutline, IoHeart } from 'react-icons/io5';

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: products, loading } = useData();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const product = useMemo(
        () => products.find((item) => String(item.id) === String(id)) || null,
        [products, id]
    );
    const [selectedImage, setSelectedImage] = useState('');
    const [isFading, setIsFading] = useState(false);
    const defaultImage = product?.images?.[0] || product?.thumbnail || '';
    const mainImage = product?.images?.includes(selectedImage) ? selectedImage : defaultImage;

    const handleImageSwap = (newImg) => {
        if (newImg === mainImage) return;
        setIsFading(true);
        setTimeout(() => {
            setSelectedImage(newImg);
            setIsFading(false);
        }, 200); 
    };

    // Cleaned handleAddToCart function - CartContext handles the toast now!
    const handleAddToCart = () => {
        addToCart(product);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#EAE4D3] flex items-center justify-center pt-32">
                <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#0F4C5C] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[var(--ivory)] flex items-center justify-center">
                <div className="max-w-lg rounded-3xl border border-[var(--beige)] bg-white/80 p-10 text-center shadow-lg">
                    <h2 className="mb-3 font-serif text-3xl text-[var(--charcoal)]">Product not found</h2>
                    <p className="mb-8 text-sm tracking-wide text-[var(--charcoal)]/70">
                        This item may have been removed or the link is incorrect.
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="rounded-full bg-[var(--teal)] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[var(--purple)]"
                    >
                        Back to collection
                    </button>
                </div>
            </div>
        );
    }

    const originalPrice = product.discountPercentage
        ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
        : null;

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-gradient-to-br from-[#FAFAFA] via-[#F4EFE6] to-[#EAE4D3] selection:bg-[#0F4C5C] selection:text-white font-sans text-[#2A2A2A]">
            <div className="max-w-7xl mx-auto animate-[fadeIn_0.6s_ease-out]">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 mb-8 text-[#5A5A5A] hover:text-[#0F4C5C] transition-all duration-300 w-fit"
                >
                    <div className="bg-white/50 p-2 rounded-full shadow-sm group-hover:shadow-md group-hover:-translate-x-1 transition-all duration-300 border border-white">
                        <IoChevronBackOutline />
                    </div>
                    <span className="text-xs tracking-[0.2em] uppercase font-bold">Back to Collection</span>
                </button>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* LEFT COLUMN: Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        <div className="relative w-full aspect-square md:aspect-[4/5] bg-white/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 overflow-hidden group border border-white">
                            {product.discountPercentage && (
                                <div className="absolute top-6 left-6 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase z-10 shadow-lg shadow-[#D4AF37]/30">
                                    {Math.round(product.discountPercentage)}% OFF
                                </div>
                            )}
                            <img
                                src={mainImage}
                                alt={product.title}
                                className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ease-in-out group-hover:scale-110 ${isFading ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                            />
                        </div>

                        {/* Thumbnail Strip */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 px-1">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageSwap(img)}
                                        className={`w-24 h-24 rounded-2xl flex-shrink-0 transition-all duration-300 ease-out bg-white/80 backdrop-blur-sm p-2 overflow-hidden border-2 ${
                                            mainImage === img 
                                            ? 'border-[#0F4C5C] shadow-lg shadow-[#0F4C5C]/20 scale-105' 
                                            : 'border-white/50 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#D4AF37]/50'
                                        }`}
                                    >
                                        <img src={img} alt={`thumbnail ${index}`} className="w-full h-full object-contain drop-shadow-md" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Rich Data & Cart */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            {product.brand && (
                                <span className="bg-[#D4AF37]/10 text-[#B5952F] px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-[#D4AF37]/20">
                                    {product.brand}
                                </span>
                            )}
                            <span className="bg-[#0F4C5C]/10 text-[#0F4C5C] px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-[#0F4C5C]/20">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#1A2A3A] to-[#3A4A5A]">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-3 mb-6 bg-white/40 w-fit px-4 py-2 rounded-full shadow-sm border border-white">
                            <div className="flex text-[#D4AF37] drop-shadow-sm">
                                {[...Array(5)].map((_, i) => (
                                    <IoStar key={i} className={i < Math.round(product.rating) ? "opacity-100" : "opacity-30 text-gray-400"} />
                                ))}
                            </div>
                            <span className="text-sm font-bold opacity-80">
                                {product.rating} <span className="text-xs opacity-60 font-normal">/ 5.0</span>
                            </span>
                        </div>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-[#0F4C5C] text-4xl font-black tracking-tight drop-shadow-sm">
                                ${Number(product.price).toFixed(2)}
                            </span>
                            {originalPrice && (
                                <span className="text-gray-400 text-xl line-through mb-1 decoration-[#D4AF37]/60 decoration-2">
                                    ${originalPrice}
                                </span>
                            )}
                        </div>

                        <p className="text-lg leading-relaxed text-gray-600 mb-10 max-w-lg">
                            {product.description}
                        </p>

                        {/* INFO GRID */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {[
                                { label: 'Availability', value: product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock', icon: <IoCheckmarkCircleOutline className={product.stock > 0 ? "text-[#0F4C5C] text-xl" : "text-rose-500 text-xl"} /> },
                                { label: 'Product Code', value: product.sku || 'N/A', icon: null },
                                { label: 'Shipping', value: product.shippingInformation || 'Standard Delivery', icon: null },
                                { label: 'Warranty', value: product.warrantyInformation || 'Standard 1 Year', icon: null }
                            ].map((info, idx) => (
                                <div key={idx} className="group bg-white/40 backdrop-blur-sm p-5 rounded-2xl border border-white/60 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-default">
                                    <span className="block text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">{info.label}</span>
                                    <div className="flex items-center gap-2">
                                        {info.icon}
                                        <span className="text-[#1A2A3A] text-xs font-bold uppercase tracking-wider">{info.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex items-center gap-4 w-full md:w-[90%]">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className={`flex-1 relative overflow-hidden rounded-2xl py-5 flex items-center justify-center gap-3 transition-all duration-500 group active:scale-[0.97] ${
                                    product.stock > 0
                                        ? 'bg-gradient-to-r from-[#0F4C5C] to-[#082933] text-white shadow-[0_10px_20px_rgba(15,76,92,0.2)] hover:shadow-[0_15px_30px_rgba(15,76,92,0.4)] hover:-translate-y-1'
                                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-white cursor-not-allowed'
                                }`}
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <IoCartOutline className="text-2xl group-hover:-rotate-12 transition-transform duration-500 relative z-10" />
                                <span className="text-sm tracking-[0.2em] font-bold uppercase mt-0.5 relative z-10">
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </span>
                            </button>

                            <button
                                onClick={() => toggleWishlist(product)} 
                                className={`h-[64px] w-[64px] rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-500 group active:scale-[0.95] shadow-sm hover:shadow-xl hover:-translate-y-1 border ${
                                    isInWishlist(product.id) 
                                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#B5952F] text-white border-transparent' 
                                    : 'bg-white text-[#D4AF37] border-white/60 hover:border-[#D4AF37]/50'
                                }`}
                                aria-label="Add to Wishlist"
                            >
                                {isInWishlist(product.id) ? (
                                    <IoHeart className="text-3xl scale-110 transition-transform duration-300 drop-shadow-md" />
                                ) : (
                                    <IoHeartOutline className="text-3xl group-hover:scale-110 transition-transform duration-300" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;