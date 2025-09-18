// Enhanced authentication context with role-based access
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { queryCache } from '@/lib/queryCache';

export type UserRole = 'patient' | 'doctor' | 'admin' | 'clinic_staff';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRoles: UserRole[];
  loading: boolean;
  userProfile: any;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isDoctor: () => boolean;
  isClinicStaff: () => boolean;
  isPatient: () => boolean;
  requestDataExport: () => Promise<void>;
  requestDataDeletion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user roles and profile after authentication
          setTimeout(async () => {
            await fetchUserRoles(session.user.id);
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserRoles([]);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          await fetchUserRoles(session.user.id);
          await fetchUserProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      // Check cache first
      const cachedRoles = queryCache.get<UserRole[]>(`roles_${userId}`);
      if (cachedRoles) {
        setUserRoles(cachedRoles);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;
      
      const roles = data?.map(r => r.role) || ['patient'];
      setUserRoles(roles);
      
      // Cache for 10 minutes
      queryCache.set(`roles_${userId}`, roles, 10 * 60 * 1000);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles(['patient']); // Default to patient role
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      // Check cache first
      const cachedProfile = queryCache.get(`profile_${userId}`);
      if (cachedProfile) {
        setUserProfile(cachedProfile);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setUserProfile(data);
      
      // Cache for 5 minutes
      if (data) {
        queryCache.set(`profile_${userId}`, data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) throw error;

      // Create profile if user is created
      if (data.user && userData) {
        const userType = userData.user_type || 'patient';
        
        // Check if profile already exists first
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!existingProfile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              email: email,
              full_name: userData.full_name || email,
              user_type: userType
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          } else {
            console.log('Profile created successfully');
          }
        } else {
          console.log('Profile already exists, updating user_type if needed');
          // Update the existing profile's user_type if different
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ user_type: userType })
            .eq('user_id', data.user.id);
          
          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        }
      }

      if (!error) {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
      setUserRoles([]);
      setUserProfile(null);
      
      // Clear cache on logout
      queryCache.clear();

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      
      // Update cache
      if (user) {
        queryCache.set(`profile_${user.id}`, updatedProfile);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Role checking utilities
  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isDoctor = (): boolean => hasRole('doctor');
  const isClinicStaff = (): boolean => hasRole('clinic_staff');
  const isPatient = (): boolean => hasRole('patient');

  // GDPR compliance functions
  const requestDataExport = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: user.id,
          request_type: 'data_export',
          details: { timestamp: new Date().toISOString() }
        });

      if (error) throw error;

      toast({
        title: "Data export requested",
        description: "Your data export request has been submitted. You will receive an email when ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error requesting data export",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const requestDataDeletion = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: user.id,
          request_type: 'data_deletion',
          details: { timestamp: new Date().toISOString() }
        });

      if (error) throw error;

      toast({
        title: "Data deletion requested",
        description: "Your data deletion request has been submitted. This may take up to 30 days to process.",
      });
    } catch (error: any) {
      toast({
        title: "Error requesting data deletion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    userRoles,
    loading,
    userProfile,
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasRole,
    isAdmin,
    isDoctor,
    isClinicStaff,
    isPatient,
    requestDataExport,
    requestDataDeletion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}