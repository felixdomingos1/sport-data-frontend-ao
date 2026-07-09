import { create } from 'zustand';
import type {
  AtletaDashboard,
  AtletaMe,
  DocumentoAtleta,
  InscricaoAtletaData,
  RankingAtletaItem,
  UpdateAtletaMeData,
  UploadDocumentoData,
  CreatePagamentoData,
  TipoDocumento,
} from '@/core/types/atleta-me.types';
import type { InscricaoAtleta, Notificacao, Pagamento } from '@/core/types/api.types';
import { atletaMeService } from '@/infrastructure/services/atleta-me.service';

interface AtletaMeState {
  profile: AtletaMe | null;
  dashboard: AtletaDashboard | null;
  documentos: DocumentoAtleta[];
  pagamentos: Pagamento[];
  notificacoes: Notificacao[];
  notificacoesNaoLidas: number;
  rankingAtleta: RankingAtletaItem[];
  rankingGeral: RankingAtletaItem[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchDashboard: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateMe: (data: UpdateAtletaMeData) => Promise<void>;
  fetchDocumentos: () => Promise<void>;
  uploadDocumento: (tipo: TipoDocumento, file: File) => Promise<void>;
  fetchPagamentos: (inscricaoId?: string) => Promise<void>;
  createPagamento: (data: CreatePagamentoData) => Promise<void>;
  fetchNotificacoes: (apenasNaoLidas?: boolean) => Promise<void>;
  fetchNotificacoesCount: () => Promise<void>;
  marcarNotificacaoLida: (id: string) => Promise<void>;
  marcarTodasLidas: () => Promise<void>;
  inscreverAtletaFederacao: (data: InscricaoAtletaData) => Promise<InscricaoAtleta>;
  fetchRankings: () => Promise<void>;
  clearError: () => void;
}

export const useAtletaMeStore = create<AtletaMeState>((set, get) => ({
  profile: null,
  dashboard: null,
  documentos: [],
  pagamentos: [],
  notificacoes: [],
  notificacoesNaoLidas: 0,
  rankingAtleta: [],
  rankingGeral: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const dashboard = await atletaMeService.getDashboard();
      set({
        dashboard,
        documentos: dashboard.documentos,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar dashboard',
      });
    }
  },

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await atletaMeService.getMe();
      set({ profile, documentos: profile.documentos ?? [], isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar perfil',
      });
    }
  },

  updateMe: async (data) => {
    set({ isSaving: true, error: null });
    try {
      const profile = await atletaMeService.updateMe(data);
      set({ profile, isSaving: false });
    } catch (error) {
      set({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao actualizar perfil',
      });
      throw error;
    }
  },

  fetchDocumentos: async () => {
    set({ isLoading: true, error: null });
    try {
      const documentos = await atletaMeService.getMeusDocumentos();
      set({ documentos, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar documentos',
      });
    }
  },

  uploadDocumento: async (tipo, file) => {
    set({ isSaving: true, error: null });
    try {
      let profile = get().profile;
      if (!profile) {
        profile = await atletaMeService.getMe();
        set({ profile });
      }
      const { url } = await atletaMeService.uploadToCloudinary(file);
      const payload: UploadDocumentoData = {
        atletaId: profile!.id,
        tipo,
        url,
      };
      await atletaMeService.uploadDocumento(payload);
      await get().fetchDocumentos();
      set({ isSaving: false });
    } catch (error) {
      set({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao enviar documento',
      });
      throw error;
    }
  },

  fetchPagamentos: async (inscricaoId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await atletaMeService.getPagamentos({ inscricaoId, limit: 50 });
      set({ pagamentos: result.data, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar pagamentos',
      });
    }
  },

  createPagamento: async (data) => {
    set({ isSaving: true, error: null });
    try {
      await atletaMeService.createPagamento(data);
      await get().fetchPagamentos(data.inscricaoId);
      set({ isSaving: false });
    } catch (error) {
      set({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao criar pagamento',
      });
      throw error;
    }
  },

  fetchNotificacoes: async (apenasNaoLidas) => {
    set({ isLoading: true, error: null });
    try {
      const result = await atletaMeService.getNotificacoes({ limit: 50, apenasNaoLidas });
      set({
        notificacoes: result.data,
        notificacoesNaoLidas: result.totalNaoLidas,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar notificações',
      });
    }
  },

  fetchNotificacoesCount: async () => {
    try {
      const count = await atletaMeService.getNotificacoesCount();
      set({ notificacoesNaoLidas: count });
    } catch {
      set({ notificacoesNaoLidas: 0 });
    }
  },

  marcarNotificacaoLida: async (id) => {
    await atletaMeService.marcarNotificacaoLida(id);
    set((state) => ({
      notificacoes: state.notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n)),
      notificacoesNaoLidas: Math.max(0, state.notificacoesNaoLidas - 1),
    }));
  },

  marcarTodasLidas: async () => {
    await atletaMeService.marcarTodasNotificacoesLidas();
    set((state) => ({
      notificacoes: state.notificacoes.map((n) => ({ ...n, lida: true })),
      notificacoesNaoLidas: 0,
    }));
  },

  fetchRankings: async () => {
    set({ isLoading: true, error: null });
    try {
      let profile = get().profile;
      if (!profile) {
        profile = await atletaMeService.getMe();
        set({ profile });
      }
      const inscricao = profile?.inscricoes?.find((i) => i.status === 'ATIVO') ?? profile?.inscricoes?.[0];
      const federacaoId = inscricao?.federacaoId;

      const [rankingGeralResult, rankingAtletaResult] = await Promise.allSettled([
        atletaMeService.getRankingGeral({ federacaoId, limit: 20 }),
        atletaMeService.getRankingAtleta(profile!.id, federacaoId),
      ]);

      set({
        rankingGeral:
          rankingGeralResult.status === 'fulfilled' ? rankingGeralResult.value.ranking : [],
        rankingAtleta:
          rankingAtletaResult.status === 'fulfilled' ? rankingAtletaResult.value.rankings : [],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar rankings',
      });
    }
  },

  inscreverAtletaFederacao: async (data) => {
    set({ isSaving: true, error: null });
    try {
      const inscricao = await atletaMeService.inscreverAtletaFederacao(data);
      set((state) => ({
        profile: state.profile
          ? { ...state.profile, inscricoes: [...(state.profile.inscricoes ?? []), inscricao] }
          : null,
        isSaving: false,
      }));
      return inscricao;
    } catch (error) {
      set({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Erro ao inscrever na federação',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
