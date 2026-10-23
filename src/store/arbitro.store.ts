import { create } from 'zustand';
import type { Arbitro } from '@core/types/arbitro.types';
import { PaginatedResponse } from '@core/types/api.types';
import { arbitroService } from '@infrastructure/services/arbitro.service';

interface ArbitroState {
  arbitros: Arbitro[];
  selectedArbitro: Arbitro | null;
  isLoading: boolean;
  pagination: PaginatedResponse<Arbitro>['pagination'] | null;
  error: string | null;

  fetchAll: (page?: number, limit?: number, params?: Record<string, unknown>) => Promise<PaginatedResponse<Arbitro>>;
  fetchById: (id: string) => Promise<void>;
  setSelected: (arbitro: Arbitro | null) => void;
  clearError: () => void;
}

// Identifica o pedido de listagem mais recente; respostas de pedidos anteriores são ignoradas
let latestFetchAllId = 0;

export const useArbitroStore = create<ArbitroState>((set) => ({
  arbitros: [],
  selectedArbitro: null,
  isLoading: false,
  pagination: null,
  error: null,

  fetchAll: async (page = 1, limit = 12, params?: Record<string, unknown>) => {
    const requestId = ++latestFetchAllId;
    set({ isLoading: true, error: null });

    try {
      const response = await arbitroService.getAll({ page, limit, ...params });
      if (requestId !== latestFetchAllId) return response;

      set({
        arbitros: response.data,
        pagination: response.pagination,
        isLoading: false,
      });

      return response;
    } catch (error) {
      if (requestId !== latestFetchAllId) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar árbitros';
      set({
        arbitros: [],
        pagination: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const arbitro = await arbitroService.getById(id);
      set({ selectedArbitro: arbitro, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar árbitro';
      set({ isLoading: false, error: errorMessage, selectedArbitro: null });
      throw error;
    }
  },

  setSelected: (arbitro: Arbitro | null) => set({ selectedArbitro: arbitro }),

  clearError: () => set({ error: null }),
}));