// src/store/authStore.ts
import { create } from "zustand";
import { persist, PersistStorage, StorageValue } from "zustand/middleware";
import { api, authApi } from "../utils/config";

interface User {
  user_id: number;
  username: string;
  role: string;
  reputation?: number;
}

interface ProfileUpdate {
  username?: string;
  password?: string;
}

interface ProfileData {
  user: User;
  questions: any[];
  answers: any[];
  votes_count: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  profileData: ProfileData | null;
  hydrated: boolean;
  
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<User>;
  updateProfile: (profileData: ProfileUpdate) => Promise<User>;
  loadProfileData: () => Promise<ProfileData>;
  logout: () => void;
  clearError: () => void;
  setHydrated: (state: boolean) => void;
  // Add a direct method to force update auth state
  forceUpdateAuthState: (user: User, token: string) => void;
}

// Define the type for the partialize state
type Partialized = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

// Simplified storage with better logging
const createDebugStorage = <T>(): PersistStorage<T> => {
  return {
    getItem: (name) => {

      const str = localStorage.getItem(name);
      if (!str) {

        return null;
      }
      
      try {
        const data = JSON.parse(str);

        return data;
      } catch (error) {
        return null;
      }
    },
    setItem: (name, value: StorageValue<T>) => {
      console.log(`[Auth Storage] Setting item: ${name}`, 
        (value.state as any)?.isAuthenticated ? 'User is authenticated' : 'User is not authenticated');
      
      // Store the data in localStorage
      localStorage.setItem(name, JSON.stringify(value));
      
      // Access properties using a type assertion
      const state = value.state as any;
      
      // Update the token in separate storage for easier access
      if (state.token) {
        console.log('[Auth Storage] Setting token in localStorage');
        localStorage.setItem("token", state.token);
      } else {
        console.log('[Auth Storage] Removing token from localStorage');
        localStorage.removeItem("token");
      }
    },
    removeItem: (name) => {
      console.log(`[Auth Storage] Removing item: ${name}`);
      localStorage.removeItem(name);
      localStorage.removeItem("token");
      localStorage.removeItem("auth_integrity");
    },
  };
};

// Create the store without immediately referencing it
const createAuthStore = () => 
  create<AuthState>()(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        profileData: null,
        hydrated: false,
        
        setHydrated: (state: boolean) => {
 
          set({ hydrated: state });
        },
        
        // Add a direct method to force update auth state - useful for debugging
        forceUpdateAuthState: (user: User, token: string) => {
      
          set({
            user,
            token,
            isAuthenticated: true
          });
        },
        
        login: async (username: string, password: string) => {

          set({ isLoading: true, error: null });
          
          try {
            // First API call - get the token

            const response = await api.post(`/users/login`, {
              username,
              password,
            });
            

            const { access_token } = response.data;
            
            if (!access_token) {
              throw new Error('No access token received from server');
            }
            
            // Store token immediately to ensure it's available for next request

            localStorage.setItem('token', access_token);
            
            // Second API call - get user details using the token

            const userResponse = await api.get(`/users/me`, {
              headers: { "x-user-token": access_token },
            });
            
            
            // Important: This timing is critical
            // First update the Zustand store state
            const userData = userResponse.data;
            
            set({
              token: access_token,
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
            
            // Then immediately ensure localStorage is updated with the same data
            // This step is to ensure consistency between Zustand store and localStorage

            localStorage.setItem('auth-storage', JSON.stringify({
              state: {
                user: userData,
                token: access_token,
                isAuthenticated: true
              },
              version: 0
            }));
            
            // Success!

            
          } catch (error: any) {
            console.error("[Auth Store] Login error:", error);
            set({
              error: error.response?.data?.detail || "Failed to login. Please check your credentials.",
              isLoading: false,
              isAuthenticated: false,
            });
            throw error;
          }
        },
        
        register: async (username: string, password: string) => {

          set({ isLoading: true, error: null });
          try {
            const response = await api.post(`/users/register`, {
              username,
              password,
            });
            
            set({ isLoading: false });

            return response.data;
          } catch (error: any) {

            set({
              error: error.response?.data?.detail || "Registration failed. Please try a different username.",
              isLoading: false,
            });
            throw error;
          }
        },
        
        loadProfileData: async () => {

          set({ isLoading: true, error: null });
          try {
            // Use authApi which automatically adds token to headers
            const response = await authApi.get(`/users/profile`);
            
            const profileData = response.data;
            
            // Store profile data in the state
            set({
              profileData,
              isLoading: false
            });
            

            return profileData;
          } catch (error: any) {

            set({
              error: error.response?.data?.detail || "Failed to load profile data",
              isLoading: false
            });
            
            throw error;
          }
        },
        
        updateProfile: async (profileData: ProfileUpdate) => {

          set({ isLoading: true, error: null });
          try {
            // Use authApi which automatically adds token to headers
            const response = await authApi.put(`/users/profile`, profileData);
            
            // Update the user in the store
            set({
              user: response.data,
              isLoading: false,
            });
            

            return response.data;
          } catch (error: any) {
            console.error("[Auth Store] Profile update error:", error);
            set({
              error: error.response?.data?.detail || "Failed to update profile",
              isLoading: false,
            });
            throw error;
          }
        },
        
        logout: () => {

          // Remove all auth data from localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("auth_integrity");
          
          // Reset state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            profileData: null
          });

        },
        
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: "auth-storage", 
        storage: createDebugStorage<Partialized>(),
        partialize: (state) => ({ 
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        }),
        onRehydrateStorage: () => (state) => {
          
          // When storage rehydration is complete, set hydrated flag to true
          if (state) {
            state.setHydrated(true);
          }
        },
      }
    )
  );

// Export the store
export const useAuthStore = createAuthStore();