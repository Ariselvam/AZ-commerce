import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user and token exist in localStorage on mount
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      // DRF SimpleJWT requires 'username' by default, but we can support standard fields
      // In accounts/serializers.py, we support username as credential
      const response = await api.post('/auth/login/', {
        username: usernameOrEmail,
        password: password,
      });

      const { access, refresh, user: userData } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid username or password.';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      // Return structured validation errors
      return { success: false, errors: error.response?.data || { detail: 'Registration failed.' } };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile/', profileData);
      const updatedUser = response.data;
      
      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, errors: error.response?.data || { detail: 'Profile update failed.' } };
    }
  };

  const reloadUserProfile = async () => {
    if (!localStorage.getItem('access_token')) return;
    try {
      const response = await api.get('/auth/profile/');
      const freshUser = response.data;
      localStorage.setItem('user', JSON.stringify(freshUser));
      setUser(freshUser);
    } catch (error) {
      console.error("Failed to sync profile: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        reloadUserProfile,
        isAuthenticated: !!user,
        isAdmin: !!(user && (user.is_admin_user || user.is_staff)),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
