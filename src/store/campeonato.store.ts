// store/campeonato.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Campeonato, PaginatedResponse } from '../core/types/api.types';
import {
  CampeonatoFilters,
  campeonatoService,
  CreateCampeonatoData,
  UpdateCampeonatoData
} from '../infrastructure/services/campeonato.service';

interface CampeonatoState {
  campeonatos: Campeonato[];
  selectedCampeonato: Campeonato | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginatedResponse<Campeonato>['pagination'] | null;
  filters: CampeonatoFilters;

  fetchAll: (filters?: CampeonatoFilters) => Promise<PaginatedResponse<Campeonato>>;
  fetchById: (id: string) => Promise<void>;
  create: (data: CreateCampeonatoData) => Promise<Campeonato>;
  update: (id: string, data: UpdateCampeonatoData) => Promise<Campeonato>;
  delete: (id: string) => Promise<void>;
  fetchByFederacao: (federacaoId: string, page?: number, limit?: number) => Promise<void>;
  fetchByStatus: (status: string, page?: number, limit?: number) => Promise<void>;
  fetchActive: (page?: number, limit?: number) => Promise<void>;
  setFilters: (filters: Partial<CampeonatoFilters>) => void;
  clearFilters: () => void;
  setSelected: (campeonato: Campeonato | null) => void;
  clearError: () => void;
}

// Interface para erro do Axios
interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Função auxiliar para extrair erro - CORRIGIDA
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  return 'Ocorreu um erro inesperado';
};

// Função para criar erro com causa preservada
const createErrorWithCause = (error: unknown, defaultMessage: string): Error => {
  const errorMessage = getErrorMessage(error);
  const finalMessage = errorMessage || defaultMessage;

  if (error instanceof Error) {
    const newError = new Error(finalMessage);
    if (error.cause) newError.cause = error.cause;
    return newError;
  }

  return new Error(finalMessage);
};

const initialFilters: CampeonatoFilters = {
  page: 1,
  limit: 10,
};

export const useCampeonatoStore = create<CampeonatoState>()(
  persist(
    (set, get) => ({
      campeonatos: [],
      selectedCampeonato: null,
      isLoading: false,
      error: null,
      pagination: null,
      filters: initialFilters,

      fetchAll: async (filters?: CampeonatoFilters) => {
        set({ isLoading: true, error: null });
        try {
          const mergedFilters = { ...get().filters, ...filters };
          const response = await campeonatoService.getAll(mergedFilters);
          set({
            campeonatos: response.data,
            pagination: response.pagination,
            filters: mergedFilters,
            isLoading: false,
          });

          return response;
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          set({
            isLoading: false,
            error: errorMessage,
            campeonatos: [],
            pagination: null,
          });
          throw createErrorWithCause(error, 'Erro ao buscar campeonatos');
        }
      },

      fetchById: async (id: string) => {
        set({ isLoading: true, error: null, selectedCampeonato: null });

        try {
          const campeonato = await campeonatoService.getById(id);
          set({
            selectedCampeonato: campeonato,
            isLoading: false
          });
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          set({
            isLoading: false,
            error: errorMessage,
            selectedCampeonato: null,
          });
          throw createErrorWithCause(error, 'Erro ao buscar campeonato');
        }
      },

      create: async (data: CreateCampeonatoData) => {
        set({ isLoading: true, error: null });

        try {
          const newCampeonato = await campeonatoService.create(data);

          set((state) => ({
            campeonatos: [newCampeonato, ...state.campeonatos],
            isLoading: false,
          }));

          return newCampeonato;
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          set({ isLoading: false, error: errorMessage });
          throw createErrorWithCause(error, 'Erro ao criar campeonato');
        }
      },

      update: async (id: string, data: UpdateCampeonatoData) => {
        set({ isLoading: true, error: null });

        try {
          const updatedCampeonato = await campeonatoService.update(id, data);

          set((state) => ({
            campeonatos: state.campeonatos.map((c) =>
              c.id === id ? updatedCampeonato : c
            ),
            selectedCampeonato:
              state.selectedCampeonato?.id === id
                ? updatedCampeonato
                : state.selectedCampeonato,
            isLoading: false,
          }));

          return updatedCampeonato;
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          set({ isLoading: false, error: errorMessage });
          throw createErrorWithCause(error, 'Erro ao atualizar campeonato');
        }
      },

      delete: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await campeonatoService.delete(id);

          set((state) => ({
            campeonatos: state.campeonatos.filter((c) => c.id !== id),
            selectedCampeonato:
              state.selectedCampeonato?.id === id ? null : state.selectedCampeonato,
            isLoading: false,
          }));
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          set({ isLoading: false, error: errorMessage });
          throw createErrorWithCause(error, 'Erro ao deletar campeonato');
        }
      },

      fetchByFederacao: async (federacaoId: string, page = 1, limit = 10) => {
        set({ isLoading: true, error: null });

        try {
          const response = await campeonatoService.getByFederacao(federacaoId, { page, limit });

          set({
            campeonatos: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          set({
            isLoading: false,
            error: errorMessage,
            campeonatos: [],
            pagination: null,
          });
          throw createErrorWithCause(error, 'Erro ao buscar campeonatos por federação');
        }
      },

      fetchByStatus: async (status: string, page = 1, limit = 10) => {
        set({ isLoading: true, error: null });

        try {
          const response = await campeonatoService.getByStatus(status, { page, limit });

          set({
            campeonatos: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          set({
            isLoading: false,
            error: errorMessage,
            campeonatos: [],
            pagination: null,
          });
          throw createErrorWithCause(error, 'Erro ao buscar campeonatos por status');
        }
      },

      fetchActive: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });

        try {
          const response = await campeonatoService.getActive({ page, limit });

          set({
            campeonatos: response.data,
            pagination: response.pagination,
            isLoading: false,
          });
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          set({
            isLoading: false,
            error: errorMessage,
            campeonatos: [],
            pagination: null,
          });
          throw createErrorWithCause(error, 'Erro ao buscar campeonatos ativos');
        }
      },

      setFilters: (filters: Partial<CampeonatoFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));

        const currentFilters = { ...get().filters, ...filters };
        get().fetchAll(currentFilters);
      },

      clearFilters: () => {
        set({ filters: initialFilters });
        get().fetchAll(initialFilters);
      },

      setSelected: (campeonato: Campeonato | null) => {
        set({ selectedCampeonato: campeonato });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'campeonato-storage',
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);
