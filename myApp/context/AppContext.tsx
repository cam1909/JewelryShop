import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  image: any | null; // User will add images later
  inStock: boolean;
  size?: string | null;
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
  name: string;
  email: string;
}

// ========== UTILS ==========
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// ========== MOCK DATA ==========
export const MOCK_PRODUCTS: Product[] = [
  // ===== DÂY CHUYỀN =====
  {
    id: '1', name: 'Dây Chuyền Hoa Vàng Rực Rỡ', category: 'DÂY CHUYỀN',
    price: 4500000, originalPrice: 5500000, rating: 4.5, reviews: 124,
    badge: '-18%', badgeType: 'sale', image: null, inStock: true,
  },
  {
    id: '4', name: 'Dây Chuyền Bạch Kim Đá Xanh', category: 'DÂY CHUYỀN',
    price: 12500000, originalPrice: null, rating: 4.5, reviews: 34,
    badge: 'HẾT HÀNG', badgeType: 'outofstock', image: null, inStock: false,
  },
  {
    id: '5', name: 'Dây Chuyền Ngọc Trai', category: 'DÂY CHUYỀN',
    price: 8500000, originalPrice: null, rating: 4.8, reviews: 89,
    badge: null, badgeType: null, image: null, inStock: true,
  },
  {
    id: '9', name: 'Dây Chuyền Kim Cương Giọt Nước', category: 'DÂY CHUYỀN',
    price: 18500000, originalPrice: 22000000, rating: 4.9, reviews: 45,
    badge: '-16%', badgeType: 'sale', image: null, inStock: true,
  },
  {
    id: '10', name: 'Dây Chuyền Vàng Ý 18K', category: 'DÂY CHUYỀN',
    price: 7200000, originalPrice: null, rating: 4.7, reviews: 156,
    badge: null, badgeType: null, image: null, inStock: true,
  },
  {
    id: '11', name: 'Dây Chuyền Ruby Hình Tim', category: 'DÂY CHUYỀN',
    price: 15800000, originalPrice: null, rating: 4.6, reviews: 28,
    badge: 'MỚI', badgeType: 'new', image: null, inStock: true,
  },

  // ===== NHẪN =====
  {
    id: '2', name: 'Nhẫn Kim Cương Solitaire', category: 'NHẪN',
    price: 28000000, originalPrice: null, rating: 5, reviews: 56,
    badge: 'MỚI', badgeType: 'new', image: null, inStock: true,
  },
  {
    id: '6', name: 'Nhẫn Kim Cương Halo', category: 'NHẪN',
    price: 32000000, originalPrice: null, rating: 5.0, reviews: 42,
    badge: 'MỚI', badgeType: 'new', image: null, inStock: true,
  },
  {
    id: '12', name: 'Nhẫn Cưới Vàng Trắng', category: 'NHẪN',
    price: 9500000, originalPrice: 11000000, rating: 4.8, reviews: 312,
    badge: '-14%', badgeType: 'sale', image: null, inStock: true,
  },
  {
    id: '13', name: 'Nhẫn Đính Sapphire Xanh', category: 'NHẪN',
    price: 22000000, originalPrice: null, rating: 4.9, reviews: 67,
    badge: null, badgeType: null, image: null, inStock: true,
  },
  {
    id: '14', name: 'Nhẫn Vàng Hồng Minimalist', category: 'NHẪN',
    price: 5800000, originalPrice: null, rating: 4.4, reviews: 189,
    badge: null, badgeType: null, image: null, inStock: true,
  },
  {
    id: '15', name: 'Nhẫn Đôi Cưới Platinum', category: 'NHẪN',
    price: 38000000, originalPrice: null, rating: 5.0, reviews: 23,
    badge: 'MỚI', badgeType: 'new', image: null, inStock: true,
  },

  // ===== BÔNG TAI =====
  {
    id: '3', name: 'Bông Tai Ngọc Trai Cổ Điển', category: 'BÔNG TAI',
    price: 3200000, originalPrice: 3800000, rating: 4.5, reviews: 201,
    badge: '-16%', badgeType: 'sale', image: null, inStock: true,
  },
  {
    id: '8', name: 'Bông Tai Sapphire', category: 'BÔNG TAI',
    price: 15000000, originalPrice: null, rating: 4.9, reviews: 33,
    badge: null, badgeType: null, image: null, inStock: true,
  },
  {
    id: '16', name: 'Bông Tai Kim Cương Tròn', category: 'BÔNG TAI',
    price: 19500000, originalPrice: null, rating: 4.8, reviews: 78,
    badge: null, badgeType: null, image: null, inStock: true,
  },
  {
    id: '17', name: 'Bông Tai Vàng Hoa Mai', category: 'BÔNG TAI',
    price: 4800000, originalPrice: 5600000, rating: 4.6, reviews: 145,
    badge: '-14%', badgeType: 'sale', image: null, inStock: true,
  },
  {
    id: '18', name: 'Bông Tai Dáng Dài Emerald', category: 'BÔNG TAI',
    price: 25000000, originalPrice: null, rating: 4.7, reviews: 19,
    badge: 'MỚI', badgeType: 'new', image: null, inStock: true,
  },

  // ===== LẮC TAY =====
  {
    id: '7', name: 'Lắc Tay Vàng Hồng', category: 'LẮC TAY',
    price: 6200000, originalPrice: null, rating: 4.6, reviews: 67,
    badge: null, badgeType: null, image: null, inStock: true,
  },
  {
    id: '19', name: 'Lắc Tay Kim Cương Tennis', category: 'LẮC TAY',
    price: 45000000, originalPrice: null, rating: 5.0, reviews: 15,
    badge: 'MỚI', badgeType: 'new', image: null, inStock: true,
  },
  {
    id: '20', name: 'Lắc Tay Charm Vàng 18K', category: 'LẮC TAY',
    price: 8900000, originalPrice: 10500000, rating: 4.7, reviews: 203,
    badge: '-15%', badgeType: 'sale', image: null, inStock: true,
  },
  {
    id: '21', name: 'Lắc Tay Ngọc Trai Biển', category: 'LẮC TAY',
    price: 5500000, originalPrice: null, rating: 4.5, reviews: 98,
    badge: null, badgeType: null, image: null, inStock: true,
  },

  // ===== BỘ TRANG SỨC =====
  {
    id: '22', name: 'Bộ Trang Sức Cưới Kim Cương', category: 'BỘ TRANG SỨC',
    price: 85000000, originalPrice: null, rating: 5.0, reviews: 12,
    badge: 'MỚI', badgeType: 'new', image: null, inStock: true,
  },
  {
    id: '23', name: 'Bộ Trang Sức Ngọc Trai Akoya', category: 'BỘ TRANG SỨC',
    price: 35000000, originalPrice: 42000000, rating: 4.9, reviews: 34,
    badge: '-17%', badgeType: 'sale', image: null, inStock: true,
  },
  {
    id: '24', name: 'Bộ Trang Sức Vàng Hoa Văn', category: 'BỘ TRANG SỨC',
    price: 28500000, originalPrice: null, rating: 4.8, reviews: 56,
    badge: null, badgeType: null, image: null, inStock: true,
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: '1',
    title: 'Bộ Sưu Tập Mùa Xuân',
    subtitle: '12 sản phẩm',
    description: 'Những thiết kế mới nhất lấy cảm hứng từ hoa xuân',
    image: null,
  },
  {
    id: '2',
    title: 'Trang Sức Cưới',
    subtitle: '24 sản phẩm',
    description: 'Bộ sưu tập dành riêng cho ngày trọng đại',
    image: null,
  },
  {
    id: '3',
    title: 'Kim Cương Tự Nhiên',
    subtitle: '18 sản phẩm',
    description: 'Vẻ đẹp vĩnh cửu từ thiên nhiên',
    image: null,
  },
  {
    id: '4',
    title: 'Ngọc Trai Biển Đông',
    subtitle: '9 sản phẩm',
    description: 'Tinh hoa từ đại dương Việt Nam',
    image: null,
  },
  {
    id: '5',
    title: 'Vàng Ý 18K',
    subtitle: '32 sản phẩm',
    description: 'Đẳng cấp châu Âu với chất liệu thượng hạng',
    image: null,
  },
  {
    id: '6',
    title: 'Minimalist',
    subtitle: '15 sản phẩm',
    description: 'Đơn giản nhưng tinh tế cho phong cách hiện đại',
    image: null,
  },
];

// ========== CONTEXT ==========
interface AppContextType {
  products: Product[];
  collections: Collection[];
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  shippingFee: number;
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// ========== CONTEXT ==========
const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// ========== PROVIDER ==========
export function AppProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [collections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ===== AUTHENTICATION =====
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

  // ===== WISHLIST =====
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // ---- Cart ----
  const addToCart = (product: Product, quantity = 1, size?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedSize === size))
    );
  };

  const updateQuantity = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // ===== COMPUTED VALUES =====
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cartTotal > 0 && cartTotal < 10000000 ? 50000 : 0;

  const value = {
    products,
    collections,
    wishlist,
    toggleWishlist,
    isInWishlist,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    shippingFee,
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
