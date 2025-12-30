import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho liên hệ khẩn cấp
export interface EmergencyContact {
  name: string;
  phone: string;
}

interface UserProfile {
  name: string;
  email: string;
  emergencyContacts: EmergencyContact[]; // Thêm trường này
}

interface AuthContextType {
  isGuest: boolean;
  user: UserProfile | null;
  login: (email: string) => void;
  // Cập nhật hàm register nhận thêm contacts
  register: (name: string, email: string, contacts: EmergencyContact[]) => void;
  updateUser: (user: UserProfile) => void; // Hàm cập nhật thông tin
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (email: string) => {
    // Giả lập login lấy thông tin cũ (hoặc mặc định rỗng)
    setUser({
      name: 'Người dùng mẫu',
      email: email,
      emergencyContacts: [],
    });
    setIsGuest(false);
  };

  const register = (name: string, email: string, contacts: EmergencyContact[]) => {
    setUser({ name: name, email: email, emergencyContacts: contacts });
    setIsGuest(false);
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
