import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  phone_number: string;
  medical_name: string;
  address: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profileData?: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user + token from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await fetch('https://lifemade.onrender.com/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      if (!data.user || !data.user.id) {
        throw new Error('Invalid response from server');
      }

      const userData: User = {
        id: data.user.id.toString(),
        email: data.user.email,
        role: data.user.is_staff ? 'admin' : 'user',
        profile: data.user.profile,
      };

      setUser(userData);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, profileData?: Partial<UserProfile>): Promise<void> => {
    if (!email || !password) throw new Error('Email and password are required');
    if (!email.includes('@')) throw new Error('Please enter a valid email address');
    if (password.length < 6) throw new Error('Password must be at least 6 characters long');

    try {
      const response = await fetch('https://lifemade.onrender.com/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,
          email,
          password,
          password_confirm: password,
          ...profileData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.username) throw new Error('Username already exists');
        if (errorData.email) throw new Error('Email already exists');
        throw new Error('Registration failed');
      }

      // Automatically log the user in to get the token, full user object (including ID and profile)
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
