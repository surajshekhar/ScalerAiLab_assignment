import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCategories } from '../services/api';
import '../styles/Navbar.css';

function Navbar({ cartItemCount, user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">amazon</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </form>

        <div className="navbar-links">
          {/* User Account with Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="nav-link"
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              Hello, {user?.name || 'User'}<br />
              <span style={{ fontWeight: 'bold' }}>Account & Lists</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '5px',
                width: '250px',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000
              }}>
                <div style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{user?.name}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>{user?.email}</p>
                </div>
                <Link 
                  to="/orders" 
                  style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: 'black', borderBottom: '1px solid #f0f0f0' }}
                  onClick={() => setShowUserMenu(false)}
                >
                  Your Orders
                </Link>
                <Link 
                  to="/wishlist" 
                  style={{ display: 'block', padding: '12px 15px', textDecoration: 'none', color: 'black', borderBottom: '1px solid #f0f0f0' }}
                  onClick={() => setShowUserMenu(false)}
                >
                  Your Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#c45500',
                    fontWeight: 'bold'
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <Link to="/orders" className="nav-link">
            Returns<br />& Orders
          </Link>
          <Link to="/wishlist" className="nav-link">
            Your<br />Wishlist
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cartItemCount || 0}</span>
            <span>Cart</span>
          </Link>
        </div>
      </div>

      <div className="navbar-categories">
        <Link to="/" className="category-link">All</Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/?category=${category.id}`}
            className="category-link"
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div 
          onClick={() => setShowUserMenu(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
    </nav>
  );
}

export default Navbar;
