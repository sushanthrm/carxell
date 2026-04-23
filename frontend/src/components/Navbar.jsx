import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Car, User, LogOut, ShoppingCart, ChevronDown, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const cartItemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const navLinks = [
    { name: 'Browse Cars', path: '/cars' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Service', path: '/service' }
  ];

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3 px-6 md:px-12' : 'bg-gradient-to-b from-black/70 to-transparent py-5 px-6 md:px-12 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary font-black tracking-widest text-xl md:text-2xl uppercase drop-shadow-sm hover:scale-105 transition-transform">
          <Car className="text-primary" /> CARXELL
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-sm font-semibold tracking-wide transition-all duration-300 relative group ${location.pathname === link.path ? 'text-primary' : 'text-white/90 hover:text-primary'}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full transition-transform origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <Link to="/cart" className="relative text-white/90 hover:text-primary transition-transform hover:scale-110">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-fade-in">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 rounded-full py-1.5 px-4 border border-white/20 shadow-sm cursor-pointer"
                >
                  <User size={16} className="text-primary" />
                  <span className="text-sm font-bold text-white">{user.name}</span>
                  <ChevronDown size={16} className={`text-white/70 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-fade-in origin-top-right backdrop-blur-xl" onMouseLeave={() => setDropdownOpen(false)}>
                    <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/5">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Signed in as</div>
                      <div className="text-sm font-bold text-white truncate">{user.email}</div>
                    </div>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-primary/20 hover:text-primary transition-colors">
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-primary/20 hover:text-primary transition-colors">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <div className="px-3 my-1"><div className="h-px bg-white/10 w-full"></div></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="py-2 px-5 text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white hover:text-slate-900 transition-all shadow-sm hover:shadow-md">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm hidden sm:block">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
