import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  BracketDto,
  BracketSummary,
} from '../../core/types/bracket.types';

export interface ListarBracketsParams {
  campeonatoId?: string;
  categoriaId?: string;
  search?: string;
  skip?: number;
  take?: number;
}

class BracketService {
  async listar(params?: ListarBracketsParams): Promise<BracketSummary[]> {
    return apiClient.get<BracketSummary[]>(API_ENDPOINTS.BRACKETS.BASE, {
      params,
    });
  }

  async listarPorCampeonato(campeonatoId: string): Promise<BracketSummary[]> {
    return this.listar({ campeonatoId, take: 100 });
  }

  async listarPorCategoria(categoriaId: string): Promise<BracketSummary[]> {
    return this.listar({ categoriaId, take: 100 });
  }

  async obter(bracketId: string): Promise<BracketDto> {
    return apiClient.get<BracketDto>(API_ENDPOINTS.BRACKETS.BY_ID(bracketId));
  }
}

export const bracketService = new BracketService();
