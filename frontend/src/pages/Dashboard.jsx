import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/analytics').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="text-slate-500 font-medium">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-6 border-l-4 border-l-primary shadow-sm">
          <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-2">Total Sales Revenue</h3>
          <div className="text-4xl font-light text-slate-800">${data.salesSummary?.totalRevenue?.toLocaleString() || 0}</div>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-secondary shadow-sm">
          <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-2">Total Units Sold</h3>
          <div className="text-4xl font-light text-slate-800">{data.salesSummary?.totalSales || 0} Units</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 h-80 shadow-sm">
          <h3 className="mb-6 font-bold text-slate-800 text-lg uppercase tracking-wide">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.revenueOverTime}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip wrapperStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="revenue" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="glass-panel p-6 shadow-sm">
          <h3 className="mb-6 font-bold text-slate-800 text-lg uppercase tracking-wide">Most Popular Cars</h3>
          <div className="space-y-4">
            {data.topCars?.map((car, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <div className="font-semibold text-slate-700">{car.brand} {car.name}</div>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{car.count} Sold</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 shadow-sm">
         <h3 className="mb-6 font-bold text-slate-800 text-lg uppercase tracking-wide border-b border-slate-200 pb-4">High Intent Customers</h3>
         {data.highIntentUsers?.length === 0 ? <p className="text-slate-500">No high intent customers mapped yet.</p> : (
            <table className="w-full text-left">
              <thead><tr className="text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200"><th className="pb-3 font-semibold">Name</th><th className="pb-3 font-semibold">Email</th><th className="pb-3 font-semibold">Views</th><th className="pb-3 font-semibold">Test Drives</th></tr></thead>
              <tbody>
                {data.highIntentUsers?.map(user => (
                  <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-3 font-medium text-slate-700">{user.name}</td>
                    <td className="py-3 text-slate-500">{user.email}</td>
                    <td className="py-3 font-semibold text-slate-700">{user.views}</td>
                    <td className="py-3 font-semibold text-primary">{user.test_drives}</td>
                  </tr>
                ))}
              </tbody>
            </table>
         )}
      </div>
    </div>
  );
};

const SalesDashboard = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    api.get('/bookings').then(res => setBookings(res.data)).catch(console.error);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
    } catch (e) {
      alert('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 shadow-sm">
        <h3 className="mb-6 font-bold text-slate-800 text-lg uppercase tracking-wide border-b border-slate-200 pb-4">Manage Test Drives</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
              <th className="pb-3 font-semibold">Car</th><th className="pb-3 font-semibold">Customer</th><th className="pb-3 font-semibold">Date/Time</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="py-4 font-medium text-slate-700">{b.car_id?.brand} {b.car_id?.name}</td>
                <td className="py-4 text-slate-600">{b.customer_id?.name}</td>
                <td className="py-4 text-slate-600 font-medium">{b.date} <span className="text-slate-400">at</span> {b.time}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-indigo-100 text-indigo-700' : b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : b.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="py-4">
                  {b.status === 'pending' && (
                    <div className="flex gap-2">
                       <button onClick={() => updateStatus(b._id, 'confirmed')} className="text-xs font-bold bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition text-indigo-700 px-3 py-1.5 rounded uppercase">Confirm</button>
                       <button onClick={() => updateStatus(b._id, 'cancelled')} className="text-xs font-bold bg-rose-50 border border-rose-200 hover:bg-rose-100 transition text-rose-700 px-3 py-1.5 rounded uppercase">Cancel</button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                     <button onClick={() => updateStatus(b._id, 'completed')} className="text-xs font-bold bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition text-emerald-700 px-3 py-1.5 rounded uppercase">Complete</button>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-slate-500 font-medium">No bookings available.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data)).catch(console.error);
    api.get('/bookings/my').then(res => setBookings(res.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 shadow-sm border-l-4 border-l-primary">
        <h3 className="mb-4 font-bold text-slate-800 text-lg uppercase tracking-wide border-b border-slate-200 pb-3">My Test Drives</h3>
        {bookings.length === 0 ? <p className="text-slate-500">You haven't booked any test drives.</p> : (
          <div className="space-y-3">
             {bookings.map(b => (
                <div key={b._id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg">
                   <div>
                     <div className="font-bold text-slate-800 text-lg">{b.car_id?.brand} {b.car_id?.name}</div>
                     <div className="text-sm font-medium text-slate-500 mt-1"><Calendar className="inline w-4 h-4 mr-1 text-slate-400"/>{b.date} at {b.time}</div>
                   </div>
                   <div className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-indigo-100 text-indigo-700' : b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                     {b.status}
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>

      <div className="glass-panel p-6 shadow-sm border-l-4 border-l-secondary">
        <h3 className="mb-6 font-bold text-slate-800 text-lg uppercase tracking-wide border-b border-slate-200 pb-3">My Purchases</h3>
        {orders.length === 0 ? <p className="text-slate-500">You haven't purchased any cars yet.</p> : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {orders.map(o => (
                <div key={o._id} className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm p-6 rounded-lg relative overflow-hidden">
                   <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">Paid in Full</div>
                   <div className="font-black text-xl text-slate-800 mb-1">{o.car_id?.brand} {o.car_id?.name}</div>
                   <div className="text-3xl font-light text-primary mb-4">${o.price.toLocaleString()}</div>
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-3">Order Ref: {o._id}</div>
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  let bgImage = '';
  if (user.role === 'admin') {
     // Very clean, dark minimalist architectural/tech vibe for Admin
     bgImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000'; 
  } else if (user.role === 'salesperson') {
     // Clean, modern cars lined up in a showroom
     bgImage = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000';
  } else {
     // Sleek luxury car on the road for Customer
     bgImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000';
  }

  return (
    <div className="relative min-h-screen -mt-28 pt-36 pb-16 px-4 md:px-8">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0 fixed">
        <img src={bgImage} alt="Dashboard Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-10 pl-4 border-l-4 border-l-primary bg-white/10 backdrop-blur-md py-3 pr-6 inline-block rounded-r-xl border border-white/10 shadow-lg">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Welcome, {user.name}</h1>
          <p className="text-primary font-bold uppercase tracking-widest text-sm mt-1">{user.role} Dashboard</p>
        </div>

        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'salesperson' && <SalesDashboard />}
        {user.role === 'customer' && <CustomerDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
