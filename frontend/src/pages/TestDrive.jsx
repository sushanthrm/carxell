import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TestDrive = () => {
  const [searchParams] = useSearchParams();
  const prefilledCarId = searchParams.get('car');
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    car_id: prefilledCarId || '',
    branch: '',
    date: '',
    time: ''
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/cars').then(res => setCars(res.data.cars)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', { 
        car_id: formData.car_id, 
        date: formData.date, 
        time: formData.time 
        // Our backend implicitly uses the token for identity, but wireframe asks for name/email
      });
      setMsg({ type: 'success', text: 'Test drive booked successfully! Redirecting to dashboard...' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to book test drive.' });
    }
  };

  return (
    <div className="relative min-h-screen -mt-28 pt-28 pb-16 flex items-center justify-center px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1516570128919-4b68e98bc36d?auto=format&fit=crop&q=80&w=2000" alt="Person Driving" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase text-center mb-2">Book a Test Drive</h2>
        <p className="text-center text-slate-500 mb-8 font-medium">Experience precision firsthand.</p>

        {msg.text && (
          <div className={`p-4 rounded-lg font-bold text-center mb-6 border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="label">First Name</label>
               <input type="text" name="first_name" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
             </div>
             <div>
               <label className="label">Last Name</label>
               <input type="text" name="last_name" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
             </div>
          </div>
          
          <div>
            <label className="label">Email Address</label>
            <input type="email" name="email" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
          </div>

          <div>
             <label className="label">Select Car Model</label>
             <select name="car_id" className="input-field bg-white/80 focus:bg-white" required value={formData.car_id} onChange={handleChange}>
                <option value="">-- Choose a Car --</option>
                {cars.map(c => <option key={c._id} value={c._id}>{c.brand} {c.name}</option>)}
             </select>
          </div>

          <div>
             <label className="label">Select Branch</label>
             <select name="branch" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange}>
                <option value="">-- Choose a Facility --</option>
                <option value="downtown">Downtown Metro Branch</option>
                <option value="uptown">Uptown Valley Branch</option>
                <option value="airport">Airport Hub</option>
             </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="label">Preferred Date</label>
                <input type="date" name="date" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
             </div>
             <div>
                <label className="label">Preferred Time (Approx)</label>
                <input type="time" name="time" className="input-field bg-white/80 focus:bg-white" required onChange={handleChange} />
             </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg uppercase tracking-widest mt-4 shadow-lg">
            Submit Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestDrive;
