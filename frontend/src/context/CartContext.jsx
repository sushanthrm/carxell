import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('carxell_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('carxell_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(prev => {
            // Create a unique ID that includes the selectedCar if it exists
            const uniqueId = item.selectedCar ? `${item._id}-${item.selectedCar}` : item._id;
            const exists = prev.find(i => (i.cartItemId || i._id) === uniqueId);
            
            if (exists) {
                return prev.map(i => (i.cartItemId || i._id) === uniqueId ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1, cartItemId: uniqueId }];
        });
    };

    const removeFromCart = (uniqueId) => {
        setCart(prev => prev.filter(item => (item.cartItemId || item._id) !== uniqueId));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
