export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  nome: string;
  password: string;
  telefone: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  telefone?: string
  roles: string[];
}
