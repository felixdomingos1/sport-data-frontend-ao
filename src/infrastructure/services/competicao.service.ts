import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { Campeonato, Fase, Partida, RankingCampeonato } from '../../core/types/api.types';

export interface ClassificacaoItem {
  participacaoId: string;
  nomeEquipa?: string;
  nomeAtleta?: string;
  posicao: number;
  pontos: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  golsPro: number;
  golsContra: number;
  saldoGols: number;
}

class CompeticaoService {
  async getCampeonatosPublicos(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: Campeonato[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const statusFilter = params?.status ?? 'INSCRICOES_ABERTAS,EM_ANDAMENTO,FINALIZADO';
    return apiClient.get(API_ENDPOINTS.CAMPEONATOS.BASE, {
      params: { ...params, status: statusFilter },
    });
  }

  async getCampeonatoById(id: string): Promise<Campeonato> {
    return apiClient.get<Campeonato>(API_ENDPOINTS.CAMPEONATOS.BY_ID(id));
  }

  async getFases(campeonatoId: string): Promise<Fase[]> {
    return apiClient.get<Fase[]>(`/competicao/campeonatos/${campeonatoId}/fases`);
  }

  async getFaseById(faseId: string): Promise<Fase> {
    return apiClient.get<Fase>(`/competicao/fases/${faseId}`);
  }

  async getConfrontos(faseId: string): Promise<Partida[]> {
    return apiClient.get<Partida[]>(`/competicao/fases/${faseId}/confrontos`);
  }

  async getClassificacao(faseId: string): Promise<ClassificacaoItem[]> {
    return apiClient.get<ClassificacaoItem[]>(`/competicao/fases/${faseId}/classificacao`);
  }

  async getRankingCampeonato(campeonatoId: string): Promise<RankingCampeonato[]> {
    return apiClient.get<RankingCampeonato[]>(
      API_ENDPOINTS.CAMPEONATOS.CLASSIFICACAO(campeonatoId)
    );
  }

  async getJogos(campeonatoId: string, params?: { faseId?: string; status?: string }): Promise<Partida[]> {
    return apiClient.get<Partida[]>(API_ENDPOINTS.CAMPEONATOS.JOGOS(campeonatoId), { params });
  }
}

export const competicaoService = new CompeticaoService();
