// API service for eCommerce backend integration
const API_BASE_URL = 'http://localhost:4000/api';

// API Helper function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData: { username: string; email: string; password: string; contact?: number }) =>
    apiCall('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    apiCall('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

// User API
export const userAPI = {
  getUsers: () => apiCall('/getusers'),
  getUserByEmail: (email: string) => apiCall(`/getuserbyemail/${email}`),
  updateUser: (id: string, userData: any) =>
    apiCall(`/updateuser/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  deleteUser: (id: string) =>
    apiCall(`/deleteuser/${id}`, {
      method: 'DELETE',
    }),
};

// Product API
export const productAPI = {
  getProducts: () => apiCall('/product'),
  getProductById: (id: string) => apiCall(`/getproductbyid/${id}`),
  createProduct: (userId: string, productData: any) =>
    apiCall(`/createproduct/${userId}`, {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  updateProduct: (id: string, productData: any) =>
    apiCall(`/updateproduct/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
  deleteProduct: (id: string) =>
    apiCall(`/deleteproduct/${id}`, {
      method: 'DELETE',
    }),
};

// Cart API
export const cartAPI = {
  addToCart: (userId: string, productId: string, quantity: number = 1) =>
    apiCall(`/addtocart/${userId}/${productId}/${quantity}`, {
      method: 'POST',
    }),
  getCartOfUser: (userId: string) => apiCall(`/getcartofuser/${userId}`),
  updateCart: (cartId: string, quantity: number) =>
    apiCall(`/updatecart/${cartId}/${quantity}`, {
      method: 'PATCH',
    }),
  deleteCart: (cartId: string) =>
    apiCall(`/deletecart/${cartId}`, {
      method: 'DELETE',
    }),
};

// Order API
export const orderAPI = {
  createOrder: (orderData: any) =>
    apiCall('/createorder', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  getAllOrders: () => apiCall('/getorders'),
  getUserOrders: (userId: string) => apiCall(`/getuserorders/${userId}`),
  updateOrder: (id: string, orderData: any) =>
    apiCall(`/updateorder/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    }),
};

export { API_BASE_URL };