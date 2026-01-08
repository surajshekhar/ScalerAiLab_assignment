import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist, addToCart } from '../services/api';

function Wishlist({ updateCartCount, userId }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist(userId);
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
    setLoading(false);
  };

  const handleRemove = async (wishlistItemId) => {
    try {
      await removeFromWishlist(wishlistItemId);
      fetchWishlist();
      alert('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId, wishlistItemId) => {
    try {
      await addToCart(userId, productId, 1);  // CHANGED: Use userId instead of 1
      await removeFromWishlist(wishlistItemId);
      fetchWishlist();
      updateCartCount();
      alert('Item moved to cart!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading wishlist...</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-6">Add items to your wishlist to save them for later</p>
        <Link 
          to="/" 
          className="bg-amazon-yellow hover:bg-amazon-lightyellow px-8 py-3 rounded-lg font-semibold inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
              <Link to={`/product/${item.product_id}`}>
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              </Link>
              
              <Link to={`/product/${item.product_id}`}>
                <h3 className="text-amazon-link hover:text-amazon-orange font-semibold text-sm mb-2 line-clamp-2">
                  {item.name}
                </h3>
              </Link>
              
              <p className="text-xl font-bold text-amazon-price mb-2">
                {formatPrice(item.price)}
              </p>
              
              <p className="text-sm text-gray-600 mb-3">{item.category_name}</p>
              
              {item.stock > 0 ? (
                <p className="text-green-600 text-sm mb-3">In Stock</p>
              ) : (
                <p className="text-red-600 text-sm mb-3">Out of Stock</p>
              )}
              
              <div className="space-y-2">
                <button
                  onClick={() => handleAddToCart(item.product_id, item.id)}
                  disabled={item.stock === 0}
                  className="w-full bg-amazon-yellow hover:bg-amazon-lightyellow disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  Add to Cart
                </button>
                
                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-black font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
