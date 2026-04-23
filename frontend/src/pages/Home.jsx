import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ChevronRight } from 'lucide-react';
import { getCarImage } from '../utils/getCarImage';

const Home = () => {
  const [popularCars, setPopularCars] = useState([]);

  useEffect(() => {
    // Fetch a couple of cars to simulate "Popular Cars" 
    api.get('/cars?limit=4').then(res => setPopularCars(res.data.cars || [])).catch(console.error);
  }, []);

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-slate-900">
        <img
          src="/homepage.jpg"
          alt="Luxury Car"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          style={{ filter: 'brightness(0.8) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 text-left max-w-7xl mx-auto w-full z-10 animate-slide-up">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary font-bold text-sm tracking-widest uppercase">
            Elevate Your Journey
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter drop-shadow-xl mb-2 leading-tight">
            EXPERIENCE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">THE LUXURY</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-2xl font-light tracking-wide max-w-xl mt-6 mb-10 leading-relaxed">
            Discover a curated collection of the world's most prestigious vehicles, engineered for perfection.
          </p>
          <div className="flex gap-4">
            <Link to="/cars" className="bg-primary hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:-translate-y-1">
              Explore Collection
            </Link>
            <Link to="/test-drive" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-1">
              Book Test Drive
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 space-y-24">
        {/* Popular Cars Section */}
        <div>
          <div className="flex justify-between items-end border-b border-slate-200/60 pb-6 mb-10">
            <div>
              <h4 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Featured</h4>
              <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Popular Models</h3>
            </div>
            <Link to="/cars" className="group flex items-center gap-2 text-slate-600 font-bold hover:text-primary transition-colors text-sm mb-2">
              View Collection <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCars.slice(0, 4).map((car, index) => (
              <div key={car._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative bg-white aspect-[4/3] flex items-center justify-center p-4">
                  <img src={getCarImage(car)} alt={car.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  {car.stock <= 3 && (
                    <span className="absolute top-3 right-3 bg-slate-100 text-slate-600 border border-slate-200 shadow-sm text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">Only {car.stock} left</span>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col border-t border-slate-50">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{car.name}</h3>
                  <div className="text-[15px] font-medium text-slate-600 mb-4">${car.price?.toLocaleString()}</div>

                  <Link
                    to={`/cars/${car._id}`}
                    className="mt-auto text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors"
                  >
                    View Price Breakup
                  </Link>
                </div>
              </div>
            ))}
            {popularCars.length === 0 && <p className="text-slate-500 font-medium col-span-full">Loading premium collection...</p>}
          </div>
        </div>

        {/* More from Carxell Action Navigation */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h4 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Services</h4>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">The Carxell Experience</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/accessories" className="relative overflow-hidden rounded-2xl p-8 flex flex-col items-center justify-center text-center group transition-all duration-500 min-h-[300px] shadow-sm hover:shadow-2xl hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1600712242805-5f78671b24da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Accessories" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20 group-hover:via-slate-900/70 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col items-center mt-auto pt-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg mb-6 border border-white/20 group-hover:bg-primary group-hover:border-primary transition duration-500 text-2xl -rotate-6 group-hover:rotate-0">🛠️</div>
                <h4 className="font-black text-white uppercase tracking-widest text-xl mb-3">Parts & Accessories</h4>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">Customize your ride with our premium selection of official OEM parts.</p>
              </div>
            </Link>

            <Link to="/service" className="relative overflow-hidden rounded-2xl p-8 flex flex-col items-center justify-center text-center group transition-all duration-500 min-h-[300px] shadow-sm hover:shadow-2xl hover:-translate-y-2">
              <img src="https://images.unsplash.com/photo-1615906655593-ad0386982a0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Book Service" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20 group-hover:via-slate-900/70 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col items-center mt-auto pt-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg mb-6 border border-white/20 group-hover:bg-secondary group-hover:border-secondary transition duration-500 text-2xl rotate-3 group-hover:rotate-0">📅</div>
                <h4 className="font-black text-white uppercase tracking-widest text-xl mb-3">Official Service</h4>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">Schedule certified maintenance and preserve your vehicle's legacy.</p>
              </div>
            </Link>

            <Link to="/test-drive" className="relative overflow-hidden rounded-2xl p-8 flex flex-col items-center justify-center text-center group transition-all duration-500 min-h-[300px] shadow-sm hover:shadow-2xl hover:-translate-y-2">
               <img src="https://images.unsplash.com/photo-1469285994282-454ceb49e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Test Drive" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20 group-hover:via-slate-900/70 transition-colors duration-500"></div>
              <div className="relative z-10 flex flex-col items-center mt-auto pt-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg mb-6 border border-white/20 group-hover:bg-accent group-hover:border-accent transition duration-500 text-2xl -rotate-3 group-hover:rotate-0">🔑</div>
                <h4 className="font-black text-white uppercase tracking-widest text-xl mb-3">Test Drive</h4>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">Experience the thrill firsthand. Book your personalized test drive today.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
