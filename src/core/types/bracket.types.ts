export type BracketFormat =
  | 'SINGLE_ELIMINATION'
  | 'DOUBLE_ELIMINATION'
  | 'ROUND_ROBIN'
  | 'SWISS'
  | 'LEAGUE'
  | 'GROUPS_PLAYOFFS'
  | 'CONSOLATION'
  | 'REPESCAM'
  | 'PERSONALIZADO';

export type BracketStatus = 'DRAFT' | 'READY' | 'IN_PROGRESS' | 'FINALIZADO' | 'CANCELADO';

export type BracketMatchStatus =
  | 'AGENDADA'
  | 'EM_ESPERA'
  | 'CHAMANDO'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA'
  | 'WO'
  | 'BYE'
  | 'DESCLASSIFICADA';

export type BracketSection =
  | 'PRINCIPAL'
  | 'PERDEDORES'
  | 'FINAL'
  | 'BRONZE'
  | 'GRUPO'
  | 'REPESCAGEM';

export type SeedMode = 'AUTOMATICO' | 'MANUAL' | 'RANKING' | 'ALEATORIO';

export interface BracketConfig {
  melhorDe?: number;
  terceiroLugar?: boolean;
  repescagem?: boolean;
  resetFinal?: boolean;
  grupos?: {
    quantidade: number;
    participantesPorGrupo?: number;
    classificadosPorGrupo: number;
    melhorTerceiro?: boolean;
  };
  swiss?: {
    rodadas: number;
    criterios?: string[];
  };
  voltas?: number;
  pontosVitoria?: number;
  pontosEmpate?: number;
  pontosDerrota?: number;
  seed?: SeedMode;
  customRounds?: Array<{ nome: string; participantes: number }>;
  [key: string]: unknown;
}

export interface BracketParticipant {
  id: string;
  nome?: string;
  seed?: number | null;
  clube?: string | null;
  bandeira?: string | null;
  foto?: string | null;
  pontos?: number;
  [key: string]: unknown;
}

export interface BracketMatch {
  id: string;
  round: number;
  matchNumber: number;
  section: BracketSection;
  group?: string | null;
  roundLabel?: string;
  participantA?: string | null;
  participantB?: string | null;
  scoreA?: number | null;
  scoreB?: number | null;
  status: BracketMatchStatus;
  winnerId?: string | null;
  loserId?: string | null;
  nextMatchId?: string | null;
  nextMatchSlot?: 0 | 1 | null;
  isBye: boolean;
  isFinal: boolean;
  isBronze: boolean;
  tempo?: string | null;
  area?: string | null;
  metadata?: Record<string, unknown>;
}

export interface BracketState {
  id?: string;
  campeonatoId?: string;
  categoriaId?: string;
  nome?: string;
  formato: BracketFormat;
  status: BracketStatus;
  config: BracketConfig;
  participantes: BracketParticipant[];
  rounds: number;
  matches: BracketMatch[];
  metadata?: Record<string, unknown>;
}

export interface StandingsRow {
  participanteId: string;
  pontos: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  jogos: number;
  golsPro: number;
  golsContra: number;
  saldoGols: number;
}

export interface BracketStatistics {
  totalAtletas: number;
  totalLutas: number;
  totalRounds: number;
  totalByes: number;
  totalWalkovers: number;
  totalDesclassificacoes: number;
  totalFinalizadas: number;
  totalCanceladas: number;
  tempoMedioMinutos: number | null;
  percentualConclusao: number;
  campeaoId: string | null;
  viceCampeaoId: string | null;
  terceiroId: string | null;
}

export interface BracketDto {
  id: string;
  campeonatoId: string;
  categoriaId: string | null;
  faseId: string | null;
  nome: string;
  formato: BracketFormat;
  status: BracketStatus;
  rounds: number;
  config: BracketConfig;
  participantes: BracketParticipant[];
  state: BracketState;
  statistics: BracketStatistics;
  classificacao?: StandingsRow[];
  createdAt: string;
  updatedAt: string;
}

export interface BracketSummary {
  id: string;
  campeonatoId: string;
  categoriaId: string | null;
  categoriaNome?: string | null;
  nome: string;
  formato: BracketFormat;
  status: BracketStatus;
  rounds: number;
  totalParticipantes: number;
  totalLutas: number;
  totalFinalizadas: number;
  percentualConclusao: number;
  campeaoId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const BRACKET_FORMATO_LABELS: Record<BracketFormat, string> = {
  SINGLE_ELIMINATION: 'Eliminação Simples',
  DOUBLE_ELIMINATION: 'Dupla Eliminação',
  ROUND_ROBIN: 'Todos Contra Todos',
  SWISS: 'Sistema Suíço',
  LEAGUE: 'Liga',
  GROUPS_PLAYOFFS: 'Grupos + Playoffs',
  CONSOLATION: 'Consolação',
  REPESCAM: 'Repescagem',
  PERSONALIZADO: 'Personalizado',
};

export const BRACKET_STATUS_LABELS: Record<BracketStatus, string> = {
  DRAFT: 'Rascunho',
  READY: 'Pronto',
  IN_PROGRESS: 'Em Andamento',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

export const BRACKET_MATCH_STATUS_LABELS: Record<BracketMatchStatus, string> = {
  AGENDADA: 'Agendada',
  EM_ESPERA: 'Em Espera',
  CHAMANDO: 'Chamando',
  EM_ANDAMENTO: 'Ao Vivo',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
  WO: 'W.O.',
  BYE: 'Bye',
  DESCLASSIFICADA: 'Desclassificada',
};
