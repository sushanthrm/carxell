import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, ChevronRight } from 'lucide-react';
import { getCarImage } from '../utils/getCarImage';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    { label: 'All Types', value: '' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'Hatchback', value: 'Hatchback' },
    { label: 'Truck', value: 'Truck' },
  ];

  useEffect(() => {
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
    fetchCars();
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-6">Popular Cars By Budget</h1>
        
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
    </div>
  );
};

export default CarList;
