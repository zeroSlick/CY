
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapSupabaseUser = (sbUser: any): User => ({
    id: sbUser.id,
    username: sbUser.user_metadata?.username || sbUser.email?.split('@')[0] || 'operator',
    email: sbUser.email || '',
    phone: sbUser.phone || sbUser.user_metadata?.phone_number || '',
    role: (sbUser.user_metadata?.role as UserRole) || UserRole.SOC,
    isActive: true,
    lastLogin: new Date().toISOString()
  });

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth Event Triggered: ${event}`);
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const isEmail = identifier.includes('@');
      let result;

      if (isEmail) {
        result = await supabase.auth.signInWithPassword({ 
          email: identifier, 
          password: password 
        });
      } else {
        // Ensure phone is in E.164 format (+91...)
        const phone = identifier.startsWith('+') ? identifier : `+${identifier}`;
        result = await supabase.auth.signInWithPassword({ 
          phone: phone, 
          password: password 
        });
      }

      if (result.error) throw result.error;
      
      // onAuthStateChange will handle setting the user and loading state
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            department: userData.department,
            role: userData.role,
            phone_number: userData.phone
          }
        }
      });

      if (error) throw error;
      // SignUp doesn't always log in immediately depending on confirmation settings
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
