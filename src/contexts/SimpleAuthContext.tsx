
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface SimpleAuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  updateProfile: (updates: Partial<Profile>) => Promise<any>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

// Simple auth state cleanup
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile with better error handling
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('[SimpleAuth] Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[SimpleAuth] Error fetching profile:', error);
        return null;
      }

      console.log('[SimpleAuth] Profile fetched successfully');
      return data as Profile;
    } catch (error) {
      console.error('[SimpleAuth] Exception fetching profile:', error);
      return null;
    }
  };

  // Check admin status with better error handling
  const checkAdminStatus = async (): Promise<boolean> => {
    try {
      console.log('[SimpleAuth] Checking admin status');
      
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('[SimpleAuth] Error checking admin status:', error);
        return false;
      }
      
      const adminStatus = data || false;
      console.log('[SimpleAuth] Admin status:', adminStatus);
      return adminStatus;
    } catch (err) {
      console.error('[SimpleAuth] Exception checking admin status:', err);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('[SimpleAuth] Auth state changed:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to prevent potential deadlocks and ensure state updates happen
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const [userProfile, adminStatus] = await Promise.all([
                fetchUserProfile(session.user.id),
                checkAdminStatus()
              ]);
              
              if (isMounted) {
                setProfile(userProfile);
                setIsAdmin(adminStatus);
                setLoading(false);
              }

              // Smart redirect after login - only for SIGNED_IN event
              if (event === 'SIGNED_IN' && isMounted) {
                const currentPath = window.location.pathname;
                if (currentPath === '/' || currentPath.startsWith('/auth')) {
                  const redirectPath = adminStatus ? '/admin/dashboard' : '/dashboard';
                  console.log('[SimpleAuth] Redirecting to:', redirectPath);
                  window.location.href = redirectPath;
                }
              }
            } catch (error) {
              console.error('[SimpleAuth] Error loading user data:', error);
              if (isMounted) {
                setLoading(false);
              }
            }
          }, 100);
        } else {
          if (isMounted) {
            setProfile(null);
            setIsAdmin(false);
            setLoading(false);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        
        setTimeout(async () => {
          if (!isMounted) return;
          
          try {
            const [userProfile, adminStatus] = await Promise.all([
              fetchUserProfile(session.user.id),
              checkAdminStatus()
            ]);
            
            if (isMounted) {
              setProfile(userProfile);
              setIsAdmin(adminStatus);
              setLoading(false);
            }
          } catch (error) {
            console.error('[SimpleAuth] Error loading initial user data:', error);
            if (isMounted) {
              setLoading(false);
            }
          }
        }, 100);
      } else {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (data.user && !data.session) {
        return { 
          data, 
          error: null,
          needsConfirmation: true,
          message: "Please check your email and click the confirmation link to activate your account."
        };
      }
      
      return { data, error };
    } catch (error) {
      console.error('[SimpleAuth] Sign up error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { 
            data: null, 
            error: { 
              ...error, 
              message: "Invalid email or password. Please check your credentials." 
            }
          };
        }
      }
      
      return { data, error };
    } catch (error) {
      console.error('[SimpleAuth] Sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut();
      
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAdmin(false);
      
      window.location.href = '/';
    } catch (error) {
      console.error('[SimpleAuth] Sign out error:', error);
      window.location.href = '/';
    }
  };

  const signInWithGoogle = async () => {
    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      return { data, error };
    } catch (error) {
      console.error('[SimpleAuth] Google sign in error:', error);
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data as Profile);
      return { data, error: null };
    } catch (error) {
      console.error('[SimpleAuth] Update profile error:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    profile,
    session,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    updateProfile
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};
