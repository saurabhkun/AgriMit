import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  
  login: (userData) => set({
    user: userData,
    role: userData.role,
    isAuthenticated: true,
  }),
  
  register: (userData) => set({
    user: userData,
    role: userData.role,
    isAuthenticated: true,
  }),
  
  logout: () => set({
    user: null,
    role: null,
    isAuthenticated: false,
  }),
  
  setRole: (role) => set({ role }),
}));

