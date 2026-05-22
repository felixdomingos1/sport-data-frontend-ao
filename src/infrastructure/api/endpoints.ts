export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/pub/register',
    LOGIN: '/auth/pub/login',
    REFRESH_TOKEN: '/auth/pub/refresh-token',
    LOGOUT: '/auth/prot/logout',
    ME: '/auth/prot/me',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  FEDERACOES: {
    BASE: '/federations',
    BY_ID: (id: string) => `/federations/${id}`,
  },
  CLUBES: {
    BASE: '/clubes',
    BY_ID: (id: string) => `/clubes/${id}`,
    ASSOCIATE_ATLETA: '/clubes/associate-atleta',
  },
  ATLETAS: {
    BASE: '/atletas',
    BY_ID: (id: string) => `/atletas/${id}`,
    DOCUMENTOS: '/atletas/documentos',
    INSCRICAO: '/atletas/inscricao',
  },
  ROLES: {
    BASE: '/roles',
    ASSIGN_PERMISSION: '/roles/assign-permission',
  },
  PERMISSOES: {
    BASE: '/permissao',
  },
  PLANOS: {
    BASE: '/planos',
  },
  CAMPEONATOS: {
    BASE: '/campeonatos',
    BY_ID: (id: string) => `/campeonatos/${id}`,
    BY_FEDERACAO: (federacaoId: string) => `/campeonatos/federacao/${federacaoId}`,
    BY_STATUS: (status: string) => `/campeonatos/status/${status}`,
    ACTIVE: '/campeonatos/active',
    INSCREVER: (id: string) => `/campeonatos/${id}/inscrever`,
    CLASSIFICACAO: (id: string) => `/campeonatos/${id}/classificacao`,
    JOGOS: (id: string) => `/campeonatos/${id}/jogos`,
  },
  NOTIFICACOES: {
    ENVIAR: '/notificacoes/enviar',
  },
};
