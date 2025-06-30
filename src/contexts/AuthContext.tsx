
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data?: any; error?: any; needsConfirmation?: boolean; message?: string }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  checkAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authorized admin emails - only these can become admin
const AUTHORIZED_ADMIN_EMAILS = [
  'admin@company.com',
  'superadmin@company.com',
  // Add more authorized admin emails here
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    setAdminLoading(true);
    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data || false);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  const assignAdminRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: 'admin',
          assigned_by: user?.id
        });

      if (error) {
        console.error('Error assigning admin role:', error);
      } else {
        console.log('Admin role assigned successfully');
      }
    } catch (err) {
      console.error('Error assigning admin role:', err);
    }
  };

  useEffect(() => {
    console.log('[AuthProvider] Initializing...');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthProvider] Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check admin status after user is set
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus();
          }, 100);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthProvider] Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          checkAdminStatus();
        }, 100);
      }
    });

    return () => {
      console.log('[AuthProvider] Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Check admin status when user changes
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user?.id]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/goals`
        }
      });
      
      if (error) {
        return { error };
      }
      
      // Only assign admin role if email is in authorized list
      if (data.user && AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase())) {
        console.log('Authorized admin email detected, will assign admin role after confirmation');
        // Note: Admin role will be assigned after email confirmation in the handle_new_user trigger
      }
      
      // Check if user needs email confirmation
      if (data.user && !data.session) {
        return { 
          data, 
          needsConfirmation: true, 
          message: "Please check your email for verification." 
        };
      }
      
      return { data };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/goals`
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('[AuthProvider] Signing out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('[AuthProvider] Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading,
      isAdmin,
      adminLoading,
      signOut, 
      signIn, 
      signUp, 
      signInWithGoogle,
      checkAdminStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
