import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import { getCart } from './services/api';

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const fetchCartCount = async () => {
    if (!user) return;
    
    try {
      const response = await getCart(user.id);
      const count = response.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartItemCount(0);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar cartItemCount={cartItemCount} user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />
          
          <Route path="/" element={user ? <Home updateCartCount={fetchCartCount} userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={user ? <ProductDetail updateCartCount={fetchCartCount} userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <Cart updateCartCount={fetchCartCount} userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <Checkout updateCartCount={fetchCartCount} userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/order-confirmation/:orderId" element={user ? <OrderConfirmation /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/wishlist" element={user ? <Wishlist updateCartCount={fetchCartCount} userId={user.id} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
