import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getAccessoryImage } from '../utils/getAccessoryImage';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/accessories').then(res => {
      setAccessories(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      localStorage.setItem('pending_cart_item', JSON.stringify(item));
      navigate('/login');
      return;
    }
    addToCart(item);
  };

  const renderCategory = (title, categoryKey) => {
    const items = accessories.filter(a => a.category === categoryKey);
    if (items.length === 0) return <p className="text-slate-400 font-medium">No {title.toLowerCase()} available.</p>;

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase border-l-4 border-l-primary pl-3 mb-6">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <Link to={`/accessories/${item._id}`} key={item._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 relative flex flex-col">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden p-4 flex items-center justify-center">
                 <img src={getAccessoryImage(item)} alt={item.name} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 shadow-sm" />
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-slate-100">
                    ${item.price?.toLocaleString()}
                 </div>
              </div>
              <div className="p-5 flex-grow flex flex-col border-t border-slate-50">
                <h4 className="font-bold text-slate-800 tracking-tight text-lg line-clamp-1 mb-1">{item.name}</h4>
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">
                  {item.stock > 0 ? <span className="text-emerald-600 font-bold">{item.stock} in stock</span> : <span className="text-rose-500 font-bold">Out of stock</span>}
                </div>
                
                <button 
                  onClick={(e) => handleAddToCart(e, item)}
                  disabled={item.stock <= 0}
                  className="mt-auto w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-slate-900 rounded-2xl p-8 md:p-16 mb-10 text-center relative overflow-hidden shadow-lg">
         {/* Nice background image for accessories */}
         <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000" alt="Accessories Background" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
         
         <div className="relative z-10">
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-4 drop-shadow-md">Premium Accessories</h1>
           <p className="text-slate-300 font-medium max-w-xl mx-auto text-lg drop-shadow">Customize your vehicle with certified Carxell compatible parts and merchandise.</p>
         </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading catalog...</div>
      ) : accessories.length === 0 ? (
        <div className="text-center py-20">
           <h3 className="text-xl font-bold text-slate-800 mb-2">Catalog empty</h3>
           <p className="text-slate-500">The accessory backend was just initialized and hasn't seeded parts yet.</p>
        </div>
      ) : (
        <div className="px-4">
          {renderCategory('Interiors', 'interior')}
          {renderCategory('Exteriors', 'exterior')}
          {renderCategory('Spare Parts', 'spare_parts')}
          {renderCategory('Merchandise', 'merchandise')}
        </div>
      )}
    </div>
  );
};

export default Accessories;
