import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectBackend } from '../canister';
import type { _SERVICE } from '../declarations/project_backend/project_backend.did';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string) => Promise<void>;
  register: (username: string, name: string, age: number, financialStatus: string) => Promise<void>;
  logout: () => Promise<void>;
  actor: _SERVICE;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      console.log('AuthProvider: Found stored userId:', storedUserId);
      login(storedUserId).catch((err) => {
        console.error('AuthProvider: Failed to log in with stored userId:', err);
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
        setUser(null);
        toast.error('Failed to restore session. Please log in again.');
      });
    } else {
      console.log('AuthProvider: No stored userId found');
    }
  }, []);

  const login = async (username: string) => {
    try {
      console.log('AuthProvider: Logging in user:', username);
      const userDataResponse = await projectBackend.getUserData(username);
      console.log('AuthProvider: getUserData response:', userDataResponse);
      if ('ok' in userDataResponse) {
        const userData = userDataResponse.ok;
        setUser({ id: username, ...userData });
        setIsAuthenticated(true);
        localStorage.setItem('userId', username);
        toast.success('Login successful!');
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('AuthProvider: Login failed:', error);
      toast.error('Login failed. Please check your username.');
      throw error;
    }
  };

  const register = async (username: string, name: string, age: number, financialStatus: string) => {
    try {
      console.log('AuthProvider: Registering user:', username);
      const result = await projectBackend.createUser(username, name, age, financialStatus);
      console.log('AuthProvider: createUser response:', result);
      if (result === 'User created successfully!') {
        await login(username);
        toast.success('Registration successful!');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('AuthProvider: Registration failed:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    console.log('AuthProvider: Logging out');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userId');
    toast.success('Logged out successfully');
  };

  console.log('AuthProvider: Rendering with isAuthenticated:', isAuthenticated, 'user:', user);
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, actor: projectBackend }}>
      {children}
    </AuthContext.Provider>
  );
};