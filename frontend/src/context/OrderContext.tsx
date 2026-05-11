import React, { createContext, useContext, useEffect, useState } from 'react';

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

const getAuthHeaders = (): Record<string, string> | undefined => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Token ${token}` } : undefined;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }

    // Load order history if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      loadOrderHistory();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const loadOrderHistory = async () => {
    try {
      const headers = getAuthHeaders();
      // Check if user is admin
      const user = localStorage.getItem('user');
      const isAdmin = user ? JSON.parse(user).role === 'admin' : false;
      
      // Use admin orders endpoint for admins, regular orders endpoint for users
      const endpoint = isAdmin 
        ? 'https://lifemade.onrender.com/api/admin/orders/' 
        : 'https://lifemade.onrender.com/api/orders/';
      
      const response = await fetch(endpoint, {
        headers: headers || {},
      });

      if (response.ok) {
        const orders = await response.json();
        setOrderHistory(orders);
      }
    } catch (error) {
      console.error('Failed to load order history:', error);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const existing = currentCart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
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
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (shippingAddress: string) => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      // Convert cart items to API format
      const items = cart.map(item => ({
        product_id: parseInt(item.id),
        quantity: item.quantity,
      }));

      const response = await fetch('https://lifemade.onrender.com/api/orders/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthHeaders() || {}),
        },
        body: JSON.stringify({
          shipping_address: shippingAddress,
          items: items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to place order');
      }

      // Reload order history and clear cart
      await loadOrderHistory();
      clearCart();
    } catch (error) {
      console.error('Place order error:', error);
      throw error;
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <OrderContext.Provider value={{
      cart,
      orderHistory,
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
