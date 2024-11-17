import { create } from "zustand";
import { showJobsInterface, MobileSidebarInterface } from "./types";

interface Store {
  showJobsModal: showJobsInterface;
  setShowJobsModal: (showJobsModal: showJobsInterface) => void;
  sidebar: MobileSidebarInterface;
  setShow: (sidebar: MobileSidebarInterface) => void;
}

export const useStore = create<Store>((set) => ({
  showJobsModal: {
    show: false,
    message: "",
  },
  setShowJobsModal: (showJobsModal) => set({ showJobsModal }),

  sidebar: {
    show: false,
    id: "",
  },
  setShow: (sidebar) => set((state) => ({ ...state, sidebar })),
}));
