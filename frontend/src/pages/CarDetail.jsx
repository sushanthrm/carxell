import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ChevronLeft, Info, Calendar, ShoppingCart } from 'lucide-react';
import { getCarImage } from '../utils/getCarImage';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(res => { setCar(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  if (loading) return <div className="text-center py-20 font-medium text-slate-500">Loading details...</div>;
  if (!car) return <div className="text-center py-20 font-medium text-slate-500">Car not found.</div>;

  const handleAddToCart = () => {
    if (!user) {
      localStorage.setItem('pending_cart_item', JSON.stringify(car));
      navigate('/login');
      return;
    }
    addToCart(car);
    setActionMsg('Added to cart successfully!');
    setTimeout(() => setActionMsg(''), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <Link to="/cars" className="inline-flex items-center text-slate-500 hover:text-primary font-bold mb-6 transition">
        <ChevronLeft size={20} /> Back to Inventory
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Image Mock Section */}
        <div className="md:w-1/2 bg-slate-100 flex items-center justify-center relative min-h-[400px]">
          <img src={getCarImage(car)} alt={car.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="text-sm font-bold text-primary tracking-widest uppercase mb-2">{car.brand} <span className="text-slate-300 mx-2">|</span> {car.category}</div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase mb-4">{car.name}</h1>
          <div className="text-3xl font-light text-slate-600 mb-8 border-b border-slate-100 pb-8">
            ${car.price.toLocaleString()}
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 flex-grow">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Engine</div>
              <div className="font-semibold text-slate-800">{car.specs?.engine || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Range/Mileage</div>
              <div className="font-semibold text-slate-800">{car.specs?.range_or_mileage || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Transmission</div>
              <div className="font-semibold text-slate-800">{car.specs?.transmission || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Availability</div>
              <div className={`font-bold ${car.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {car.stock > 0 ? `${car.stock} In Stock` : 'Out of Stock'}
              </div>
            </div>
          </div>

          {actionMsg && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-lg mb-4 text-center">{actionMsg}</div>}

          <div className="flex flex-col gap-3 mt-auto">
            <button 
              onClick={handleAddToCart}
              disabled={car.stock <= 0}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:bg-slate-300"
            >
              <ShoppingCart size={20} /> {car.stock > 0 ? 'Add to Cart' : 'Unavailable'}
            </button>
            <Link 
              to={`/test-drive?car=${car._id}`}
              className="btn-secondary w-full py-3 flex items-center justify-center gap-2 text-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            >
              <Calendar size={20} /> Book Test Drive
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex items-start gap-4">
         <div className="bg-primary/10 p-3 rounded-full text-primary mt-1"><Info size={24} /></div>
         <div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Vehicle Description</h3>
            <p className="text-slate-600 leading-relaxed">
              Experience the pinnacle of automotive engineering with the {car.brand} {car.name}. Designed to dominate its class in the {car.category} segment, this vehicle comes equipped with a highly tuned {car.specs?.engine} engine and an optimized {car.specs?.transmission} transmission. Whether you prioritize pure performance or maximal comfort, it seamlessly transitions to meet your daily driving demands.
            </p>
         </div>
      </div>
    </div>
  );
};

export default CarDetail;
