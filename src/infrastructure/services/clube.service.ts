// infrastructure/services/clube.service.ts
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import {
  Clube,
  ApiPaginatedResponse,
  PaginatedResponse,
  toPaginatedResponse
} from '@core/types/api.types';

interface GetAllClubeParams {
  page?: number;
  limit?: number;
  federacaoId?: string;
}

interface AssociateAtletaData {
  atletaId: string;
  clubeId: string;
  federacaoId: string;
  numeroRegistro: string;
}

class ClubeService {
  async getAll(params?: GetAllClubeParams): Promise<PaginatedResponse<Clube>> {
    const response = await apiClient.get<ApiPaginatedResponse<Clube>>(
      API_ENDPOINTS.CLUBES.BASE,
      { params }
    );
    return toPaginatedResponse(response);
  }

  async getById(id: string): Promise<Clube> {
    return apiClient.get<Clube>(API_ENDPOINTS.CLUBES.BY_ID(id));
  }

  async create(data: Partial<Clube>): Promise<Clube> {
    return apiClient.post<Clube>(API_ENDPOINTS.CLUBES.BASE, data);
  }

  async associateAtleta(data: AssociateAtletaData): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.CLUBES.ASSOCIATE_ATLETA,
      data
    );
  }
}

export const clubeService = new ClubeService();
