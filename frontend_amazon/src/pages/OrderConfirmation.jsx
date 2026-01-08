import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';

function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center py-20 text-xl">Order not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow p-8 mb-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">Thank you for your order</p>
          <div className="bg-gray-50 rounded p-4 inline-block">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-2xl font-bold text-amazon-price">#{order.id}</p>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Order placed on {formatDate(order.created_at)}
          </p>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="text-gray-700">
            <p className="font-semibold">{order.shipping_address.full_name}</p>
            <p>{order.shipping_address.address}</p>
            <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
            <p>Pincode: {order.shipping_address.pincode}</p>
            <p>Phone: {order.shipping_address.phone}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-lg font-bold text-amazon-price mt-2">
                    {formatPrice(item.price_at_purchase)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amazon-price">
                    {formatPrice(item.price_at_purchase * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Order Total:</span>
              <span className="text-amazon-price">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-amazon-yellow hover:bg-amazon-lightyellow text-black font-semibold py-3 px-8 rounded-lg transition"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/orders" 
            className="bg-white hover:bg-gray-50 border border-gray-300 text-black font-semibold py-3 px-8 rounded-lg transition"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
