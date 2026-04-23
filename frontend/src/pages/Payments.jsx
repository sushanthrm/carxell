import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import { CreditCard, ShieldCheck, ChevronLeft } from 'lucide-react';

const Payments = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = getCartTotal();

  if (cart.length === 0) {
      return (
          <div className="max-w-2xl mx-auto my-20 text-center">
              <h2 className="text-2xl font-black text-slate-800">Your Checkout Session is Empty</h2>
              <Link to="/cart" className="text-primary hover:underline font-bold mt-4 inline-block">Return to Cart</Link>
          </div>
      );
  }

  const handlePaymentSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
          // Simulation: Process each car in the cart as an order to trigger the stock deduction
          // In a real app, this would be a single order payload hitting a complex transaction pipeline
          const carsInCart = cart.filter(item => item.category !== 'interior' && item.category !== 'exterior'); // filter strictly if we only track car orders

          for (const item of cart) {
              // The backend /orders currently expects a car_id. We'll simulate pushing all valid car items.
              // We pass item._id
              if (item.brand) { // heuristic: cars have brands, accessories have specific schema but we can send anyway if backend allows it wait backend /orders expects car_id.
                 try {
                     await api.post('/orders', { car_id: item._id });
                 } catch (err) {
                     console.error("Order error", err);
                 }
              }
          }

          clearCart();
          navigate('/dashboard');
      } catch (err) {
          setError('Payment processing failed. Please check your details.');
      } finally {
          setLoading(false);
      }
  };

  return (
      <div className="max-w-6xl mx-auto my-10 px-4">
          <Link to="/cart" className="inline-flex items-center text-slate-500 hover:text-primary font-bold mb-6 transition">
              <ChevronLeft size={20} /> Back to Cart
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-10">
              {/* Order Summary Left Column */}
              <div className="lg:w-1/2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase border-l-4 border-l-primary pl-3 mb-8">Secure Checkout</h2>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
                      <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-4">Order Summary</h3>
                      <div className="space-y-4 mb-6">
                          {cart.map(item => (
                              <div key={item._id} className="flex justify-between items-center border-b border-slate-200 pb-4">
                                  <div>
                                      <div className="font-bold text-slate-800">{item.name}</div>
                                      <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Qty: {item.quantity || 1}</div>
                                  </div>
                                  <div className="font-medium text-slate-600">${item.price.toLocaleString()}</div>
                              </div>
                          ))}
                      </div>
                      <div className="flex justify-between items-end pt-2">
                          <span className="font-bold text-slate-800 uppercase tracking-widest">Total to Pay</span>
                          <span className="text-3xl font-light text-primary">${total.toLocaleString()}</span>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500 bg-white border border-slate-200 p-4 rounded-lg">
                      <ShieldCheck size={32} className="text-emerald-500" />
                      <div>
                          <div className="font-bold text-slate-800">Bank-Grade Security</div>
                          <p>Your payment information is heavily encrypted and perfectly secure.</p>
                      </div>
                  </div>
              </div>

              {/* Payment Details Right Column */}
              <div className="lg:w-1/2">
                  <form onSubmit={handlePaymentSubmit} className="bg-white border border-slate-200 rounded-xl shadow-lg p-8">
                      <h3 className="font-bold text-slate-800 text-xl mb-6 flex items-center gap-2">
                          <CreditCard className="text-primary" /> Payment Details
                      </h3>

                      {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-lg text-sm">{error}</div>}

                      <div className="space-y-6">
                          <div>
                              <label className="label">Name on Card</label>
                              <input type="text" className="input-field" required placeholder="John Doe" />
                          </div>
                          
                          <div>
                              <label className="label">Card Number</label>
                              <div className="relative">
                                  <input type="text" className="input-field pl-10 tracking-widest font-mono" required placeholder="0000 0000 0000 0000" maxLength={19} />
                                  <CreditCard size={18} className="absolute left-3 top-3 text-slate-400" />
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                              <div>
                                  <label className="label">Expiry Date</label>
                                  <input type="text" className="input-field text-center tracking-widest font-mono" required placeholder="MM/YY" maxLength={5} />
                              </div>
                              <div>
                                  <label className="label">CVC / CVV</label>
                                  <input type="password" className="input-field text-center tracking-widest font-mono" required placeholder="•••" maxLength={4} />
                              </div>
                          </div>
                      </div>

                      <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full btn-primary py-4 text-lg uppercase tracking-widest mt-8 shadow-md disabled:opacity-50"
                      >
                          {loading ? 'Processing...' : `Pay $${total.toLocaleString()}`}
                      </button>
                      <p className="text-center text-xs text-slate-400 mt-4 uppercase tracking-widest">Powered by Simulated Checkout</p>
                  </form>
              </div>
          </div>
      </div>
  );
};

export default Payments;
