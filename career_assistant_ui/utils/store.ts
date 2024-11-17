import { create } from "zustand";
import { showJobsInterface } from "./types";

interface Store {
  showJobsModal: showJobsInterface;
  setShowJobsModal: (showJobsModal: showJobsInterface) => void;
}

export const useStore = create<Store>((set) => ({
  showJobsModal: {
    show: false,
    message: "",
  },
  setShowJobsModal: (showJobsModal) => set({ showJobsModal }),
}));
