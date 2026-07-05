import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import {
  Evento,
  ApiPaginatedResponse,
  PaginatedResponse,
  toPaginatedResponse,
} from '@core/types/api.types';

interface GetAllEventosParams {
  page?: number;
  limit?: number;
  status?: string;
  tipo?: string;
  modalidade?: string;
  search?: string;
}

class EventoService {
  async getAll(params?: GetAllEventosParams): Promise<PaginatedResponse<Evento>> {
    const response = await apiClient.get<ApiPaginatedResponse<Evento>>(
      API_ENDPOINTS.EVENTOS.BASE,
      { params },
    );
    return toPaginatedResponse(response);
  }

  async getById(id: string): Promise<Evento> {
    return apiClient.get<Evento>(API_ENDPOINTS.EVENTOS.BY_ID(id));
  }

  async create(data: Partial<Evento>): Promise<Evento> {
    return apiClient.post<Evento>(API_ENDPOINTS.EVENTOS.BASE, data);
  }

  async update(id: string, data: Partial<Evento>): Promise<Evento> {
    return apiClient.put<Evento>(API_ENDPOINTS.EVENTOS.BY_ID(id), data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.EVENTOS.BY_ID(id));
  }
}

export const eventoService = new EventoService();
