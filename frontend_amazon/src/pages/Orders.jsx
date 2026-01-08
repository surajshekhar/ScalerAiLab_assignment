import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services/api';

function Orders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders(userId);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [userId]);

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
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
        <Link
          to="/"
          className="bg-amazon-yellow hover:bg-amazon-lightyellow px-8 py-3 rounded-lg font-semibold inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Placed</p>
                    <p className="font-semibold">{formatDate(order.created_at)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold text-amazon-price">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-semibold">{order.item_count}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">#{order.id}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="text-amazon-link hover:text-amazon-orange font-semibold text-sm"
                  >
                    View Order Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Orders;
