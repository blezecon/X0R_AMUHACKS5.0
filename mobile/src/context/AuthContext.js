import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/endpoints';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('userData'),
      ]);

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      console.log('Login Response:', JSON.stringify(response, null, 2));

      // Handle different response structures
      const responseData = response.data || response;
      const token = responseData.token;
      
      // The user data IS the response.data (it contains email, name, etc.)
      const user = {
        id: responseData.userId,
        email: responseData.email,
        name: responseData.name,
        onboarded: responseData.onboarded,
        preferredProvider: responseData.preferredProvider,
        profilePhoto: responseData.profilePhoto,
      };

      if (!token) {
        console.error('Missing token in response:', response);
        return {
          success: false,
          error: 'Invalid response from server. Missing authentication token.',
        };
      }

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error('Login Error:', error);
      return {
        success: false,
        error: error.message || error.data?.error || 'Login failed',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authAPI.register(name, email, password);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.message || error.data?.error || 'Registration failed',
      };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await authAPI.verifyOTP(email, otp);
      console.log('OTP Verification Response:', JSON.stringify(response, null, 2));

      // Handle different response structures
      const responseData = response.data || response;
      const token = responseData.token;
      
      // The user data IS the response.data (it contains email, name, etc.)
      const user = {
        id: responseData.userId,
        email: responseData.email,
        name: responseData.name,
        onboarded: responseData.onboarded,
        preferredProvider: responseData.preferredProvider,
        profilePhoto: responseData.profilePhoto,
      };

      if (!token) {
        console.error('Missing token in response:', response);
        return {
          success: false,
          error: 'Invalid response from server. Missing authentication token.',
        };
      }

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      console.error('OTP Verification Error:', error);
      return {
        success: false,
        error: error.message || error.data?.error || 'Verification failed',
      };
    }
  };

  const resendOTP = async (email) => {
    try {
      await authAPI.resendOTP(email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || error.data?.error || 'Failed to resend OTP',
      };
    }
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      const response = await authAPI.completeOnboarding(onboardingData);
      console.log('Onboarding Response:', JSON.stringify(response, null, 2));

      // Handle different response structures
      const responseData = response.data || response;
      
      // Merge with existing user data (response only has partial data)
      const updatedUser = {
        ...user,  // Keep existing data (email, etc.)
        id: responseData.userId || user?.id,
        name: responseData.name || user?.name,
        onboarded: responseData.onboarded ?? true,
        preferredProvider: responseData.preferredProvider || user?.preferredProvider,
        profilePhoto: responseData.profilePhoto || user?.profilePhoto,
      };

      if (!updatedUser.id) {
        console.error('Missing user data in response:', response);
        return {
          success: false,
          error: 'Invalid response from server. Missing user data.',
        };
      }

      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Onboarding Error:', error);
      return {
        success: false,
        error: error.message || error.data?.error || 'Onboarding failed',
        details: error.data?.details,
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    verifyOTP,
    resendOTP,
    completeOnboarding,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
