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
    <div className="flex justify-center items-center mt-10 px-4">
      <div className="glass-panel p-8 w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <Car size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 text-center mb-6 tracking-wide uppercase">Sign In to Carxell</h2>
        
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg mb-4 text-sm text-center font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-2 hidden sm:block">Sign In</button>
          <button type="submit" className="btn-primary w-full mt-2 sm:hidden">Sign In</button>
        </form>
        
        <p className="text-slate-500 font-medium text-sm text-center mt-6">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
