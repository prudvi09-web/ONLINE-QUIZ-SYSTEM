import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('quiz_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('quiz_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      if (token) {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
          localStorage.setItem('quiz_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    setToken(data.token);
    const userInfo = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(userInfo);
    localStorage.setItem('quiz_token', data.token);
    localStorage.setItem('quiz_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const register = async (name, email, password, role = 'ROLE_USER') => {
    const data = await authApi.register({ name, email, password, role });
    setToken(data.token);
    const userInfo = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setUser(userInfo);
    localStorage.setItem('quiz_token', data.token);
    localStorage.setItem('quiz_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('quiz_token');
    localStorage.removeItem('quiz_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
