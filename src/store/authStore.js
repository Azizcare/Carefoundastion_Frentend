import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { authService } from '../services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          const { token, user } = response;
          
          // Store token in cookie
          Cookies.set('token', token, { expires: 7 });
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Login failed'
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          const { token, user } = response;
          
          // Store token in cookie
          Cookies.set('token', token, { expires: 7 });
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed'
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          // Log error but don't block logout - network errors are handled in authService
          console.warn('Logout API call failed (proceeding with local logout):', error.message);
        } finally {
          // Always clear all auth data, even if API call fails
          Cookies.remove('token');
          localStorage.removeItem('token');
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('pendingDonation');
            sessionStorage.removeItem('donorInfo');
          }
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const response = await authService.getCurrentUser();
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Failed to get user'
          });
          throw error;
        }
      },

      updateUser: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authService.updateDetails(userData);
          set({
            user: response.user,
            isLoading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Update failed'
          });
          throw error;
        }
      },

      updatePassword: async (passwordData) => {
        set({ isLoading: true });
        try {
          const response = await authService.updatePassword(passwordData);
          set({
            isLoading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Password update failed'
          });
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          const response = await authService.forgotPassword(email);
          set({
            isLoading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to send reset email'
          });
          throw error;
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.resetPassword(token, password);
          set({
            isLoading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Password reset failed'
          });
          throw error;
        }
      },

      verifyEmail: async (token) => {
        set({ isLoading: true });
        try {
          const response = await authService.verifyEmail(token);
          set({
            isLoading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Email verification failed'
          });
          throw error;
        }
      },

      resendVerification: async () => {
        set({ isLoading: true });
        try {
          const response = await authService.resendVerification();
          set({
            isLoading: false,
            error: null
          });
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to resend verification'
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      // Initialize auth state from token
      initializeAuth: () => {
        const token = Cookies.get('token');
        if (token) {
          set({ token, isAuthenticated: true });
          // Optionally fetch user data
          get().getCurrentUser();
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        // Called when storage is rehydrated
        if (state) {
          state._hasHydrated = true;
          // If user exists in storage, verify with server
          if (state.user && state.isAuthenticated) {
            state.getCurrentUser().catch(() => {
              // If verification fails, clear auth
              Cookies.remove('token');
              state.user = null;
              state.token = null;
              state.isAuthenticated = false;
            });
          }
        }
      }
    }
  )
);

export default useAuthStore;
