import { create } from 'zustand';
import type { Plano } from '../core/types/api.types';
import { planoService } from '../infrastructure/services/plano.service';

interface PlanoState {
  planos: Plano[];
  selectedPlano: Plano | null;
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number; totalPages: number } | null;

  fetchAll: (page?: number, limit?: number, ativo?: boolean) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: Partial<Plano>) => Promise<Plano>;
  setSelected: (plano: Plano | null) => void;
}

export const usePlanoStore = create<PlanoState>((set) => ({
  planos: [],
  selectedPlano: null,
  isLoading: false,
  pagination: null,

  fetchAll: async (page = 1, limit = 10, ativo?: boolean) => {
    set({ isLoading: true });
    try {
      const response = await planoService.getAll({ page, limit, ativo });
      set({
        planos: response.data,
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        },
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true });
    try {
      const plano = await planoService.getById(id);
      set({ selectedPlano: plano, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  create: async (data) => {
    set({ isLoading: true });
    try {
      const plano = await planoService.create(data);
      set((state) => ({
        planos: [plano, ...state.planos],
        isLoading: false
      }));
      return plano;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setSelected: (plano: Plano | null) => set({ selectedPlano: plano }),
}));
