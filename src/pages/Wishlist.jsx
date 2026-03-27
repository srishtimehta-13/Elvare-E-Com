import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { IoHeartDislikeOutline, IoCartOutline, IoChevronBackOutline } from 'react-icons/io5';
import { CiHeart } from 'react-icons/ci';

const Wishlist = () => {
    const navigate = useNavigate();
    
    // Using the correct function name from WishlistContext
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleMoveToCart = (item) => {
        addToCart(item);
        // Using toggleWishlist to remove it from the wishlist once added to cart
        toggleWishlist(item);
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-gradient-to-br from-[#FAFAFA] via-[#F4EFE6] to-[#EAE4D3] font-sans text-[#2A2A2A]">
            <div className="max-w-7xl mx-auto animate-[fadeIn_0.6s_ease-out]">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 mb-6 text-[#5A5A5A] hover:text-[#0F4C5C] transition-all duration-300 w-fit"
                        >
                            <div className="bg-white/50 p-2 rounded-full shadow-sm group-hover:shadow-md group-hover:-translate-x-1 transition-all duration-300 border border-white">
                                <IoChevronBackOutline />
                            </div>
                            <span className="text-xs tracking-[0.2em] uppercase font-bold">Back</span>
                        </button>
                        <h1 className="font-serif text-4xl md:text-5xl leading-tight text-[#1A2A3A]">
                            Your Curated Collection
                        </h1>
                    </div>
                    {wishlist?.length > 0 && (
                        <p className="text-[#5A5A5A] font-bold tracking-widest uppercase text-sm">
                            {wishlist.length} {wishlist.length === 1 ? 'Saved Item' : 'Saved Items'}
                        </p>
                    )}
                </div>

                {wishlist.length === 0 ? (
                    <div className="w-full bg-white/60 backdrop-blur-md rounded-3xl border border-white p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-[#FAFAFA] to-[#EAE4D3] rounded-full flex items-center justify-center mb-8 border border-white">
                            <CiHeart className="text-6xl text-[#D4AF37]" />
                        </div>
                        <h2 className="font-serif text-3xl text-[#1A2A3A] mb-4">Nothing caught your eye yet</h2>
                        <button 
                            onClick={() => navigate('/products')}
                            className="px-10 py-4 bg-[#0F4C5C] text-white text-sm font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-500"
                        >
                            Discover Pieces
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {wishlist.map((item) => (
                            <div key={item.id} className="group flex flex-col bg-white/60 backdrop-blur-md rounded-3xl p-5 border border-white shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-[#FAFAFA] to-[#EAE4D3] rounded-2xl p-4 mb-5 overflow-hidden">
                                    <img 
                                        src={item.image || item.thumbnail} 
                                        alt={item.title} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 cursor-pointer" 
                                        onClick={() => navigate(`/products/${item.id}`)}
                                    />
                                    {/* Event bubbling prevented and using toggleWishlist */}
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleWishlist(item);
                                        }}
                                        className="absolute top-3 right-3 p-2.5 bg-white/80 rounded-full text-gray-400 hover:text-rose-500 transition-all duration-300"
                                    >
                                        <IoHeartDislikeOutline className="text-lg" />
                                    </button>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <h3 className="font-serif text-lg text-[#1A2A3A] mb-2">{item.title}</h3>
                                    <span className="font-bold text-[#0F4C5C] text-lg">${Number(item.price).toFixed(2)}</span>
                                    
                                    {/* Event bubbling prevented and mapped to the updated handleMoveToCart */}
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleMoveToCart(item);
                                        }}
                                        className="mt-5 w-full py-3 border border-[#0F4C5C] text-[#0F4C5C] rounded-xl text-xs font-bold uppercase hover:bg-[#0F4C5C] hover:text-white transition-all duration-300"
                                    >
                                        <IoCartOutline className="inline mr-2 text-lg" /> Move to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;