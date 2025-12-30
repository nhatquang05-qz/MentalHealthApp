import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

export interface EmergencyContact {
  name: string;
  phone: string;
}

interface UserProfile {
  name: string;
  email: string;
  emergencyContacts: EmergencyContact[];
}

interface AuthContextType {
  isGuest: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, contacts: EmergencyContact[]) => Promise<void>;
  updateUser: (user: UserProfile) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://10.0.116.186:3000/api/auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          name: data.user.username,
          email: data.user.email,
          emergencyContacts: [], 
        });
        setIsGuest(false);
      } else {
        Alert.alert('Đăng nhập thất bại', data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server backend.');
    }
  };

  const register = async (name: string, email: string, password: string, contacts: EmergencyContact[]) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      } else {
        Alert.alert('Đăng ký thất bại', data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server backend.');
    }
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{ isGuest, user, login, register, updateUser, logout, continueAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};