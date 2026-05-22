// stores/atleta.store.ts
import { create } from 'zustand';
import type { Atleta, PaginatedResponse } from '../core/types/api.types';
import type { InscricaoData } from '../core/types/document.types';
import { atletaService } from '../infrastructure/services/atleta.service';

interface CreateAtletaData {
  usuarioId: string;
  nomeCompleto: string;
  bi: string;
  passaporte?: string;
  dataNascimento: string;
  genero: 'M' | 'F';
  nacionalidade: string;
}

interface AtletaState {
  atletas: Atleta[];
  selectedAtleta: Atleta | null;
  isLoading: boolean;
  pagination: PaginatedResponse<Atleta>['pagination'] | null;
  error: string | null;

  fetchAll: (page?: number, limit?: number, clubeId?: string) => Promise<PaginatedResponse<Atleta>>;
  fetchById: (id: string) => Promise<void>;
  create: (data: CreateAtletaData) => Promise<Atleta>;
  createInscricao: (data: InscricaoData) => Promise<void>;
  setSelected: (atleta: Atleta | null) => void;
  clearError: () => void;
}

export const useAtletaStore = create<AtletaState>((set) => ({
  atletas: [],
  selectedAtleta: null,
  isLoading: false,
  pagination: null,
  error: null,

  fetchAll: async (page = 1, limit = 10, clubeId?: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await atletaService.getAll({ page, limit, clubeId });

      set({
        atletas: response.data,
        pagination: response.pagination,
        isLoading: false
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar atletas';
      set({
        isLoading: false,
        error: errorMessage,
        atletas: [],
        pagination: null
      });
      throw error;
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const atleta = await atletaService.getById(id);
      set({ selectedAtleta: atleta, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar atleta';
      set({
        isLoading: false,
        error: errorMessage,
        selectedAtleta: null
      });
      throw error;
    }
  },

  create: async (data: CreateAtletaData) => {
    set({ isLoading: true, error: null });
    try {
      const atleta = await atletaService.create(data);
      set((state) => ({
        atletas: [atleta, ...state.atletas],
        isLoading: false
      }));
      return atleta;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar atleta';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  createInscricao: async (data: InscricaoData) => {
    set({ isLoading: true, error: null });
    try {
      await atletaService.createInscricao(data);
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar inscrição';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  setSelected: (atleta: Atleta | null) => set({ selectedAtleta: atleta }),

  clearError: () => set({ error: null }),
}));
