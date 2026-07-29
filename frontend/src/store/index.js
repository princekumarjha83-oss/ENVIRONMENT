import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Theme
  darkMode: true,
  toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),

  // Selected city
  selectedCity: 'Delhi',
  setCity: (city) => set({ selectedCity: city }),

  // User auth
  user: JSON.parse(localStorage.getItem('ecowatch_user') || 'null'),
  token: localStorage.getItem('ecowatch_token') || null,
  setUser: (user, token) => {
    localStorage.setItem('ecowatch_user', JSON.stringify(user));
    localStorage.setItem('ecowatch_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('ecowatch_user');
    localStorage.removeItem('ecowatch_token');
    set({ user: null, token: null });
  },

  // Dashboard metrics cache
  metrics: null,
  setMetrics: (metrics) => set({ metrics }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

  // Alerts
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
}));

export default useStore;
