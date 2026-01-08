import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, createOrder } from '../services/api';

function Checkout({ updateCartCount, userId }) {
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCart(userId);
      setCartData(response.data);
      if (response.data.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handlePlaceOrder = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.full_name || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.phone) {
    alert('Please fill all fields');
    return;
  }

  try {
    // Format shipping address as a string
    const shippingAddress = `${formData.full_name}\n${formData.address}\n${formData.city}, ${formData.state} - ${formData.pincode}\nPhone: ${formData.phone}`;
    
    const response = await createOrder(userId, shippingAddress);  // Send string, not object
    alert('Order placed successfully!');
    updateCartCount();
    navigate(`/order-confirmation/${response.data.id}`);  // Changed: order_id → id
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order');
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
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
              
              <form onSubmit={handlePlaceOrder}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        pattern="[0-9]{6}"
                        maxLength="6"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        maxLength="10"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amazon-orange"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-amazon-yellow hover:bg-amazon-lightyellow text-black font-semibold py-3 px-4 rounded-lg transition"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cartData.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="flex-1">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Items ({cartData.items.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                <span className="font-semibold">{formatPrice(cartData.total)}</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Shipping:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Order Total:</span>
                <span className="font-bold text-amazon-price">{formatPrice(cartData.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
