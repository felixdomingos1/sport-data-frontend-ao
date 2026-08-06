import type { PaginatedResponse, Plano } from '../../core/types/api.types';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

class PlanoService {
  async getAll(params?: { page?: number; limit?: number; ativo?: boolean }): Promise<PaginatedResponse<Plano>> {
    return apiClient.get<PaginatedResponse<Plano>>(API_ENDPOINTS.PLANOS.BASE, { params });
  }

  async getById(id: string): Promise<Plano> {
    return apiClient.get<Plano>(`${API_ENDPOINTS.PLANOS.BASE}/${id}`);
  }

  async create(data: Partial<Plano>): Promise<Plano> {
    return apiClient.post<Plano>(API_ENDPOINTS.PLANOS.BASE, data);
  }
}

export const planoService = new PlanoService();
