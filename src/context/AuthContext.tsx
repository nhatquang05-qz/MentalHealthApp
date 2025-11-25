import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserProfile {
  name: string;
  email: string;
}

interface AuthContextType {
  isGuest: boolean;
  user: UserProfile | null;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Mặc định là Guest khi mới vào app
  const [isGuest, setIsGuest] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (email: string) => {
    // Giả lập login thành công
    setUser({ name: 'Người dùng mẫu', email: email });
    setIsGuest(false);
  };

  const register = (name: string, email: string) => {
    // Giả lập đăng ký thành công
    setUser({ name: name, email: email });
    setIsGuest(false);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true); // Quay về chế độ khách
  };

  const continueAsGuest = () => {
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider value={{ isGuest, user, login, register, logout, continueAsGuest }}>
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