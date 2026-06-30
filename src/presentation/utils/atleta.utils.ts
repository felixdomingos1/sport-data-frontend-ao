import type { InscricaoAtleta } from '@/core/types/api.types';
import type { DocumentoAtleta, TipoDocumento } from '@/core/types/atleta-me.types';

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  FOTO_3X4: 'Foto 3x4',
  BI: 'Bilhete de Identidade',
  PASSAPORTE: 'Passaporte',
  CARTA_CONDUCAO: 'Carta de Condução',
  COMPROVATIVO_RESIDENCIA: 'Comprovativo de Residência',
  CERTIFICADO_MEDICO: 'Certificado Médico Desportivo',
  SEGURO_DESPORTIVO: 'Seguro Desportivo',
  TERMO_RESPONSABILIDADE: 'Termo de Responsabilidade',
};

export const OBRIGATORIOS: TipoDocumento[] = ['FOTO_3X4', 'BI', 'CERTIFICADO_MEDICO', 'TERMO_RESPONSABILIDADE'];

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'AT';
}

export function formatDatePt(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateLongPt(value?: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getGeneroLabel(genero?: string): string {
  if (genero === 'M') return 'Masculino';
  if (genero === 'F') return 'Feminino';
  return '—';
}

export function getInscricaoAtiva(inscricoes?: InscricaoAtleta[]): InscricaoAtleta | null {
  if (!inscricoes?.length) return null;
  return inscricoes.find((i) => i.status === 'ATIVO') ?? inscricoes[0];
}

export function getStatusInscricaoLabel(status?: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Rascunho',
    AGUARDANDO_PAGAMENTO: 'Aguardando pagamento',
    EM_ANALISE: 'Em análise',
    ATIVO: 'Ativo',
    SUSPENSO: 'Suspenso',
    EXPIRADO: 'Expirado',
    CANCELADO: 'Cancelado',
  };
  return status ? map[status] ?? status : '—';
}

export function getDocumentoLabel(doc: DocumentoAtleta): string {
  return TIPO_DOCUMENTO_LABELS[doc.tipo] ?? doc.tipo;
}

export function getMetodoPagamentoLabel(metodo: string): string {
  const map: Record<string, string> = {
    MULTICAIXA: 'Multicaixa',
    UNITEL_MONEY: 'Unitel Money',
    APPYPAY: 'AppyPay',
    BANCO: 'Transferência Bancária',
    TRANSFERENCIA: 'Transferência',
  };
  return map[metodo] ?? metodo;
}

export function getStatusPagamentoLabel(status: string): string {
  const map: Record<string, string> = {
    PENDENTE: 'Pendente',
    PROCESSANDO: 'Processando',
    CONFIRMADO: 'Confirmado',
    FALHOU: 'Falhou',
    REEMBOLSADO: 'Reembolsado',
    EXPIRADO: 'Expirado',
  };
  return map[status] ?? status;
}
