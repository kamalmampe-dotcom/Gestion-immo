import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
}

interface UIStore {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  selectedPropertyId: string | null;
  notifications: Notification[];
  isLoading: boolean;
  modal: {
    isOpen: boolean;
    type?: string;
    data?: any;
  };

  // Theme
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Property Selection
  setSelectedPropertyId: (id: string | null) => void;

  // Notifications
  addNotification: (
    type: Notification["type"],
    title: string,
    message: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Loading
  setIsLoading: (loading: boolean) => void;

  // Modal
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        theme: "system",
        sidebarOpen: true,
        selectedPropertyId: null,
        notifications: [],
        isLoading: false,
        modal: {
          isOpen: false,
        },

        setTheme: (theme) => set({ theme }),

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),

        addNotification: (type, title, message, duration = 5000) => {
          const id = `notif_${Date.now()}_${Math.random()}`;
          set((state) => ({
            notifications: [
              ...state.notifications,
              { id, type, title, message, timestamp: Date.now() },
            ],
          }));

          if (duration > 0) {
            setTimeout(() => get().removeNotification(id), duration);
          }
        },

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearNotifications: () => set({ notifications: [] }),

        setIsLoading: (loading) => set({ isLoading: loading }),

        openModal: (type, data) =>
          set({ modal: { isOpen: true, type, data } }),
        closeModal: () =>
          set({ modal: { isOpen: false, type: undefined, data: undefined } }),
      }),
      {
        name: "ui-store",
      }
    )
  )
);
