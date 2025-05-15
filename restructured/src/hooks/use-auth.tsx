import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/query-client";

// User type
export interface User {
  id: number;
  username: string;
  isAdmin: boolean;
  createdAt: string;
}

// Auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
};

// Login data type
export type LoginData = {
  username: string;
  password: string;
};

// Register data type
export type RegisterData = {
  username: string;
  password: string;
};

// Create context
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Login mutation hook
function useLoginMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/check"], {
        authenticated: true,
        user: data.data.user,
      });
      
      // Store token in local storage
      localStorage.setItem("auth_token", data.data.token);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Register mutation hook
function useRegisterMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/auth/register", credentials);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/check"], {
        authenticated: true,
        user: data.data.user,
      });
      
      // Store token in local storage
      localStorage.setItem("auth_token", data.data.token);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Logout mutation hook
function useLogoutMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Logout failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/check"], {
        authenticated: false,
        user: null,
      });
      
      // Remove token from local storage
      localStorage.removeItem("auth_token");
      
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const { toast } = useToast();
  
  // Auth check query
  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["/api/auth/check"],
    queryFn: async () => {
      // Add token to request if available
      const token = localStorage.getItem("auth_token");
      const headers: HeadersInit = {};
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const res = await fetch("/api/auth/check", { headers });
      if (!res.ok) {
        throw new Error("Failed to check authentication");
      }
      
      return await res.json();
    },
    retry: false,
  });
  
  // Create mutation hooks
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  
  return (
    <AuthContext.Provider
      value={{
        user: data?.authenticated ? data.user : null,
        isLoading,
        error: error as Error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}