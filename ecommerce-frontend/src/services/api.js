import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Products
export const getAllProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);
export const searchProducts = (name) => API.get(`/products/search?name=${name}`);
export const getProductsByCategory = (id) => API.get(`/products/category/${id}`);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Cart
export const getCart = (userId) => API.get(`/cart/${userId}`);
export const addToCart = (data) => API.post('/cart/add', data);
export const removeFromCart = (cartItemId) => API.delete(`/cart/remove/${cartItemId}`);
export const clearCart = (userId) => API.delete(`/cart/clear/${userId}`);

// Orders
export const placeOrder = (data) => API.post('/orders/place', data);
export const getOrders = (userId) => API.get(`/orders/user/${userId}`);