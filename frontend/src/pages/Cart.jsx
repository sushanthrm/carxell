import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { getCarImage } from '../utils/getCarImage';

const Cart = () => {
    const { cart, removeFromCart, getCartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const total = getCartTotal();
    const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-20 mt-10 px-4 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                   <ShoppingBag size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-4">Your Cart is Empty</h2>
                <p className="text-slate-500 font-medium mb-8">Ready to discover your next vehicle or customize your current one?</p>
                <div className="flex justify-center gap-4">
                    <Link to="/cars" className="btn-primary py-3 px-8 uppercase tracking-widest text-sm shadow-sm">Browse Cars</Link>
                    <Link to="/accessories" className="btn-secondary py-3 px-8 uppercase tracking-widest text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm border border-slate-200">View Accessories</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto my-10 px-4">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase border-l-4 border-l-primary pl-3 mb-8">Your Cart</h2>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                    {cart.map(item => (
                        <div key={item.cartItemId || item._id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm relative">
                            <div className="w-32 h-32 bg-slate-100 flex items-center justify-center rounded-lg border border-slate-100 overflow-hidden relative shadow-inner">
                               <img src={getCarImage(item)} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            
                            <div className="flex-grow text-center md:text-left">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    {item.brand || 'Accessory'} {item.selectedCar ? `(For: ${item.selectedCar})` : ''}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.name}</h3>
                                <div className="text-sm text-slate-500 font-medium tracking-wide">Qty: {item.quantity || 1}</div>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-4 min-w-[120px]">
                                <div className="text-2xl font-light text-slate-800">${item.price?.toLocaleString()}</div>
                                <button onClick={() => removeFromCart(item.cartItemId || item._id)} className="text-sm font-bold text-rose-500 hover:text-rose-700 transition flex items-center gap-1 uppercase tracking-wider">
                                    <Trash2 size={16} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sticky top-8">
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4 mb-6">Order Summary</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-slate-600 font-medium">
                                <span>Subtotal ({cartItemCount} items)</span>
                                <span>${total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 font-medium">
                                <span>Taxes & Fees</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-slate-600 font-medium pb-4 border-b border-slate-100">
                                <span>Delivery</span>
                                <span className="text-emerald-600 font-bold uppercase text-xs tracking-wider">Free</span>
                            </div>
                            
                            <div className="flex justify-between items-end pt-2">
                                <span className="font-bold text-slate-800 uppercase tracking-widest">Estimated Total</span>
                                <span className="text-3xl font-light text-primary">${total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/payments')}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg uppercase tracking-widest shadow-md"
                        >
                            Checkout <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
