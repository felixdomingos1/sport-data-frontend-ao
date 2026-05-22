import { create } from 'zustand';
import type { Clube, PaginatedResponse } from '../core/types/api.types';
import { clubeService } from '../infrastructure/services/clube.service';

interface AssociateAtletaData {
  atletaId: string;
  clubeId: string;
  federacaoId: string;
  numeroRegistro: string;
}

interface ClubeState {
  clubes: Clube[];
  selectedClube: Clube | null;
  isLoading: boolean;
  pagination: PaginatedResponse<Clube>['pagination'] | null;
  error: string | null;

  fetchAll: (page?: number, limit?: number, federacaoId?: string) => Promise<void>;
  fetchById: (id: string) => Promise<void>;
  create: (data: Partial<Clube>) => Promise<Clube>;
  associateAtleta: (data: AssociateAtletaData) => Promise<{ success: boolean; message: string }>;
  setSelected: (clube: Clube | null) => void;
  clearError: () => void;
}

export const useClubeStore = create<ClubeState>((set) => ({
  clubes: [],
  selectedClube: null,
  isLoading: false,
  pagination: null,
  error: null,

  fetchAll: async (page = 1, limit = 10, federacaoId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await clubeService.getAll({ page, limit, federacaoId });
      set({
        clubes: response.data,
        pagination: response.pagination,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar clubes';
      set({
        clubes: [],
        isLoading: false,
        error: errorMessage,
        pagination: null
      });
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const clube = await clubeService.getById(id);
      set({ selectedClube: clube, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar clube';
      set({
        selectedClube: null,
        isLoading: false,
        error: errorMessage
      });
    }
  },

  create: async (data: Partial<Clube>) => {
    set({ isLoading: true, error: null });
    try {
      const clube = await clubeService.create(data);
      set((state) => ({
        clubes: [clube, ...state.clubes],
        isLoading: false
      }));
      return clube;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar clube';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  associateAtleta: async (data: AssociateAtletaData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await clubeService.associateAtleta(data);
      set({ isLoading: false });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao associar atleta';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  setSelected: (clube: Clube | null) => set({ selectedClube: clube }),

  clearError: () => set({ error: null }),
}));
