import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/project_backend/project_backend.did.js';
import type { _SERVICE } from '../declarations/project_backend/project_backend.did';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string) => Promise<void>;
  register: (username: string, name: string, age: number, financialStatus: string) => Promise<void>;
  logout: () => void;
  actor: _SERVICE | null;
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
  const [actor, setActor] = useState<_SERVICE | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedUser && storedAuth === 'true') {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    initializeActor();
  }, []);

  const initializeActor = async () => {
    try {
      const agent = new HttpAgent({
        host: 'http://127.0.0.1:4943',
      });
      
      // Only for local development
      await agent.fetchRootKey();

      const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId: 'be2us-64aaa-aaaaa-qaabq-cai',
      });

      setActor(actor);
    } catch (error) {
      console.error('Failed to initialize actor:', error);
      toast.error('Failed to connect to the backend');
    }
  };

  const login = async (username: string) => {
    try {
      if (!actor) throw new Error('Actor not initialized');

      const userData = await actor.getUserData(username);
      if ('ok' in userData) {
        setUser(userData.ok);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData.ok));
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Login successful!');
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const register = async (username: string, name: string, age: number, financialStatus: string) => {
    try {
      if (!actor) throw new Error('Actor not initialized');

      const result = await actor.createUser(username, name, age, financialStatus);
      if (result === 'User created successfully!') {
        await login(username);
        toast.success('Registration successful!');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, actor }}>
      {children}
    </AuthContext.Provider>
  );
};