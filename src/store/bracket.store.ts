import { create } from 'zustand';
import type {
  BracketDto,
  BracketState,
  BracketStatistics,
  BracketSummary,
} from '../core/types/bracket.types';
import { bracketService, type ListarBracketsParams } from '../infrastructure/services/bracket.service';
import {
  joinCampeonato,
  leaveCampeonato,
  onBracketAtualizado,
  onBracketRemovido,
} from '../infrastructure/services/socket.service';

interface AxiosErrorLike {
  response?: { data?: { message?: string } };
  message?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    const axiosError = error as AxiosErrorLike;
    if (axiosError.response?.data?.message) return axiosError.response.data.message;
    if (axiosError.message) return axiosError.message;
  }
  return 'Ocorreu um erro inesperado';
};

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

interface BracketStoreState {
  brackets: BracketSummary[];
  selected: BracketDto | null;
  isLoadingList: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  campeonatoIdSubscribed: string | null;

  fetchList: (params?: ListarBracketsParams) => Promise<BracketSummary[]>;
  fetchById: (bracketId: string) => Promise<BracketDto>;
  subscribeToCampeonato: (campeonatoId: string) => void;
  unsubscribeFromCampeonato: (campeonatoId: string) => void;
  applySocketUpdate: (payload: {
    bracketId: string;
    state: BracketState;
    statistics: BracketStatistics;
  }) => void;
  clear: () => void;
}

export const useBracketStore = create<BracketStoreState>()((set, get) => ({
  brackets: [],
  selected: null,
  isLoadingList: false,
  isLoadingDetail: false,
  error: null,
  campeonatoIdSubscribed: null,

  fetchList: async (params?: ListarBracketsParams) => {
    set({ isLoadingList: true, error: null });
    try {
      const brackets = await bracketService.listar(params);
      set({ brackets, isLoadingList: false });
      return brackets;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ isLoadingList: false, error: errorMessage, brackets: [] });
      throw createErrorWithCause(error, 'Erro ao buscar chaveamentos');
    }
  },

  fetchById: async (bracketId: string) => {
    set({ isLoadingDetail: true, error: null, selected: null });
    try {
      const selected = await bracketService.obter(bracketId);
      set({ selected, isLoadingDetail: false });
      return selected;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      set({ isLoadingDetail: false, error: errorMessage, selected: null });
      throw createErrorWithCause(error, 'Erro ao buscar chaveamento');
    }
  },

  subscribeToCampeonato: (campeonatoId: string) => {
    if (!campeonatoId) return;
    const current = get().campeonatoIdSubscribed;
    if (current === campeonatoId) return;
    if (current) {
      leaveCampeonato(current);
    }

    joinCampeonato(campeonatoId);

    onBracketAtualizado((payload) => {
      if (payload.campeonatoId !== campeonatoId) return;
      get().applySocketUpdate(payload);
    });

    onBracketRemovido((payload) => {
      const selected = get().selected;
      if (selected && payload.bracketId === selected.id) {
        set({ selected: null });
      }
      const brackets = get().brackets.filter((b) => b.id !== payload.bracketId);
      set({ brackets });
    });

    set({ campeonatoIdSubscribed: campeonatoId });
  },

  unsubscribeFromCampeonato: (campeonatoId: string) => {
    if (get().campeonatoIdSubscribed !== campeonatoId) return;
    leaveCampeonato(campeonatoId);
    set({ campeonatoIdSubscribed: null });
  },

  applySocketUpdate: (payload) => {
    const selected = get().selected;
    if (!selected) return;

    const updated: BracketDto = {
      ...selected,
      state: payload.state,
      statistics: payload.statistics,
      rounds: payload.state.rounds,
      status: payload.state.status,
      formato: payload.state.formato,
      participantes: payload.state.participantes,
      updatedAt: new Date().toISOString(),
    };
    set({ selected: updated });

    const brackets = get().brackets.map((b) =>
      b.id === payload.bracketId
        ? {
            ...b,
            status: payload.state.status,
            rounds: payload.state.rounds,
            totalFinalizadas: payload.statistics.totalFinalizadas,
            percentualConclusao: payload.statistics.percentualConclusao,
          }
        : b
    );
    set({ brackets });
  },

  clear: () => {
    const campeonatoId = get().campeonatoIdSubscribed;
    if (campeonatoId) {
      leaveCampeonato(campeonatoId);
    }
    set({ brackets: [], selected: null, campeonatoIdSubscribed: null, error: null });
  },
}));
