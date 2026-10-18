import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export type CorEquipaDuo = 'VERMELHO' | 'AZUL';

export interface DuplaPublica {
  id: string;
  dupla: { designacao?: string | null };
  atleta1: { nomeCompleto: string };
  atleta2: { nomeCompleto: string };
  clube?: { nome: string; logo?: string | null } | null;
  provincia?: { nome: string } | null;
}

export interface ConfrontoPublico {
  id: string;
  numero: number;
  serie?: string | null;
  area?: number | null;
  agendadoPara?: string | null;
  estado: string;
  participantes: { cor: CorEquipaDuo | null; ordem: number; inscricao: DuplaPublica }[];
  resultados: {
    inscricaoId: string;
    total: number;
    posicao: number | null;
    vencedor: boolean;
    desqualificado: boolean;
    estado: 'VALIDADO' | 'HOMOLOGADO';
    ataques: { codigo: string; subtotal: number | null }[];
    penalizacoes: number;
  }[];
}

export interface DuoPublico {
  competicao: {
    id: string;
    estado: string;
    nome: string;
    dataInicio: string;
    dataFim: string;
    local?: string | null;
    provincia?: string | null;
    organizador?: string | null;
    regulamento?: { codigo: string; versao: string; estado: string } | null;
  };
  categorias: {
    id: string;
    nome: string;
    escalao?: string | null;
    grupo?: string | null;
    formato: 'CONFRONTO_DIRETO' | 'SERIE';
    duplasConfirmadas: number;
    classificacao: { estado: string; posicoes: { posicao: number | null; inscricao: DuplaPublica | null }[] } | null;
    rondas: { id: string; numero: number; nome: string; formato: string; ataques: string[]; confrontos: ConfrontoPublico[] }[];
  }[];
}

class JujitsuDuoService {
  /** Calendário e resultados publicados de um campeonato Duo (sem autenticação). */
  async publicoPorCampeonato(campeonatoId: string): Promise<DuoPublico> {
    return apiClient.get<DuoPublico>(API_ENDPOINTS.JIU_JITSU_DUO.PUBLICO_CAMPEONATO(campeonatoId));
  }
}

export const jujitsuDuoService = new JujitsuDuoService();
