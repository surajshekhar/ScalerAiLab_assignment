import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart } from '../services/api';

function Cart({ updateCartCount, userId }) {
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await getCart(userId);
      setCartData(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    await updateCartItem(cartItemId, newQuantity);
    fetchCart();
    updateCartCount();
  };

  const handleRemove = async (cartItemId) => {
    await removeFromCart(cartItemId);
    fetchCart();
    updateCartCount();
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="py-20 text-center text-lg">Loading cart...</div>
    );
  }

  if (cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#EAEDED] py-16">
        <div className="mx-auto max-w-4xl rounded bg-white p-10 shadow">
          <h2 className="text-2xl font-semibold">Your Amazon Cart is empty</h2>
          <p className="mt-2 text-gray-600">Shop today’s deals</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded bg-[#FFD814] px-6 py-2 font-semibold hover:bg-[#F7CA00]"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = cartData.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#EAEDED] py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LEFT: Cart Items */}
          <div className="lg:col-span-2 bg-white p-6">
            <div className="flex justify-between border-b pb-3">
              <h1 className="text-2xl font-medium">Shopping Cart</h1>
              <span className="text-sm text-gray-500">Price</span>
            </div>

            {cartData.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[120px_1fr_120px] gap-4 border-b py-6"
              >
                {/* Image */}
                <Link to={`/product/${item.product_id}`}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-28 w-28 object-contain"
                  />
                </Link>

                {/* Details */}
                <div>
                  <Link
                    to={`/product/${item.product_id}`}
                    className="text-lg font-medium hover:text-[#C45500]"
                  >
                    {item.name}
                  </Link>

                  <p className={`mt-1 text-sm ${item.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <div className="flex items-center rounded border px-2 py-1">
                      <span className="mr-1 text-gray-600">Qty:</span>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, Number(e.target.value))
                        }
                        className="bg-transparent font-semibold outline-none"
                      >
                        {[...Array(Math.min(10, item.stock))].map((_, i) => (
                          <option key={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>

                    <span className="h-4 w-px bg-gray-300" />

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-[#007185] hover:text-[#C45500]"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right font-semibold">
                  {formatPrice(item.price)}
                </div>
              </div>
            ))}

            <div className="pt-4 text-right text-lg">
              Subtotal ({itemCount} items):{' '}
              <span className="font-semibold">
                {formatPrice(cartData.total)}
              </span>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <aside className="sticky top-20 h-fit bg-white p-6 shadow">
            <p className="text-lg">
              Subtotal ({itemCount} items):{' '}
              <span className="font-semibold">
                {formatPrice(cartData.total)}
              </span>
            </p>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-4 w-full rounded bg-[#FFD814] py-2 font-semibold hover:bg-[#F7CA00]"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="mt-3 block text-center text-sm text-[#007185] hover:text-[#C45500]"
            >
              Continue Shopping
            </Link>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default Cart;
