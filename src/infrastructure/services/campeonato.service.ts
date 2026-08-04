import { toPaginatedResponse, type ApiPaginatedResponse, type Campeonato, type PaginatedResponse } from '../../core/types/api.types';
import type { CampeonatoInscricaoData } from '../../core/types/document.types';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface CreateCampeonatoData {
  federacaoId: string;
  nome: string;
  descricao?: string;
  temporada: string;
  modalidade: string;
  tipo: 'INDIVIDUAL' | 'EQUIPAS';
  formato: 'LIGA' | 'COPINHA' | 'ELIMINACAO';
  dataInicio: string;
  dataFim: string;
  dataInscricaoInicio: string;
  dataInscricaoFim: string;
  regulamento?: string;
  premioTotal?: number;
}

export interface InscricaoResponse {
  success: boolean;
  message: string;
  inscricaoCampeonatoId: string;
}


export interface UpdateCampeonatoData extends Partial<CreateCampeonatoData> {
  status?: 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
}

export interface CampeonatoFilters {
  page?: number;
  limit?: number;
  federacaoId?: string;
  status?: string;
  temporada?: string;
  modalidade?: string;
  tipo?: 'INDIVIDUAL' | 'EQUIPAS';
  formato?: 'LIGA' | 'COPINHA' | 'ELIMINACAO';
  dataInicio?: string;
  dataFim?: string;
}

class CampeonatoService {
  async getAll(params?: { page?: number; limit?: number; federacaoId?: string; status?: string }): Promise<PaginatedResponse<Campeonato>> {
    return apiClient.get<PaginatedResponse<Campeonato>>(API_ENDPOINTS.CAMPEONATOS.BASE, { params });
  }

  async getById(id: string): Promise<Campeonato> {
    return apiClient.get<Campeonato>(`${API_ENDPOINTS.CAMPEONATOS.BASE}/${id}`);
  }

  async create(data: CreateCampeonatoData): Promise<Campeonato> {
    return apiClient.post<Campeonato>(API_ENDPOINTS.CAMPEONATOS.BASE, data);
  }


  async update(id: string, data: Partial<CreateCampeonatoData>): Promise<Campeonato> {
    return apiClient.put<Campeonato>(API_ENDPOINTS.CAMPEONATOS.BY_ID(id), data);
  }

  async inscreverAtleta(campeonatoId: string, data: CampeonatoInscricaoData): Promise<InscricaoResponse> {
    return apiClient.post<InscricaoResponse>(API_ENDPOINTS.CAMPEONATOS.INSCREVER(campeonatoId), data);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.CAMPEONATOS.BY_ID(id)
    );
  }

  async getByFederacao(federacaoId: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Campeonato>> {
    const response = await apiClient.get<ApiPaginatedResponse<Campeonato>>(
      API_ENDPOINTS.CAMPEONATOS.BASE,
      { params: { ...params, federacaoId } }
    );
    return toPaginatedResponse(response);
  }

  async getByStatus(status: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Campeonato>> {
    const response = await apiClient.get<ApiPaginatedResponse<Campeonato>>(
      API_ENDPOINTS.CAMPEONATOS.BASE,
      { params: { ...params, status } }
    );
    return toPaginatedResponse(response);
  }

  async getActive(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Campeonato>> {
    const response = await apiClient.get<ApiPaginatedResponse<Campeonato>>(
      API_ENDPOINTS.CAMPEONATOS.BASE,
      { params: { ...params, status: 'INSCRICOES_ABERTAS' } }
    );
    return toPaginatedResponse(response);
  }
}

export const campeonatoService = new CampeonatoService();
