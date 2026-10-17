import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import {
  ApiPaginatedResponse,
  PaginatedResponse,
  toPaginatedResponse,
} from '@core/types/api.types';
import type { Arbitro } from '@core/types/arbitro.types';

interface GetAllArbitrosParams {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  faixa?: string;
  federacaoId?: string;
  associacaoId?: string;
}

class ArbitroService {
  async getAll(params?: GetAllArbitrosParams): Promise<PaginatedResponse<Arbitro>> {
    const response = await apiClient.get<ApiPaginatedResponse<Arbitro>>(
      API_ENDPOINTS.ARBITROS.BASE,
      { params }
    );
    return toPaginatedResponse(response);
  }

  async getById(id: string): Promise<Arbitro> {
    return apiClient.get<Arbitro>(API_ENDPOINTS.ARBITROS.BY_ID(id));
  }
}

export const arbitroService = new ArbitroService();