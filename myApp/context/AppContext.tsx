import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { api } from '@/services/api';

// ========== TYPES ==========
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  badgeType: 'sale' | 'new' | 'outofstock' | null;
  image: any | null;
  inStock: boolean;
  size?: string | null;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: any | null;
}

interface User {
  uid: string;
  name: string;
  email: string;
}

export interface UserAddress {
  id: number;
  userId: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface UserBankAccount {
  id: number;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

type ThemeType = 'light' | 'dark';

interface AppContextType {
  products: Product[];
  collections: Collection[];
  cart: CartItem[];
  wishlist: string[];
  isAuthenticated: boolean;
  user: User | null;
  theme: ThemeType;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (product: Product, quantity: number, size: string) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, newQuantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  login: (user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  formatPrice: (price: number) => string;
  addresses: UserAddress[];
  bankAccounts: UserBankAccount[];
  orderCount: number;
  voucherCount: number;
  defaultPaymentMethod: string;
  fetchUserData: () => void;
  setPaymentMethod: (method: string) => void;
}

// ========== IMAGE MAPPING ==========
// Map tên file ảnh sang require() vì React Native cần require() cho ảnh local
const IMAGE_MAP: Record<string, any> = {
  'products/day1.jpg': require('@/assets/images/products/day1.jpg'),
  'products/day2.jpg': require('@/assets/images/products/day2.jpg'),
  'products/day3.jpg': require('@/assets/images/products/day3.jpg'),
  'products/day4.jpg': require('@/assets/images/products/day4.jpg'),
  'products/day5.jpg': require('@/assets/images/products/day5.jpg'),
  'products/day6.jpg': require('@/assets/images/products/day6.jpg'),
  'products/nhan1.jpg': require('@/assets/images/products/nhan1.jpg'),
  'products/nhan2.jpg': require('@/assets/images/products/nhan2.jpg'),
  'products/nhan3.jpg': require('@/assets/images/products/nhan3.jpg'),
  'products/nhan4.jpg': require('@/assets/images/products/nhan4.jpg'),
  'products/nhan5.jpg': require('@/assets/images/products/nhan5.jpg'),
  'products/nhan6.jpg': require('@/assets/images/products/nhan6.jpg'),
  'products/bongtai1.jpg': require('@/assets/images/products/bongtai1.jpg'),
  'products/bongtai2.jpg': require('@/assets/images/products/bongtai2.jpg'),
  'products/bongtai3.jpg': require('@/assets/images/products/bongtai3.jpg'),
  'products/bongtai4.jpg': require('@/assets/images/products/bongtai4.jpg'),
  'products/bongtai5.jpg': require('@/assets/images/products/bongtai5.jpg'),
  'products/vongtay1.jpg': require('@/assets/images/products/vongtay1.jpg'),
  'products/vongtay2.jpg': require('@/assets/images/products/vongtay2.jpg'),
  'products/vongtay3.jpg': require('@/assets/images/products/vongtay3.jpg'),
  'products/vongtay4.jpg': require('@/assets/images/products/vongtay4.jpg'),
  'products/botrangsuc1.jpg': require('@/assets/images/products/botrangsuc1.jpg'),
  'products/botrangsuc2.jpg': require('@/assets/images/products/botrangsuc2.jpg'),
  'products/botrangsuc3.jpg': require('@/assets/images/products/botrangsuc3.jpg'),
};

// ========== CONTEXT ==========
const AppContext = createContext<AppContextType | undefined>(undefined);

// ========== UTILS ==========
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// ========== PROVIDER ==========
export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeType>(Appearance.getColorScheme() || 'dark');
  const [isLoading, setIsLoading] = useState(true);

  // User Profile States
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [bankAccounts, setBankAccounts] = useState<UserBankAccount[]>([]);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [voucherCount, setVoucherCount] = useState<number>(0);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<string>('COD');

  // Fetch dữ liệu từ backend Node.js khi app khởi động
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Gọi API lấy sản phẩm và bộ sưu tập song song
        const [productsRes, collectionsRes] = await Promise.all([
          api.getProducts(),
          api.getCollections(),
        ]);

        if (productsRes.success) {
          // Map image string sang require() cho React Native
          const mappedProducts = productsRes.data.map((p: any) => ({
            ...p,
            image: p.image ? IMAGE_MAP[p.image] || null : null,
          }));
          setProducts(mappedProducts);
        }

        if (collectionsRes.success) {
          setCollections(collectionsRes.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu từ server:', error);
        console.log('💡 Hãy chắc chắn backend đang chạy: cd backend && npm run dev');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem('theme')) as ThemeType;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme.', e);
      }
    };
    loadTheme();
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const fetchUserData = async () => {
    if (!user || !isAuthenticated) return;
    try {
      const [profileRes, addrRes, banksRes, ordersRes, vouchersRes] = await Promise.all([
        api.getUserProfile(user.uid),
        api.getAddresses(user.uid),
        api.getBanks(user.uid),
        api.getOrderCount(user.uid),
        api.getVoucherCount()
      ]);
      if (profileRes.success && profileRes.data) {
        setDefaultPaymentMethod(profileRes.data.defaultPaymentMethod || 'COD');
      }
      if (addrRes.success && addrRes.data) {
        setAddresses(addrRes.data);
      }
      if (banksRes && banksRes.success && banksRes.data) {
        setBankAccounts(banksRes.data);
      }
      if (ordersRes && ordersRes.success) {
        setOrderCount(ordersRes.data);
      }
      if (vouchersRes && vouchersRes.success) {
        setVoucherCount(vouchersRes.data);
      }
    } catch (error) {
      console.error('Error fetching user profile/addresses/banks', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData();
    } else {
      setAddresses([]);
      setBankAccounts([]);
      setOrderCount(0);
      setVoucherCount(0);
      setDefaultPaymentMethod('COD');
    }
  }, [isAuthenticated, user]);

  const setPaymentMethod = async (method: string) => {
    setDefaultPaymentMethod(method);
    if (user) {
      await api.updatePaymentMethod(user.uid, method);
    }
  };




  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme.', e);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Optional: Clear cart and wishlist on logout
    setCart([]);
    setWishlist([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const addToCart = (product: Product, quantity = 1, size?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (productId: string, newQuantity: number, selectedSize?: string) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const contextValue = {
    products,
    collections,
    cart,
    wishlist,
    isAuthenticated,
    user,
    theme,
    cartTotal,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    login,
    logout,
    toggleTheme,
    formatPrice,
    addresses,
    bankAccounts,
    orderCount,
    voucherCount,
    defaultPaymentMethod,
    fetchUserData,
    setPaymentMethod,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
