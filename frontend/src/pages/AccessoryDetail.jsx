import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ChevronLeft, Info, ShoppingCart, CreditCard } from 'lucide-react';
import { getAccessoryImage } from '../utils/getAccessoryImage';

const AccessoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [selectedCar, setSelectedCar] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    api.get(`/accessories/${id}`)
      .then(res => { setItem(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  if (loading) return <div className="text-center py-20 font-medium text-slate-500">Loading details...</div>;
  if (!item) return <div className="text-center py-20 font-medium text-slate-500">Accessory not found.</div>;

  const handleAddToCart = () => {
    if (!selectedCar) {
      setActionMsg('Please select a car first!');
      setTimeout(() => setActionMsg(''), 3000);
      return;
    }
    const itemWithCar = { ...item, selectedCar };
    if (!user) {
      localStorage.setItem('pending_cart_item', JSON.stringify(itemWithCar));
      navigate('/login');
      return;
    }
    addToCart(itemWithCar);
    setActionMsg('Added to cart successfully!');
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleBuyNow = () => {
    if (!selectedCar) {
      setActionMsg('Please select a car first!');
      setTimeout(() => setActionMsg(''), 3000);
      return;
    }
    const itemWithCar = { ...item, selectedCar };
    if (!user) {
      localStorage.setItem('pending_cart_item', JSON.stringify(itemWithCar));
      navigate('/login');
      return;
    }
    addToCart(itemWithCar);
    navigate('/cart');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16">
      <Link to="/accessories" className="inline-flex items-center text-slate-500 hover:text-primary font-bold mb-6 transition">
        <ChevronLeft size={20} /> Back to Accessories
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 bg-slate-100 flex items-center justify-center relative min-h-[400px]">
          <img src={getAccessoryImage(item)} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="text-sm font-bold text-primary tracking-widest uppercase mb-2">{item.category.replace('_', ' ')}</div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase mb-4">{item.name}</h1>
          <div className="text-3xl font-light text-slate-600 mb-8 border-b border-slate-100 pb-8">
            ${item.price?.toLocaleString()}
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 flex-grow">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Compatibility</div>
              <div className="font-semibold text-slate-800">
                {item.car_compatibility && item.car_compatibility.length > 0 ? item.car_compatibility.join(', ') : 'Universal Fit'}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Availability</div>
              <div className={`font-bold ${item.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {item.stock > 0 ? `${item.stock} In Stock` : 'Out of Stock'}
              </div>
            </div>
          </div>

          <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Your Car *</label>
             <select 
               className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-primary/30" 
               value={selectedCar} 
               onChange={e => setSelectedCar(e.target.value)}
             >
                <option value="">-- Choose a Car --</option>
                <option value="Maruti Suzuki Vitara">Maruti Suzuki Vitara</option>
                <option value="Lamborghini Temerario">Lamborghini Temerario</option>
                <option value="Tata Nexon">Tata Nexon</option>
                <option value="Skoda Kylaq">Skoda Kylaq</option>
                <option value="Hyundai Venue">Hyundai Venue</option>
             </select>
          </div>

          {actionMsg && <div className={`p-3 border font-bold rounded-lg mb-4 text-center ${actionMsg.includes('select') ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>{actionMsg}</div>}

          <div className="flex flex-col gap-3 mt-auto">
            <button 
              onClick={handleBuyNow}
              disabled={item.stock <= 0}
              className={`w-full py-4 flex items-center justify-center gap-2 text-lg shadow-md transition-all hover:scale-[1.02] ${!selectedCar ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'btn-primary'}`}
            >
              <CreditCard size={20} /> {item.stock > 0 ? 'Buy Now' : 'Unavailable'}
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={item.stock <= 0}
              className={`w-full py-4 flex items-center justify-center gap-2 text-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all border border-slate-200 ${!selectedCar ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-start gap-4">
         <div className="bg-primary/10 p-3 rounded-full text-primary mt-1"><Info size={24} /></div>
         <div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Product Description</h3>
            <p className="text-slate-600 leading-relaxed">
              Enhance your vehicle with the {item.name}, a premium quality accessory specifically categorized under {item.category.replace('_', ' ')}. Designed with precision and engineered to meet top industry standards, this part ensures durability and superior performance. Buy authentic parts directly through Carxell for guaranteed satisfaction and seamless integration.
            </p>
         </div>
      </div>
    </div>
  );
};

export default AccessoryDetail;
