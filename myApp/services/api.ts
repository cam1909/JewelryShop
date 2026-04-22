/**
 * API service - Kết nối frontend với backend Node.js
 * Tất cả dữ liệu sản phẩm, bộ sưu tập, đơn hàng đều qua đây
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// IP của máy tính bạn (thay đổi nếu IP WiFi thay đổi)
const BACKEND_IP = '192.168.1.8';
const BACKEND_PORT = 3001;

// Tự động lấy IP từ Expo dev server để điện thoại thật có thể kết nối
const getBaseUrl = () => {
  // Lấy hostUri từ Expo (ví dụ: "192.168.1.5:8081")
  const debuggerHost = Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    console.log(`🔗 Sử dụng IP từ Expo: ${ip}`);
    return `http://${ip}:${BACKEND_PORT}`;
  }

  // Fallback: dùng IP hardcode
  if (Platform.OS === 'android') {
    console.log(`🔗 Fallback: dùng IP ${BACKEND_IP}`);
    return `http://${BACKEND_IP}:${BACKEND_PORT}`;
  }
  return `http://localhost:${BACKEND_PORT}`;
};

const API_BASE_URL = getBaseUrl();
console.log('🔗 API Base URL:', API_BASE_URL);

export const api = {
  // ===== SẢN PHẨM =====
  getProducts: async (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/api/products${query}`);
    const data = await response.json();
    return data;
  },

  getProductById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    const data = await response.json();
    return data;
  },

  // ===== BỘ SƯU TẬP =====
  getCollections: async () => {
    const response = await fetch(`${API_BASE_URL}/api/collections`);
    const data = await response.json();
    return data;
  },

  // ===== ĐƠN HÀNG =====
  createOrder: async (orderData: {
    userId: string;
    items: any[];
    total: number;
    shipping: number;
    paymentMethod?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    return data;
  },

  getOrders: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${userId}`);
    const data = await response.json();
    return data;
  },

  getOrder: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/single/${orderId}`);
    return await response.json();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  },

  createPaymentLink: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-link`, {
      method: 'POST'
    });
    return await response.json();
  },

  // ===== ĐỊA CHỈ & HỒ SƠ =====
  getUserProfile: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`);
    return await response.json();
  },
  
  updatePaymentMethod: async (userId: string, paymentMethod: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod }),
    });
    return await response.json();
  },

  getAddresses: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/addresses`);
    return await response.json();
  },

  addAddress: async (userId: string, addressData: { name: string, phone: string, address: string, isDefault: boolean }) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
    });
    return await response.json();
  },

  setDefaultAddress: async (userId: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/addresses/${id}/default`, {
      method: 'PUT',
    });
    return await response.json();
  },

  // ===== TÀI KHOẢN NGÂN HÀNG =====
  getBanks: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/banks`);
    return await response.json();
  },

  addBank: async (userId: string, bankData: { bankName: string, accountNumber: string, accountName: string, isDefault: boolean }) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/banks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bankData),
    });
    return await response.json();
  },

  setDefaultBank: async (userId: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/banks/${id}/default`, {
      method: 'PUT',
    });
    return await response.json();
  },

  // ===== THỐNG KÊ (STATS) =====
  getVoucherCount: async () => {
    const response = await fetch(`${API_BASE_URL}/api/vouchers/count`);
    return await response.json();
  },

  getOrderCount: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/orders/count`);
    return await response.json();
  },
};

// ==========================================
// REVIEWS
// ==========================================
const debuggerHost = Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;
const BASE = debuggerHost ? `http://${debuggerHost.split(':')[0]}:3001` : 'http://192.168.1.8:3001';

export const getProductReviews = async (productId: string) => {
  try {
    const res = await fetch(`${BASE}/api/products/${productId}/reviews`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('Lỗi lấy reviews:', error);
    return { success: false, data: [] };
  }
};

export const addProductReview = async (productId: string, userId: string, userName: string, rating: number, comment: string) => {
  try {
    const res = await fetch(`${BASE}/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, userName, rating, comment }),
    });
    if (!res.ok) throw new Error('Failed to post');
    return await res.json();
  } catch (error) {
    console.error('Lỗi đăng review:', error);
    return { success: false, message: 'Không thể thêm đánh giá' };
  }
};
