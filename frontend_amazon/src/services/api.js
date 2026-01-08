import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Products
export const getAllProducts = (search = '', categoryId = '') => {
  let url = `${API_BASE_URL}/products?`;
  if (search) url += `search=${search}&`;
  if (categoryId) url += `category_id=${categoryId}`;
  return axios.get(url);
};

export const getProductById = (id) => {
  return axios.get(`${API_BASE_URL}/products/${id}`);
};

// Categories
export const getAllCategories = () => {
  return axios.get(`${API_BASE_URL}/categories`);
};

// Cart
export const getCart = (userId) => {
  return axios.get(`${API_BASE_URL}/cart/${userId}`);
};

export const addToCart = (userId, productId, quantity) => {
  return axios.post(`${API_BASE_URL}/cart/add`, {
    user_id: userId,
    product_id: productId,
    quantity: quantity
  });
};

export const updateCartItem = (cartItemId, quantity) => {
  return axios.put(`${API_BASE_URL}/cart/update`, {
    cart_item_id: cartItemId,
    quantity: quantity
  });
};

export const removeFromCart = (cartItemId) => {
  return axios.delete(`${API_BASE_URL}/cart/${cartItemId}`);
};

// Orders
export const createOrder = (userId, shippingAddress) => {
  return axios.post(`${API_BASE_URL}/orders`, {
    user_id: userId,
    shipping_address: shippingAddress
  });
};

export const getOrderById = (orderId) => {
  return axios.get(`${API_BASE_URL}/orders/${orderId}`);
};

export const getUserOrders = (userId) => {
  return axios.get(`${API_BASE_URL}/orders/user/${userId}`);
};

// Wishlist
export const getWishlist = (userId) => {
  return axios.get(`${API_BASE_URL}/wishlist/${userId}`);
};

export const addToWishlist = (userId, productId) => {
  return axios.post(`${API_BASE_URL}/wishlist/add`, {
    user_id: userId,
    product_id: productId
  });
};

export const removeFromWishlist = (wishlistItemId) => {
  return axios.delete(`${API_BASE_URL}/wishlist/${wishlistItemId}`);
};
