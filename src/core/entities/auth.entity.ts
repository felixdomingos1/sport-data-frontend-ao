export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  nome: string;
  password: string;
  telefone: string;
  nomeCompleto?: string;
  dataNascimento?: string;
  genero?: string;
  numeroBI?: string;
  provincia?: string;
  modalidade?: string;
  federacaoId?: string;
  academiaId?: string;
  biUrl?: string;
  fotoUrl?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  roles: string[];
  perfis?: Array<{
    avatar?: string | null;
    bannerUrl?: string | null;
    bio?: string | null;
    cidade?: string | null;
    pais?: string;
  }>;
}
