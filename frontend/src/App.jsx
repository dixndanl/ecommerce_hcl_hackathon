import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ReviewPage from './pages/ReviewPage';
import OrderConfirmation from './pages/OrderConfirmation';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = React.useState(() => JSON.parse(localStorage.getItem('user')));

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
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/" element={<Navigate to="/products" />} />
      </Routes>
    </>
  );
}

export default App;
