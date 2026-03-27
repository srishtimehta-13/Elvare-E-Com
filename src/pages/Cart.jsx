import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IoTrashOutline, IoAdd, IoRemove, IoCartOutline, IoChevronBackOutline } from 'react-icons/io5';

const Cart = () => {
    const navigate = useNavigate();
    
    // FIXED: Destructuring the exact names exported from CartContext.jsx
    const { cart, removeFromCart, decreaseQuantity, addToCart } = useCart();

    // FIXED: Changed cartItem to cart
    const subtotal = cart?.reduce((total, item) => total + (Number(item.price) * item.quantity), 0) || 0;
    const taxes = subtotal * 0.08; 
    const total = subtotal + taxes;

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-gradient-to-br from-[#FAFAFA] via-[#F4EFE6] to-[#EAE4D3] selection:bg-[#0F4C5C] selection:text-white font-sans text-[#2A2A2A]">
            <div className="max-w-7xl mx-auto animate-[fadeIn_0.6s_ease-out]">
                
                {/* Header & Back Button */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 mb-6 text-[#5A5A5A] hover:text-[#0F4C5C] transition-all duration-300 w-fit"
                        >
                            <div className="bg-white/50 p-2 rounded-full shadow-sm group-hover:shadow-md group-hover:-translate-x-1 transition-all duration-300 border border-white">
                                <IoChevronBackOutline />
                            </div>
                            <span className="text-xs tracking-[0.2em] uppercase font-bold">Continue Shopping</span>
                        </button>
                        <h1 className="font-serif text-4xl md:text-5xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1A2A3A] to-[#3A4A5A]">
                            Your Shopping Cart
                        </h1>
                    </div>
                    {/* FIXED: Changed cartItem to cart */}
                    {cart?.length > 0 && (
                        <p className="text-[#5A5A5A] font-bold tracking-widest uppercase text-sm">
                            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                        </p>
                    )}
                </div>

                {/* FIXED: Changed cartItem to cart */}
                {!cart || cart.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="w-full bg-white/60 backdrop-blur-md rounded-3xl border border-white p-16 flex flex-col items-center justify-center text-center shadow-lg shadow-[#0F4C5C]/5">
                        <div className="w-32 h-32 bg-gradient-to-br from-[#FAFAFA] to-[#EAE4D3] rounded-full flex items-center justify-center mb-8 shadow-inner border border-white">
                            <IoCartOutline className="text-6xl text-[#D4AF37]" />
                        </div>
                        <h2 className="font-serif text-3xl text-[#1A2A3A] mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
                            It looks like you haven't added anything to your collection yet.
                        </p>
                        <button 
                            onClick={() => navigate('/products')}
                            className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-white text-sm font-bold tracking-[0.2em] uppercase rounded-full shadow-lg hover:-translate-y-1 transition-all duration-500"
                        >
                            Explore Collection
                        </button>
                    </div>
                ) : (
                    /* CART POPULATED STATE */
                    <div className="flex flex-col lg:flex-row gap-12">
                        
                        {/* LEFT COLUMN: Items */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-6">
                            {/* FIXED: Changed cartItem to cart */}
                            {cart.map((item) => (
                                <div key={item.id} className="group flex flex-col sm:flex-row gap-6 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm hover:shadow-xl hover:bg-white/80 transition-all duration-500">
                                    <div 
                                        className="w-full sm:w-32 h-32 bg-gradient-to-br from-[#FAFAFA] to-[#EAE4D3] rounded-2xl p-3 cursor-pointer overflow-hidden border border-transparent group-hover:border-[#D4AF37]/30 transition-colors shrink-0"
                                        onClick={() => navigate(`/products/${item.id}`)}
                                    >
                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <span className="block text-[#B5952F] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                                                    {item.category || 'Signature'}
                                                </span>
                                                <h3 
                                                    className="font-serif text-xl text-[#1A2A3A] cursor-pointer hover:text-[#0F4C5C] transition-colors line-clamp-2"
                                                    onClick={() => navigate(`/products/${item.id}`)}
                                                >
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <span className="font-bold text-[#0F4C5C] text-lg">
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-end mt-6">
                                            <div className="flex items-center gap-4 bg-white rounded-full px-4 py-2 border border-[#F4EFE6] shadow-sm">
                                                {/* FIXED: Wired up decreaseQuantity properly */}
                                                <button onClick={() => decreaseQuantity(item.id, item.title)} className="text-gray-400 hover:text-[#0F4C5C] p-1">
                                                    <IoRemove className="text-lg" />
                                                </button>
                                                <span className="text-base font-bold text-[#1A2A3A] w-6 text-center">{item.quantity}</span>
                                                {/* FIXED: Wired up addToCart for increasing quantity (your context already handles this perfectly!) */}
                                                <button onClick={() => addToCart(item)} className="text-gray-400 hover:text-[#0F4C5C] p-1">
                                                    <IoAdd className="text-lg" />
                                                </button>
                                            </div>

                                            {/* FIXED: Wired up removeFromCart properly */}
                                            <button onClick={() => removeFromCart(item.id, item.title)} className="flex items-center gap-2 text-gray-400 hover:text-rose-500 transition-colors text-sm font-bold uppercase tracking-widest">
                                                <IoTrashOutline className="text-xl" />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT COLUMN: Summary */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white shadow-lg sticky top-32">
                                <h2 className="font-serif text-2xl text-[#1A2A3A] mb-8 border-b border-[#F4EFE6] pb-4">Order Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-[#5A5A5A]">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-[#1A2A3A]">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#5A5A5A]">
                                        <span>Estimated Tax (8%)</span>
                                        <span className="font-bold text-[#1A2A3A]">${taxes.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#5A5A5A]">
                                        <span>Shipping</span>
                                        <span className="font-bold text-[#D4AF37] uppercase text-xs tracking-widest">Complimentary</span>
                                    </div>
                                </div>
                                <div className="border-t border-[#F4EFE6] pt-6 mb-8 flex justify-between items-end">
                                    <span className="text-lg font-bold text-[#1A2A3A] uppercase tracking-widest">Total</span>
                                    <span className="font-serif text-4xl text-[#0F4C5C]">${total.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full rounded-2xl py-5 bg-gradient-to-r from-[var(--teal)] to-[var(--purple)] text-white shadow-lg hover:-translate-y-1 transition-all duration-500 font-bold uppercase tracking-[0.2em] text-sm"
                                >
                                    Secure Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;