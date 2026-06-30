import { create } from 'zustand';

interface LoadingState {
  visible: boolean;
  message: string;
  show: (message?: string) => void;
  hide: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  visible: false,
  message: 'A carregar...',
  show: (message = 'A carregar...') => set({ visible: true, message }),
  hide: () => set({ visible: false }),
}));
