import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client

// Define the shape of the context state
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>; // Add signOut function
  // Add profile data or other auth-related state if needed later
  // profile: UserProfile | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading until initial check is done

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    // Check initial session state
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (isMounted) {
          console.log("Auth state changed:", _event, newSession); // Log changes
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false); // Ensure loading is false after state change
        }
      }
    );

    // Cleanup listener on component unmount
    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    setLoading(true); // Optional: show loading during sign out
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      // Handle error appropriately, maybe show a toast
    }
    // State will update via onAuthStateChange listener
    setLoading(false);
  };

  // Value provided to consuming components
  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until initial auth check is complete */}
      {!loading && children}
      {/* Or show a loading spinner while loading */}
      {/* {loading ? <YourGlobalLoadingSpinner /> : children} */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
