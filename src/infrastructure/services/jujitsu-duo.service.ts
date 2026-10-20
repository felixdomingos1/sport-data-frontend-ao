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

export interface PlacarDisplayDuo {
  inscricaoId: string;
  ataques: { codigo: string; revelado: boolean; total: number | null; partes: { codigo: string; nome: string; valor: number | null }[] }[];
  variedade: number | null;
  penalizacoes: number;
  total: number;
  ataquesRevelados: number;
  completo: boolean;
  posicao: number | null;
}

export interface BatalhaDuo {
  id: string;
  numero: number;
  serie?: string | null;
  area?: number | null;
  estado: string;
  agendadoPara?: string | null;
  ronda: string;
  rondaNumero?: number;
  formato: 'CONFRONTO_DIRETO' | 'SERIE';
  categoria: string;
  ataques: string[];
  variedadeAtiva: boolean;
  juris: { necessarios: number; comFolha: number };
  emAtuacao: string | null;
  participantes: { cor: CorEquipaDuo | null; ordem: number; inscricao: DuplaPublica; placar: PlacarDisplayDuo }[];
}

export interface CabecalhoDisplayDuo {
  nome: string;
  estado: string;
  local?: string | null;
  dataInicio?: string;
  federacao?: { nome: string; logo?: string | null };
}

export interface BatalhasDuo {
  competicao: CabecalhoDisplayDuo;
  batalhas: BatalhaDuo[];
}

export interface DisplayDuo {
  competicao: CabecalhoDisplayDuo;
  area: number | null;
  areas: number[];
  atualizadoEm: string;
  confronto: BatalhaDuo | null;
}

class JujitsuDuoService {
  /** Placar do ecrã da competição para uma área (público). */
  async display(campeonatoId: string, filtro: { area?: number; confrontoId?: string } = {}): Promise<DisplayDuo> {
    const params = { ...(filtro.area ? { area: filtro.area } : {}), ...(filtro.confrontoId ? { confronto: filtro.confrontoId } : {}) };
    return apiClient.get<DisplayDuo>(API_ENDPOINTS.JIU_JITSU_DUO.DISPLAY(campeonatoId), { params });
  }

  /** Batalhas (confrontos/séries) da competição Duo, com o placar atual de cada dupla (público). */
  async batalhas(campeonatoId: string): Promise<BatalhasDuo> {
    return apiClient.get<BatalhasDuo>(API_ENDPOINTS.JIU_JITSU_DUO.BATALHAS(campeonatoId));
  }

  /** Calendário e resultados publicados de um campeonato Duo (sem autenticação). */
  async publicoPorCampeonato(campeonatoId: string): Promise<DuoPublico> {
    return apiClient.get<DuoPublico>(API_ENDPOINTS.JIU_JITSU_DUO.PUBLICO_CAMPEONATO(campeonatoId));
  }
}

export const jujitsuDuoService = new JujitsuDuoService();
