import create from "zustand";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const response = await fetch("/users/notification");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      set({ number: data });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
