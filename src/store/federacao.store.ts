import { create } from 'zustand';
import { Federacao, PaginatedResponse } from '@core/types/api.types';
import { federacaoService } from '@infrastructure/services/federacao.service';

interface FederacaoState {
  federacoes: Federacao[];
  selectedFederacao: Federacao | null;
  federacaoAtual: Federacao | null; // Alias para selectedFederacao
  isLoading: boolean;
  pagination: PaginatedResponse<Federacao>['pagination'] | null;
  error: string | null;

  fetchAll: (page?: number, limit?: number) => Promise<void>;
  fetchFederacaoById: (id: string) => Promise<void>; // Renomeado para clareza
  fetchById: (id: string) => Promise<void>; // Mantido para compatibilidade
  create: (data: Partial<Federacao>) => Promise<Federacao>;
  update: (id: string, data: Partial<Federacao>) => Promise<Federacao>;
  setSelected: (federacao: Federacao | null) => void;
  clearError: () => void;
}

export const useFederacaoStore = create<FederacaoState>((set, get) => ({
  federacoes: [],
  selectedFederacao: null,
  federacaoAtual: null,
  isLoading: false,
  pagination: null,
  error: null,

  fetchAll: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await federacaoService.getAll({ page, limit });
      set({
        federacoes: response.data,
        pagination: response.pagination,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar federações';
      set({
        federacoes: [],
        isLoading: false,
        error: errorMessage,
        pagination: null
      });
    }
  },

  fetchFederacaoById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const federacao = await federacaoService.getById(id);
      set({
        selectedFederacao: federacao,
        federacaoAtual: federacao,
        isLoading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar federação';
      set({
        selectedFederacao: null,
        federacaoAtual: null,
        isLoading: false,
        error: errorMessage
      });
    }
  },

  // Alias para fetchFederacaoById (compatibilidade)
  fetchById: async (id: string) => {
    return get().fetchFederacaoById(id);
  },

  create: async (data: Partial<Federacao>) => {
    set({ isLoading: true, error: null });
    try {
      const federacao = await federacaoService.create(data);
      set((state) => ({
        federacoes: [federacao, ...state.federacoes],
        isLoading: false
      }));
      return federacao;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar federação';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  update: async (id: string, data: Partial<Federacao>) => {
    set({ isLoading: true, error: null });
    try {
      const federacao = await federacaoService.update(id, data);
      set((state) => ({
        federacoes: state.federacoes.map((f) => (f.id === id ? federacao : f)),
        selectedFederacao: state.selectedFederacao?.id === id ? federacao : state.selectedFederacao,
        federacaoAtual: state.federacaoAtual?.id === id ? federacao : state.federacaoAtual,
        isLoading: false,
      }));
      return federacao;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar federação';
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  setSelected: (federacao: Federacao | null) => set({
    selectedFederacao: federacao,
    federacaoAtual: federacao
  }),

  clearError: () => set({ error: null }),
}));
