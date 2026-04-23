import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Service = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile_no: '',
    email: '',
    car_model: '',
    req_service: '',
    date: '',
    pick_drop: false
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', formData);
      setMsg({ type: 'success', text: 'Service requested successfully! We will contact you soon.' });
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to request service.' });
    }
  };

  return (
    <div className="relative min-h-screen -mt-28 pt-28 pb-16 flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=2000" alt="Car Repairing" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase text-center mb-2">Book a Service</h2>
        <p className="text-center text-slate-500 mb-8 font-medium">Keep your vehicle at peak performance.</p>

        {msg.text && (
          <div className={`p-4 rounded-lg font-bold text-center mb-6 border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Mobile No.</label>
            <input type="text" name="mobile_no" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input type="email" name="email" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
          </div>

          <div>
            <label className="label">Car Model</label>
            <input type="text" name="car_model" placeholder="e.g. Maruti Suzuki Vitara" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
          </div>

          <div>
             <label className="label">Type of Service</label>
             <select name="req_service" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange}>
                <option value="">-- Select Service --</option>
                <option value="General Servicing">General Servicing</option>
                <option value="Engine Oil Change">Engine Oil Change</option>
                <option value="Brake Inspection/Repair">Brake Inspection/Repair</option>
                <option value="Wheel Alignment">Wheel Alignment</option>
                <option value="Equipment Check (Wipers/Lights)">Equipment Check</option>
             </select>
          </div>

          <div>
            <label className="label">Preferred Date</label>
            <input type="date" name="date" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
          </div>

          <div className="flex items-center gap-2 bg-slate-50/80 p-4 border border-slate-200 rounded-lg">
            <input type="checkbox" id="pick_drop" name="pick_drop" className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" onChange={handleChange} />
            <label htmlFor="pick_drop" className="text-sm font-bold text-slate-700 select-none cursor-pointer">Require Pick up and Drop off?</label>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg uppercase tracking-widest mt-4 shadow-lg">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Service;
