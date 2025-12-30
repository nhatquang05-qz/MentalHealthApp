import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../config';

export interface EmergencyContact {
  name: string;
  phone: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  emergencyContacts: EmergencyContact[];
}

interface AuthContextType {
  isGuest: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    contacts: EmergencyContact[],
  ) => Promise<void>;
  updateUser: (formData: FormData) => Promise<boolean>;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          id: data.user.id,
          name: data.user.username,
          email: data.user.email,
          avatar: data.user.avatar,
          emergencyContacts: data.user.emergencyContacts.map((c: any) => ({
            name: c.name,
            phone: c.phone,
          })),
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

  const register = async (
    name: string,
    email: string,
    password: string,
    contacts: EmergencyContact[],
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password, contacts }),
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

  const updateUser = async (formData: FormData) => {
    try {
      if (!user) return false;

      const response = await fetch(`${API_URL}/auth/update`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          id: data.user.id,
          name: data.user.username,
          email: data.user.email,
          avatar: data.user.avatar,
          emergencyContacts: data.user.emergencyContacts.map((c: any) => ({
            name: c.name,
            phone: c.phone,
          })),
        });
        return true;
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể cập nhật hồ sơ.');
        return false;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server để cập nhật.');
      return false;
    }
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
