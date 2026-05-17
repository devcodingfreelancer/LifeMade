import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  user: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: number;
    order: number;
    product: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
}

interface OrderContextType {
  cart: CartItem[];
  orderHistory: Order[];
  isLoadingOrders: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: string) => Promise<void>;
  loadOrderHistory: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  /* ── Restore cart from localStorage once ── */
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch { setCart([]); }
    }
  }, []);

  /* ── Persist cart to localStorage ── */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /* ── Re-fetch orders whenever token changes (login / logout / page reload) ──
     - token becomes a non-null string → user just logged in → fetch their orders
     - token becomes null            → user logged out      → clear orders        */
  useEffect(() => {
    if (token && user) {
      loadOrderHistory();
    } else {
      // User logged out — clear stale order history immediately
      setOrderHistory([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* ── Load order history from API ── */
  const loadOrderHistory = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;

    setIsLoadingOrders(true);
    try {
      const isAdmin = user?.role === 'admin';
      const endpoint = isAdmin
        ? 'https://lifemade.onrender.com/admin/orders/'
        : 'https://lifemade.onrender.com/orders/';

      const response = await fetch(endpoint, {
        headers: { Authorization: `Token ${currentToken}` },
      });

      if (response.ok) {
        const orders = await response.json();
        setOrderHistory(Array.isArray(orders) ? orders : []);
      } else if (response.status === 401) {
        // Token is invalid/expired — clear auth
        setOrderHistory([]);
      }
    } catch (error) {
      console.error('Failed to load order history:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const existing = currentCart.find((c) => c.id === item.id);
      if (existing) {
        return currentCart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c
        );
      }
      return [...currentCart, { ...item }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (shippingAddress: string) => {
    if (cart.length === 0) throw new Error('Cart is empty');

    const currentToken = localStorage.getItem('token');
    if (!currentToken) throw new Error('Please log in to place an order');

    const items = cart.map((item) => ({
      product_id: parseInt(item.id),
      quantity: item.quantity,
    }));

    const response = await fetch('https://lifemade.onrender.com/orders/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${currentToken}`,
      },
      body: JSON.stringify({ shipping_address: shippingAddress, items }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to place order');
    }

    // Reload orders and clear cart after successful placement
    await loadOrderHistory();
    clearCart();
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <OrderContext.Provider value={{
      cart,
      orderHistory,
      isLoadingOrders,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      loadOrderHistory,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
