import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

const toastStyle = {
    borderRadius: '16px', background: '#FFFFFF', color: '#2A2A2A',
    border: '1px solid #F4EFE6', fontFamily: 'sans-serif',
    fontSize: '14px', letterSpacing: '0.05em'
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('elvare_wishlist');
        if (!savedWishlist) return [];
        try {
            return JSON.parse(savedWishlist);
        } catch {
            localStorage.removeItem('elvare_wishlist');
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('elvare_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (product) => {
        const isExisting = wishlist.find(item => String(item.id) === String(product.id));
        
        if (isExisting) {
            toast.info(`${product.title} removed from wishlist`, {
                icon: "💔", style: toastStyle, progressStyle: { background: '#E63946' }
            });
            setWishlist(prev => prev.filter(item => String(item.id) !== String(product.id)));
        } else {
            toast.success(`${product.title} saved to wishlist!`, {
                icon: "✨", style: toastStyle, progressStyle: { background: '#D4AF37' }
            });
            setWishlist(prev => [...prev, product]);
        }
    };

    const isInWishlist = (productId) => wishlist.some(item => String(item.id) === String(productId));

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);