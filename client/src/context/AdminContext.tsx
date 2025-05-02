import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

type AdminUser = {
  id: number;
  username: string;
  isAdmin: boolean;
};

type AdminContextType = {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [location, navigate] = useLocation();

  const checkAuth = async (): Promise<boolean> => {
    try {
      const authData = await apiRequest<{ authenticated: boolean; user: AdminUser | null }>('/api/auth/check', {
        method: 'GET',
      });

      if (authData.authenticated && authData.user) {
        setUser(authData.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status when the provider mounts
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<AdminUser> => {
    setIsLoading(true);
    try {
      const userData = await apiRequest<AdminUser>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await apiRequest<void>('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && user.isAdmin,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdmin();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}