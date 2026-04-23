import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getAccessoryImage } from '../utils/getAccessoryImage';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Plus, Edit2, Trash2, X } from 'lucide-react';

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'interior', price: '', stock: '', image_url: '', description: '' });

  const fetchAccessories = () => {
    setLoading(true);
    api.get('/accessories').then(res => {
      setAccessories(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      try {
        await api.delete(`/accessories/${id}`);
        setAccessories(accessories.filter(a => a._id !== id));
      } catch (err) {
        alert('Failed to delete accessory');
      }
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: Number(formData.price), stock: Number(formData.stock) };
      if (editingItem) {
        await api.put(`/accessories/${editingItem._id}`, payload);
      } else {
        await api.post('/accessories', payload);
      }
      setShowModal(false);
      fetchAccessories();
    } catch (err) {
      alert('Operation failed. Check inputs.');
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'interior', price: '', stock: '', image_url: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingItem(item);
    setFormData({ name: item.name, category: item.category, price: item.price, stock: item.stock, image_url: item.image_url || '', description: item.description || '' });
    setShowModal(true);
  };

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
                 {user?.role === 'admin' && (
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      <button onClick={(e) => openEditModal(e, item)} className="bg-white/80 backdrop-blur text-slate-700 p-2 rounded-full shadow hover:bg-white transition hover:text-indigo-600"><Edit2 size={14} /></button>
                      <button onClick={(e) => handleDelete(e, item._id)} className="bg-white/80 backdrop-blur text-slate-700 p-2 rounded-full shadow hover:bg-white transition hover:text-rose-600"><Trash2 size={14} /></button>
                    </div>
                 )}
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
           <p className="text-slate-300 font-medium max-w-xl mx-auto text-lg drop-shadow mb-8">Customize your vehicle with certified Carxell compatible parts and merchandise.</p>
           {user?.role === 'admin' && (
             <button onClick={openAddModal} className="btn-primary py-3 px-8 flex items-center gap-2 mx-auto shadow-xl hover:scale-105 transition-transform">
               <Plus size={20} /> Add New Accessory
             </button>
           )}
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

      {/* Admin Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">
            <div className="bg-white/90 backdrop-blur border-b border-slate-100 p-6 flex justify-between items-center rounded-t-2xl">
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">{editingItem ? 'Edit Accessory' : 'Add New Accessory'}</h2>
               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition"><X size={24} /></button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Name</label>
                   <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Leather Seat Covers" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                   <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                     <option value="interior">Interior</option>
                     <option value="exterior">Exterior</option>
                     <option value="spare_parts">Spare Parts</option>
                     <option value="merchandise">Merchandise</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price ($)</label>
                   <input type="number" required min="0" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="150" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Quantity</label>
                   <input type="number" required min="0" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="20" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
                   <input type="text" className="input-field" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                   <textarea className="input-field min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description..."></textarea>
                 </div>
               </div>

               <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
                 <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition uppercase tracking-wider text-sm">Cancel</button>
                 <button type="submit" className="btn-primary py-3 px-8 text-sm uppercase tracking-wider shadow-md">{editingItem ? 'Save Changes' : 'Create Accessory'}</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accessories;
