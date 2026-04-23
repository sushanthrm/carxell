import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CarList from './pages/CarList';
import CarDetail from './pages/CarDetail';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Payments from './pages/Payments';
import TestDrive from './pages/TestDrive';
import Service from './pages/Service';
import Accessories from './pages/Accessories';
import AccessoryDetail from './pages/AccessoryDetail';
import Navbar from './components/Navbar';
import './index.css';


const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10 text-slate-500 font-medium text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className={`flex-grow ${!isHome ? 'pt-28 pb-12' : 'pb-8'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/accessories/:id" element={<AccessoryDetail />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/test-drive" element={<ProtectedRoute><TestDrive /></ProtectedRoute>} />
          <Route path="/service" element={<ProtectedRoute><Service /></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['admin', 'salesperson', 'customer']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <BrowserRouter>
//           <AppRoutes />
//         </BrowserRouter>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

function App() {
  useEffect(() => {
    document.title = "Carxell"; // This changes the browser tab name
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;
