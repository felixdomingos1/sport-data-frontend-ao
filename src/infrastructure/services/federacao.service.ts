// infrastructure/services/federacao.service.ts
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import {
  Federacao,
  ApiPaginatedResponse,
  PaginatedResponse,
  toPaginatedResponse
} from '@core/types/api.types';

interface GetAllFederacaoParams {
  page?: number;
  limit?: number;
}

class FederacaoService {
  async getAll(params?: GetAllFederacaoParams): Promise<PaginatedResponse<Federacao>> {
    const response = await apiClient.get<ApiPaginatedResponse<Federacao>>(
      API_ENDPOINTS.FEDERACOES.BASE,
      { params }
    );
    return toPaginatedResponse(response);
  }

  async getById(id: string): Promise<Federacao> {
    return apiClient.get<Federacao>(API_ENDPOINTS.FEDERACOES.BY_ID(id));
  }

  async create(data: Partial<Federacao>): Promise<Federacao> {
    return apiClient.post<Federacao>(API_ENDPOINTS.FEDERACOES.BASE, data);
  }

  async update(id: string, data: Partial<Federacao>): Promise<Federacao> {
    return apiClient.put<Federacao>(API_ENDPOINTS.FEDERACOES.BY_ID(id), data);
  }
}

export const federacaoService = new FederacaoService();
