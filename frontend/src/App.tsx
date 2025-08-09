import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';

export interface User {
  email: string;
  password: string;
  orders?: any[];
}

function App() {
  const [user, setUser] = React.useState<User | null>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/products" element={<Products user={user} />} />
        <Route path="/cart" element={<Cart user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/orders" element={<Orders user={user} />} />
        <Route path="/" element={<Navigate to="/products" />} />
      </Routes>
    </>
  );
}

export default App;
