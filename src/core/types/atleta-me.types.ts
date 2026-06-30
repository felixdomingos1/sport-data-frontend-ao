import type { InscricaoAtleta, Pagamento, ParticipacaoCampeonato } from './api.types';

export type StatusDocumento = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export type TipoDocumento =
  | 'FOTO_3X4'
  | 'BI'
  | 'PASSAPORTE'
  | 'CARTA_CONDUCAO'
  | 'COMPROVATIVO_RESIDENCIA'
  | 'CERTIFICADO_MEDICO'
  | 'SEGURO_DESPORTIVO'
  | 'TERMO_RESPONSABILIDADE';

export interface DocumentoAtleta {
  id: string;
  atletaId: string;
  tipo: TipoDocumento;
  url: string;
  hash?: string | null;
  status: StatusDocumento;
  motivoRejeicao?: string | null;
  validadoPor?: string | null;
  validadoEm?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AtletaMe {
  id: string;
  usuarioId: string;
  nomeCompleto: string;
  bi: string;
  passaporte?: string | null;
  dataNascimento: string;
  genero: 'M' | 'F';
  nacionalidade: string;
  imagemUrl?: string | null;
  bannerUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  documentos?: DocumentoAtleta[];
  inscricoes?: InscricaoAtleta[];
  usuario?: {
    id: string;
    nome: string;
    email: string;
    telefone?: string | null;
    status?: string;
  };
}

export interface AtletaDashboardMetricas {
  totalInscricoes: number;
  inscricoesAtivas: number;
  totalCompeticoes: number;
  totalDocumentos: number;
  documentosPendentes: number;
  documentosAprovados: number;
  rankingGeral: number | null;
}

export interface AtletaDashboard {
  atleta: {
    id: string;
    nomeCompleto: string;
    imagemUrl?: string | null;
    nacionalidade: string;
    genero: string;
  };
  metricas: AtletaDashboardMetricas;
  ultimasInscricoes: InscricaoAtleta[];
  ultimasCompeticoes: ParticipacaoCampeonato[];
  documentos: DocumentoAtleta[];
}

export interface RankingAtletaItem {
  id: string;
  federacaoId: string;
  atletaId: string;
  modalidade: string;
  categoria?: string | null;
  pontos: number;
  posicao: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  partidas: number;
  atleta?: { id: string; nomeCompleto: string };
}

export interface RankingAtletaResponse {
  atletaId: string;
  rankings: RankingAtletaItem[];
}

export interface RankingGeralResponse {
  ranking: RankingAtletaItem[];
  total: number;
  filters: {
    federacaoId?: string;
    modalidade?: string;
    categoria?: string;
  };
}

export interface PagamentosListResponse {
  data: Pagamento[];
  total: number;
  page: number;
  limit: number;
}

export interface NotificacoesListResponse {
  data: import('./api.types').Notificacao[];
  totalNaoLidas: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface UpdateAtletaMeData {
  nomeCompleto?: string;
  dataNascimento?: string;
  genero?: 'M' | 'F';
  nacionalidade?: string;
  imagemUrl?: string;
}

export interface UploadDocumentoData {
  atletaId: string;
  tipo: TipoDocumento;
  url: string;
  hash?: string;
}

export interface CreatePagamentoData {
  inscricaoId: string;
  metodo: 'MULTICAIXA' | 'UNITEL_MONEY' | 'APPYPAY' | 'BANCO' | 'TRANSFERENCIA';
  valor: number;
  moeda?: string;
  referenciaExterna?: string;
}
