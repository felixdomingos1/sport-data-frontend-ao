import type { Atleta, PaginatedResponse } from '../../core/types/api.types';
import type { DocumentUploadData, InscricaoData } from '../../core/types/document.types';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

interface CreateAtletaData {
  usuarioId: string;
  nomeCompleto: string;
  bi: string;
  passaporte?: string;
  dataNascimento: string;
  genero: 'M' | 'F';
  nacionalidade: string;
}

class AtletaService {
  async getAll(params?: { page?: number; limit?: number; clubeId?: string }): Promise<PaginatedResponse<Atleta>> {
    return apiClient.get<PaginatedResponse<Atleta>>(API_ENDPOINTS.ATLETAS.BASE, { params });
  }

  async getById(id: string): Promise<Atleta> {
    return apiClient.get<Atleta>(API_ENDPOINTS.ATLETAS.BY_ID(id));
  }

  async create(data: CreateAtletaData): Promise<Atleta> {
    return apiClient.post<Atleta>(API_ENDPOINTS.ATLETAS.BASE, data);
  }

  async uploadDocument(data: DocumentUploadData): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(API_ENDPOINTS.ATLETAS.DOCUMENTOS, data);
  }

  async createInscricao(data: InscricaoData): Promise<{ success: boolean; message: string; inscricaoId: string }> {
    return apiClient.post<{ success: boolean; message: string; inscricaoId: string }>(API_ENDPOINTS.ATLETAS.INSCRICAO, data);
  }
}

export const atletaService = new AtletaService();
