import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

// Reusable luxury toast styles
const toastStyle = {
    borderRadius: '16px', background: '#FFFFFF', color: '#2A2A2A',
    border: '1px solid #F4EFE6', fontFamily: 'sans-serif',
    fontSize: '14px', letterSpacing: '0.05em'
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('elvare_cart');
        if (!savedCart) return [];
        try {
            return JSON.parse(savedCart);
        } catch {
            localStorage.removeItem('elvare_cart');
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('elvare_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        // 1. Force IDs to be strings, and check OUTSIDE the setter to stop double-toasts
        const existingItem = cart.find(item => String(item.id) === String(product.id));
        
        if (existingItem) {
            toast.info(`Increased ${product.title} quantity`, { 
                icon: "🔄", style: toastStyle, progressStyle: { background: '#D4AF37' }
            });
            setCart(prev => prev.map(item => 
                String(item.id) === String(product.id) ? { ...item, quantity: (item.quantity || 1) + 1 } : item
            ));
        } else {
            toast.success(`${product.title} added to cart!`, { 
                icon: "🛍️", style: toastStyle, progressStyle: { background: '#0F4C5C' }
            });
            setCart(prev => [...prev, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId, productTitle) => {
        toast.error(`${productTitle || 'Item'} removed from cart`, { 
            icon: "🗑️", style: toastStyle, progressStyle: { background: '#E63946' }
        });
        setCart(prev => prev.filter(item => String(item.id) !== String(productId)));
    };

    const decreaseQuantity = (productId, productTitle) => {
        const existingItem = cart.find(item => String(item.id) === String(productId));
        
        if (existingItem?.quantity === 1) {
            toast.error(`${productTitle || 'Item'} removed from cart`, { 
                icon: "🗑️", style: toastStyle, progressStyle: { background: '#E63946' }
            });
            setCart(prev => prev.filter(item => String(item.id) !== String(productId)));
        } else if (existingItem) {
            toast.info(`Decreased ${productTitle || 'Item'} quantity`, { 
                icon: "➖", style: toastStyle, progressStyle: { background: '#D4AF37' }
            });
            setCart(prev => prev.map(item => 
                String(item.id) === String(productId) ? { ...item, quantity: item.quantity - 1 } : item
            ));
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, decreaseQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);