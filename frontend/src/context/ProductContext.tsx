import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: number;
  category_name?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  getProduct: (id: number) => Product | undefined;
  addCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const getAuthHeaders = (): Record<string, string> | undefined => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Token ${token}` } : undefined;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // Load products and categories from API
  const loadData = async () => {
    // If not authenticated, clear products and categories for privacy
    if (!token) {
      setProducts([]);
      setCategories([]);
      return;
    }

    setIsLoading(true);
    try {
      const headers = getAuthHeaders() || {};
      
      // Load products
      const productsResponse = await fetch('https://lifemade.onrender.com/products/', {
        headers,
      });
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        // Convert price to number for each product
        const processedProducts = productsData.map((product: any) => ({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock, 10),
          category: parseInt(product.category, 10),
        }));
        setProducts(processedProducts);
      }

      // Load categories
      const categoriesResponse = await fetch('https://lifemade.onrender.com/categories/', {
        headers,
      });
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAuthenticated]);

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://lifemade.onrender.com/products/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthHeaders() || {}),
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const newProduct = await response.json();
      // Convert price to number
      const processedProduct = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        category: parseInt(newProduct.category, 10),
      };
      setProducts([...products, processedProduct]);
    } catch (error) {
      console.error('Add product error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://lifemade.onrender.com/products/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthHeaders() || {}),
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      // Convert price to number
      const processedProduct = {
        ...updatedProduct,
        price: parseFloat(updatedProduct.price),
        stock: parseInt(updatedProduct.stock, 10),
        category: parseInt(updatedProduct.category, 10),
      };
      setProducts(products.map(p => p.id === id ? processedProduct : p));
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`https://lifemade.onrender.com/products/${id}/`, {
        method: 'DELETE',
        headers: headers || {},
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getProduct = (id: number) => {
    return products.find(p => p.id === id);
  };

  const addCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('https://lifemade.onrender.com/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthHeaders() || {}),
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error('Add category error:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      addCategory,
      isLoading,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
