import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface Assinatura {
  id: string;
  usuarioId: string;
  planoId: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  metodo?: string | null;
  comprovativo?: string | null;
  dataPagamento?: string | null;
  plano?: {
    id: string;
    nome: string;
    tipo: string;
    duracao: string;
    preco: string;
    moeda: string;
    beneficios: string[];
  } | null;
}

class AssinaturaService {
  async minhasAssinaturas(): Promise<{ assinaturas: Assinatura[]; ativa: Assinatura | null }> {
    const res = await apiClient.get<{ assinaturas: Assinatura[]; ativa: Assinatura | null }>(
      API_ENDPOINTS.ASSINATURAS.MINHAS
    );
    return (res as any)?.assinaturas ? (res as any) : { assinaturas: [], ativa: null };
  }

  async assinar(planoId: string): Promise<{ assinatura: Assinatura; plano: unknown }> {
    const res = await apiClient.post<{ assinatura: Assinatura; plano: unknown }>(
      API_ENDPOINTS.ASSINATURAS.BASE,
      { planoId }
    );
    return res as any;
  }

  async confirmarPagamento(
    assinaturaId: string,
    payload?: { metodo?: string; comprovativo?: string }
  ): Promise<Assinatura> {
    const res = await apiClient.post<Assinatura>(
      API_ENDPOINTS.ASSINATURAS.CONFIRMAR(assinaturaId),
      payload ?? {}
    );
    return res as any;
  }

  async cancelar(assinaturaId: string): Promise<Assinatura> {
    const res = await apiClient.post<Assinatura>(
      API_ENDPOINTS.ASSINATURAS.CANCELAR(assinaturaId)
    );
    return res as any;
  }
}

export const assinaturaService = new AssinaturaService();