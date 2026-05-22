import { AuthUser } from "../entities/auth.entity";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function toPaginatedResponse<T>(
  response: ApiPaginatedResponse<T>
): PaginatedResponse<T> {
  const { page, limit, total } = response.pagination;
  const totalPages = Math.ceil(total / limit);
  return {
    data: response.data,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

export interface User {
  id: string;
  email: string;
  nome: string;
  telefone: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}


export interface Atleta {
  id: string;
  usuarioId: string;
  nomeCompleto: string;
  bi: string;
  passaporte?: string;
  dataNascimento: string;
  genero: 'M' | 'F';
  nacionalidade: string;
  usuario?: User;
}


export interface Role {
  id: string;
  nome: string;
  descricao?: string;
  sistema: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permissao {
  id: string;
  nome: string;
  descricao?: string;
  modulo: string;
  createdAt: string;
  updatedAt: string;
}



export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export type LoginApiResponse = {
  user: AuthUser;
  token: string;
  refreshToken: string;
  success: boolean;
  status: number;
  statusMessage: string;
};

export interface RefreshTokenResponse {
  token: string;
}
export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface Federacao {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  email: string;
  telefone: string;
  website?: string;
  endereco?: string;
  logo?: string;
  status: 'ATIVA' | 'INATIVA' | 'SUSPENSA';
  createdAt: string;
  updatedAt: string;
  admins?: FederacaoAdmin[];
  clubes?: Clube[];
  campeonatos?: Campeonato[];
  atletas?: InscricaoAtleta[];
  planos?: Plano[];
  rankingGerals?: RankingGeral[];
  _count?: {
    clubes: number;
    campeonatos: number;
    atletas: number;
  };
}

export interface FederacaoAdmin {
  id: string;
  usuarioId: string;
  federacaoId: string;
  papel: 'ADMIN' | 'GESTOR' | 'VISUALIZADOR';
  createdAt: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface Clube {
  id: string;
  nome: string;
  slug: string;
  federacaoId: string;
  logo?: string;
  cidade?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  website?: string;
  anoFundacao?: number;
  status: 'ATIVO' | 'SUSPENSO' | 'CANCELADO';
  planoAtivoId?: string;
  createdAt: string;
  updatedAt: string;
  federacao?: Federacao;
  atletas?: InscricaoAtleta[];
  planoAtivo?: PlanoClube;
  pagamentos?: PagamentoClube[];
  _count?: {
    atletas: number;
    pagamentos: number;
  };
}

export interface Campeonato {
  id: string;
  federacaoId: string;
  nome: string;
  descricao?: string;
  temporada: string;
  modalidade: string;
  tipo: 'INDIVIDUAL' | 'EQUIPAS' | 'MISTO';
  formato: 'LIGA' | 'KNOCKOUT' | 'GRUPOS' | 'MISTO';
  pesoEvento: number;
  dataInicio: string;
  dataFim: string;
  dataInscricaoInicio?: string;
  dataInscricaoFim?: string;
  status: 'RASCUNHO' | 'INSCRICOES_ABERTAS' | 'INSCRICOES_FECHADAS' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
  regulamento?: string;
  premioTotal?: number;
  createdAt: string;
  updatedAt: string;
  federacao?: Federacao;
  categorias?: CategoriaCampeonato[];
  inscricoes?: ParticipacaoCampeonato[];
  fases?: Fase[];
  partidas?: Partida[];
  rankingCampeonato?: RankingCampeonato[];
  _count?: {
    inscricoes: number;
    partidas: number;
    fases: number;
  };
}

export interface CategoriaCampeonato {
  id: string;
  campeonatoId: string;
  nome: string;
  idadeMinima?: number;
  idadeMaxima?: number;
  genero?: string;
  createdAt: string;

  // Relacionamentos
  campeonato?: Campeonato;
  participacoes?: ParticipacaoCampeonato[];
}

export interface ParticipacaoCampeonato {
  id: string;
  inscricaoId: string;
  campeonatoId: string;
  categoriaId: string;
  status: 'INSCRITO' | 'CONFIRMADO' | 'DESCLASSIFICADO' | 'DESISTENTE';
  numeroCamisola?: number;
  pontos: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  golsPro: number;
  golsContra: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  createdAt: string;
  updatedAt: string;

  // Relacionamentos
  inscricao?: InscricaoAtleta;
  campeonato?: Campeonato;
  categoria?: CategoriaCampeonato;
  partidas?: JogadorPartida[];
  rankingCampeonato?: RankingCampeonato[];
}

export interface InscricaoAtleta {
  id: string;
  atletaId: string;
  federacaoId: string;
  clubeId?: string;
  status: 'DRAFT' | 'AGUARDANDO_PAGAMENTO' | 'EM_ANALISE' | 'ATIVO' | 'SUSPENSO' | 'EXPIRADO' | 'CANCELADO';
  numeroRegistro?: string;
  planoId: string;
  dataInicio: string;
  dataFim: string;
  createdAt: string;
  updatedAt: string;

  // Relacionamentos
  atleta?: Atleta;
  federacao?: Federacao;
  clube?: Clube;
  plano?: Plano;
  pagamentos?: Pagamento[];
  participacoes?: ParticipacaoCampeonato[];
}

export interface Plano {
  id: string;
  federacaoId: string;
  nome: string;
  descricao?: string;
  tipo: 'ATLETA' | 'CLUBE' | 'ACADEMIA';
  duracao: 'MENSAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';
  preco: number;
  moeda: string;
  beneficios: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;

  // Relacionamentos
  federacao?: Federacao;
  inscricoes?: InscricaoAtleta[];
  clubes?: PlanoClube[];
}

export interface PlanoClube {
  id: string;
  clubeId: string;
  planoId: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;

  // Relacionamentos
  clube?: Clube;
  plano?: Plano;
  pagamentos?: PagamentoClube[];
}

export interface Pagamento {
  id: string;
  inscricaoId: string;
  valor: number;
  moeda: string;
  taxaPlataforma?: number;
  taxaGateway?: number;
  valorLiquido?: number;
  metodo: 'MULTICAIXA' | 'UNITEL_MONEY' | 'APPYPAY' | 'BANCO' | 'TRANSFERENCIA';
  status: 'PENDENTE' | 'PROCESSANDO' | 'CONFIRMADO' | 'FALHOU' | 'REEMBOLSADO' | 'EXPIRADO';
  referenciaExterna?: string;
  comprovativo?: string;
  dataPagamento?: string;
  dataExpiracao?: string;
  tentativas: number;
  ultimoErro?: string;
  createdAt: string;
  updatedAt: string;
  inscricao?: InscricaoAtleta;
  transacoes?: Transacao[];
}

export interface PagamentoClube {
  id: string;
  clubeId: string;
  planoClubeId: string;
  valor: number;
  moeda: string;
  metodo: string;
  status: string;
  referenciaExterna?: string;
  comprovativo?: string;
  dataPagamento?: string;
  createdAt: string;
  updatedAt: string;

  // Relacionamentos
  clube?: Clube;
  planoClube?: PlanoClube;
}

export interface Transacao {
  id: string;
  pagamentoId: string;
  tipo: 'DEBITO' | 'CREDITO' | 'ESTORNO' | 'TAXA';
  valor: number;
  descricao?: string;
  status: 'PENDENTE' | 'CONCLUIDA' | 'FALHOU' | 'REVERTIDA';
  saldoAnterior?: number;
  saldoPosterior?: number;
  createdAt: string;
  pagamento?: Pagamento;
}

export interface Partida {
  id: string;
  campeonatoId: string;
  faseId?: string;
  grupoId?: string;
  rodada?: number;
  dataHora: string;
  local?: string;
  status: 'AGENDADA' | 'EM_ANDAMENTO' | 'INTERVALO' | 'FINALIZADA' | 'CANCELADA' | 'ADIADA';
  vencedorId?: string;
  createdAt: string;
  updatedAt: string;
  campeonato?: Campeonato;
  fase?: Fase;
  grupo?: Grupo;
  jogadores?: JogadorPartida[];
  apostas?: Aposta[];
}

export interface JogadorPartida {
  id: string;
  partidaId: string;
  participacaoId: string;
  gols: number;
  assistencias: number;
  cartaoAmarelo: boolean;
  cartaoVermelho: boolean;
  tempoJogado?: number;
  avaliacao?: number;
  vencedor?: boolean;
  createdAt: string;
  updatedAt: string;
  partida?: Partida;
  participacao?: ParticipacaoCampeonato;
}

export interface Fase {
  id: string;
  campeonatoId: string;
  nome: string;
  ordem: number;
  tipo: 'GRUPOS' | 'ELIMINATORIA' | 'MISTO';
  quantidadeClassificados?: number;
  createdAt: string;
  campeonato?: Campeonato;
  grupos?: Grupo[];
  partidas?: Partida[];
}

export interface Grupo {
  id: string;
  faseId: string;
  nome: string;
  createdAt: string;
  fase?: Fase;
  partidas?: Partida[];
}

export interface RankingCampeonato {
  id: string;
  campeonatoId: string;
  participacaoId: string;
  posicao: number;
  pontos: number;
  createdAt: string;
  updatedAt: string;
  campeonato?: Campeonato;
  participacao?: ParticipacaoCampeonato;
}

export interface RankingGeral {
  id: string;
  federacaoId: string;
  atletaId: string;
  modalidade: string;
  categoria?: string;
  pontos: number;
  posicao: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  partidas: number;
  sequenciaVitorias: number;
  createdAt: string;
  updatedAt: string;
  federacao?: Federacao;
  atleta?: Atleta;
  historico?: HistoricoRanking[];
}

export interface HistoricoRanking {
  id: string;
  rankingId: string;
  pontos: number;
  posicao: number;
  dataRegistro: string;
  ranking?: RankingGeral;
}

export interface Aposta {
  id: string;
  usuarioId: string;
  partidaId: string;
  valor: number;
  moeda: string;
  tipoAposta: 'VENCEDOR' | 'PLACAR_EXATO' | 'MAIS_GOLS' | 'MENOS_GOLS' | 'AMBOS_MARCAM' | 'HANDICAP';
  odd: number;
  ganhoPotencial: number;
  status: 'PENDENTE' | 'CONFIRMADA' | 'GANHA' | 'PERDIDA' | 'CANCELADA' | 'REEMBOLSADA';
  valorPago?: number;
  dataResolucao?: string;
  createdAt: string;
  updatedAt: string;
  usuario?: User;
  partida?: Partida;
}

export interface Notificacao {
  id: string;
  usuarioId: string;
  titulo: string;
  mensagem: string;
  tipo: 'email' | 'sms' | 'push' | 'websocket';
  lida: boolean;
  createdAt: string;
  updatedAt: string;
  usuario?: User;
}
