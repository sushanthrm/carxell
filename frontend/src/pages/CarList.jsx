import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, ChevronRight, Edit2, Trash2, Plus, X } from 'lucide-react';
import { getCarImage } from '../utils/getCarImage';
import { AuthContext } from '../context/AuthContext';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { user } = useContext(AuthContext);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({ name: '', brand: '', category: 'SUV', price: '', stock: '', image_url: '', engine: '', range_or_mileage: '', transmission: '' });

  const categories = [
    { label: 'All Types', value: '' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'Hatchback', value: 'Hatchback' },
    { label: 'Truck', value: 'Truck' },
  ];

  const fetchCars = async () => {
    setLoading(true);
    let url = `/cars?brand=${search}`;
    if (category) url += `&category=${category}`;
    try {
      const res = await api.get(url);
      setCars(res.data.cars);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [search, category]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await api.delete(`/cars/${id}`);
        setCars(cars.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to delete car');
      }
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name, brand: formData.brand, category: formData.category, price: Number(formData.price), stock: Number(formData.stock), image_url: formData.image_url,
        specs: { engine: formData.engine, range_or_mileage: formData.range_or_mileage, transmission: formData.transmission }
      };

      if (editingCar) {
        await api.put(`/cars/${editingCar._id}`, payload);
      } else {
        await api.post('/cars', payload);
      }
      setShowModal(false);
      fetchCars(); // refresh list
    } catch (err) {
      alert('Operation failed. Check inputs.');
    }
  };

  const openAddModal = () => {
    setEditingCar(null);
    setFormData({ name: '', brand: '', category: 'SUV', price: '', stock: '', image_url: '', engine: '', range_or_mileage: '', transmission: '' });
    setShowModal(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name, brand: car.brand, category: car.category, price: car.price, stock: car.stock, image_url: car.image_url || '',
      engine: car.specs?.engine || '', range_or_mileage: car.specs?.range_or_mileage || '', transmission: car.specs?.transmission || ''
    });
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="mb-8 mt-8 flex flex-col md:flex-row md:items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-6 md:mb-0">Popular Cars By Budget</h1>
        {user?.role === 'admin' && (
           <button onClick={openAddModal} className="btn-primary py-2 px-6 flex items-center gap-2 shadow-lg mb-6 md:mb-0 w-max">
             <Plus size={18} /> Add New Car
           </button>
        )}
      </div>
        
      {/* Category Pills & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  category === cat.value
                    ? 'border-teal-600 text-teal-700 bg-teal-50'
                    : 'border-slate-300 text-slate-600 hover:border-teal-600 hover:text-teal-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search brand"
              className="w-full bg-white border border-slate-300 rounded-full pl-12 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading cars...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300">
              <div className="relative bg-white aspect-[4/3] flex items-center justify-center p-4">
                <img src={getCarImage(car)} alt={car.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                {car.stock <= 3 && (
                  <span className="absolute top-3 right-3 bg-slate-100 text-slate-600 border border-slate-200 shadow-sm text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">Only {car.stock} left</span>
                )}
                {user?.role === 'admin' && (
                  <div className="absolute top-3 left-3 flex gap-2">
                    <button onClick={() => openEditModal(car)} className="bg-white/80 backdrop-blur text-slate-700 p-2 rounded-full shadow hover:bg-white transition hover:text-indigo-600"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(car._id)} className="bg-white/80 backdrop-blur text-slate-700 p-2 rounded-full shadow hover:bg-white transition hover:text-rose-600"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow flex flex-col border-t border-slate-50">
                <h3 className="text-lg font-bold text-slate-800 mb-1">{car.name}</h3>
                <div className="text-[15px] font-medium text-slate-600 mb-4">${car.price.toLocaleString()}</div>

                <Link
                  to={`/cars/${car._id}`}
                  className="mt-auto text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors"
                >
                  View Price Breakup
                </Link>
              </div>
            </div>
          ))}
          {cars.length === 0 && <div className="col-span-full text-center py-20 text-slate-500 font-medium">No cars found matching your criteria.</div>}
        </div>
      )}

      {/* Admin Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-slate-100 p-6 flex justify-between items-center z-10">
               <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
               <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition"><X size={24} /></button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Brand</label>
                   <input type="text" required className="input-field" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="e.g. Tesla" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Model Name</label>
                   <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Model S" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                   <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                     {categories.filter(c => c.value !== '').map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price ($)</label>
                   <input type="number" required min="0" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="80000" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Quantity</label>
                   <input type="number" required min="0" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="5" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
                   <input type="text" className="input-field" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                 </div>
               </div>

               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 pt-4">Specifications</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Engine</label>
                   <input type="text" className="input-field" value={formData.engine} onChange={e => setFormData({...formData, engine: e.target.value})} placeholder="Electric" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Range/Mileage</label>
                   <input type="text" className="input-field" value={formData.range_or_mileage} onChange={e => setFormData({...formData, range_or_mileage: e.target.value})} placeholder="400 miles" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transmission</label>
                   <input type="text" className="input-field" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} placeholder="Automatic" />
                 </div>
               </div>

               <div className="pt-6 flex justify-end gap-4">
                 <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition uppercase tracking-wider text-sm">Cancel</button>
                 <button type="submit" className="btn-primary py-3 px-8 text-sm uppercase tracking-wider shadow-md">{editingCar ? 'Save Changes' : 'Create Car'}</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
