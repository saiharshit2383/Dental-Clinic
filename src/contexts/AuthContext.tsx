import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { getStoredData, saveSession, getSession, clearSession } from '../utils/localStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const sessionUserId = getSession();
    if (sessionUserId) {
      const data = getStoredData();
      const sessionUser = data.users.find(u => u.id === sessionUserId);
      if (sessionUser) {
        setUser(sessionUser);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const data = getStoredData();
    const foundUser = data.users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      saveSession(foundUser.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};