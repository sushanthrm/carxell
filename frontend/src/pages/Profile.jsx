import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Phone, KeyRound } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto my-10">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
         
         <div className="bg-slate-50 md:w-1/3 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 mb-4">
               <User size={40} className="text-primary" />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{user.name}</h2>
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-rose-100 text-rose-700' : user.role === 'salesperson' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
               {user.role} Status
            </div>
         </div>

         <div className="p-8 md:w-2/3 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6">Account Details</h3>
            
            <div className="space-y-6">
               <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-slate-50 rounded flex items-center justify-center border border-slate-100 text-slate-400">
                     <User size={20} />
                  </div>
                  <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</div>
                     <div className="font-semibold text-slate-700">{user.name}</div>
                  </div>
               </div>

               <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-slate-50 rounded flex items-center justify-center border border-slate-100 text-slate-400">
                     <Mail size={20} />
                  </div>
                  <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</div>
                     <div className="font-semibold text-slate-700">{user.email}</div>
                  </div>
               </div>

               <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-slate-50 rounded flex items-center justify-center border border-slate-100 text-slate-400">
                     <Phone size={20} />
                  </div>
                  <div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile Number</div>
                     <div className="font-semibold text-slate-700">+1 (555) 000-0000 <span className="text-[10px] text-slate-400 normal-case ml-2">(Mock DB Value)</span></div>
                  </div>
               </div>
            </div>

            <div className="mt-10 border-t border-slate-100 pt-6">
               <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg">
                  <KeyRound size={16} /> Change Password
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
