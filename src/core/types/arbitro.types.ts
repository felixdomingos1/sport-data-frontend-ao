export type CategoriaArbitro =
  | 'MESTRE'
  | 'INTERNACIONAL'
  | 'NACIONAL'
  | 'REGIONAL'
  | 'ESTADUAL';

export type FaixaArbitro =
  | 'BRANCA'
  | 'AZUL'
  | 'ROXA'
  | 'MARROM'
  | 'PRETA'
  | 'CORAL'
  | 'VERMELHA';

export type StatusArbitro = 'ATIVO' | 'INATIVO' | 'SUSPENSO';

export interface Arbitro {
  id: string;
  nome: string;
  categoria: CategoriaArbitro;
  faixa: FaixaArbitro;
  dataNascimento: string | null;
  telefone: string | null;
  email: string | null;
  bio: string | null;
  numeroLicenca: string | null;
  anosExperiencia: number | null;
  imagemUrl: string | null;
  avatar: string | null;
  federacaoId: string | null;
  associacaoId: string | null;
  status: StatusArbitro;
  createdAt: string;
  updatedAt: string;
  federacao?: {
    id: string;
    nome: string;
    logo: string | null;
    slug: string;
  } | null;
  associacao?: {
    id: string;
    nome: string;
    logo: string | null;
    slug: string;
  } | null;
}

export const CATEGORIA_ARBITRO_LABELS: Record<CategoriaArbitro, string> = {
  MESTRE: 'Mestre',
  INTERNACIONAL: 'Internacional',
  NACIONAL: 'Nacional',
  REGIONAL: 'Regional',
  ESTADUAL: 'Estadual',
};

export const FAIXA_ARBITRO_LABELS: Record<FaixaArbitro, string> = {
  BRANCA: 'Branca',
  AZUL: 'Azul',
  ROXA: 'Roxa',
  MARROM: 'Marrom',
  PRETA: 'Preta',
  CORAL: 'Coral',
  VERMELHA: 'Vermelha',
};