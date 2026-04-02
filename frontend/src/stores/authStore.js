import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null, // 'farmer' or 'expert'

      login: async (email, password, role) => {
        // Mock login for now - no backend
        setTimeout(() => {
          set({
            user: { id: 1, name: 'Demo User', email, role },
            token: 'mock-jwt-token-' + Date.now(),
            role,
          });
        }, 1000);
      },

      register: async (name, email, password, role) => {
        // Mock register
        setTimeout(() => {
          set({
            user: { id: Date.now(), name, email, role },
            token: 'mock-jwt-token-' + Date.now(),
            role,
          });
        }, 1000);
      },

      logout: () => {
        set({ user: null, token: null, role: null });
      },

      isAuthenticated: () => !!get().token,
      isFarmer: () => get().role === 'farmer',
      isExpert: () => get().role === 'expert',
    }),
    {
      name: 'auth-storage',
    }
  )
);

