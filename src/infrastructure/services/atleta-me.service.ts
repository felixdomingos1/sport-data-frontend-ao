import type {
  AtletaDashboard,
  AtletaMe,
  CreatePagamentoData,
  DocumentoAtleta,
  NotificacoesListResponse,
  PagamentosListResponse,
  RankingAtletaResponse,
  RankingGeralResponse,
  UpdateAtletaMeData,
  UploadDocumentoData,
} from '@/core/types/atleta-me.types';
import type { Notificacao, Pagamento } from '@/core/types/api.types';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

class AtletaMeService {
  async getMe(): Promise<AtletaMe> {
    return apiClient.get<AtletaMe>(API_ENDPOINTS.ATLETAS.ME);
  }

  async updateMe(data: UpdateAtletaMeData): Promise<AtletaMe> {
    return apiClient.put<AtletaMe>(API_ENDPOINTS.ATLETAS.ME, data);
  }

  async getDashboard(): Promise<AtletaDashboard> {
    return apiClient.get<AtletaDashboard>(API_ENDPOINTS.ATLETAS.ME_DASHBOARD);
  }

  async getMeusDocumentos(): Promise<DocumentoAtleta[]> {
    return apiClient.get<DocumentoAtleta[]>(API_ENDPOINTS.ATLETAS.ME_DOCUMENTOS);
  }

  async uploadDocumento(data: UploadDocumentoData): Promise<DocumentoAtleta> {
    return apiClient.post<DocumentoAtleta>(API_ENDPOINTS.ATLETAS.DOCUMENTOS, data);
  }

  async getPagamentos(params?: {
    page?: number;
    limit?: number;
    inscricaoId?: string;
    status?: string;
  }): Promise<PagamentosListResponse> {
    return apiClient.get<PagamentosListResponse>(API_ENDPOINTS.PAGAMENTOS.BASE, { params });
  }

  async createPagamento(data: CreatePagamentoData): Promise<Pagamento> {
    return apiClient.post<Pagamento>(API_ENDPOINTS.PAGAMENTOS.BASE, data);
  }

  async getNotificacoes(params?: {
    page?: number;
    limit?: number;
    apenasNaoLidas?: boolean;
  }): Promise<NotificacoesListResponse> {
    return apiClient.get<NotificacoesListResponse>(API_ENDPOINTS.NOTIFICACOES.BASE, {
      params: {
        ...params,
        apenasNaoLidas: params?.apenasNaoLidas ? 'true' : undefined,
      },
    });
  }

  async getNotificacoesCount(): Promise<number> {
    const result = await apiClient.get<{ count: number }>(API_ENDPOINTS.NOTIFICACOES.COUNT);
    return result.count;
  }

  async marcarNotificacaoLida(id: string): Promise<Notificacao> {
    return apiClient.patch<Notificacao>(API_ENDPOINTS.NOTIFICACOES.LER(id));
  }

  async marcarTodasNotificacoesLidas(): Promise<void> {
    await apiClient.put(API_ENDPOINTS.NOTIFICACOES.LER_TODAS);
  }

  async getRankingAtleta(atletaId: string, federacaoId?: string): Promise<RankingAtletaResponse> {
    return apiClient.get<RankingAtletaResponse>(API_ENDPOINTS.COMPETICAO.RANKING_ATLETA(atletaId), {
      params: federacaoId ? { federacaoId } : undefined,
    });
  }

  async getRankingGeral(params?: {
    federacaoId?: string;
    modalidade?: string;
    categoria?: string;
    limit?: number;
  }): Promise<RankingGeralResponse> {
    return apiClient.get<RankingGeralResponse>(API_ENDPOINTS.COMPETICAO.RANKING_GERAL, { params });
  }

  async getUploadSignature(): Promise<{
    timestamp: number;
    signature: string;
    cloudName: string;
    apiKey: string;
    folder: string;
  }> {
    return apiClient.get(API_ENDPOINTS.UPLOAD.SIGNATURE);
  }

  async uploadToCloudinary(file: File, folder = 'sport-data-angola'): Promise<{ url: string; publicId: string }> {
    const signatureData = await this.getUploadSignature();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', String(signatureData.timestamp));
    formData.append('signature', signatureData.signature);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`,
      { method: 'POST', body: formData },
    );

    if (!response.ok) {
      throw new Error('Falha ao enviar ficheiro para o Cloudinary');
    }

    const result = await response.json();
    return { url: result.secure_url, publicId: result.public_id };
  }
}

export const atletaMeService = new AtletaMeService();
