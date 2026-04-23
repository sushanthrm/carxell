import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Car } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();
  const { login } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      
      const pendingItem = localStorage.getItem('pending_cart_item');
      if (pendingItem) {
        addToCart(JSON.parse(pendingItem));
        localStorage.removeItem('pending_cart_item');
        navigate('/cart');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row w-full min-h-screen">
      
      {/* Left Side (30%): Visible Image Area */}
      <div className="hidden md:block md:w-[30%] relative h-auto min-h-screen">
        <img 
          src="/login_image.png" 
          alt="Carxell Dealership" 
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1562141960-9d846399bd66?auto=format&fit=crop&q=80&w=1000";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
        
        {/* Optional Tagline over Image */}
        <div className="absolute bottom-12 left-8 right-8 z-10 text-center">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="bg-primary p-3 rounded-full text-white shadow-lg">
              <Car size={32} />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-md">Carxell</h1>
          </div>
        </div>
      </div>

      {/* Right Side (70%): Form Area with logo background */}
      <div className="md:w-[70%] w-full flex items-center justify-center p-6 lg:p-12 relative bg-slate-900">
        
        {/* Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <img src="/logo.png" alt="Carxell Logo" className="w-[60%] object-contain" />
        </div>

        <div className="w-full max-w-md relative z-10">
          
          {/* Logo for mobile view only */}
          <div className="flex md:hidden items-center gap-3 mb-10">
            <div className="bg-primary/20 p-3 rounded-full text-primary">
              <Car size={32} />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest">Carxell</h1>
          </div>

          <h2 className="text-3xl font-black text-white mb-2 tracking-wide uppercase">Welcome Back</h2>
          <p className="text-slate-400 font-medium mb-8 text-lg">Please sign in to your account.</p>
          
          {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8 text-sm font-bold">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label text-xs font-bold text-slate-400">EMAIL ADDRESS *</label>
              <input 
                type="email" 
                className="input-field bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-primary text-lg py-3 backdrop-blur-sm" 
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label text-xs font-bold text-slate-400">PASSWORD *</label>
              <input 
                type="password" 
                className="input-field bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-primary text-lg py-3 backdrop-blur-sm" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-4 mt-6 shadow-xl text-lg tracking-widest uppercase hover:scale-[1.02] transition-transform">
              Sign In
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-slate-400 font-medium text-base">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:text-primary-light hover:underline transition-all ml-2">Register here</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
