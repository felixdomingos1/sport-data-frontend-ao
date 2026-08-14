import { io, Socket } from 'socket.io-client';
import type { BracketStatistics, BracketState } from '../../core/types/bracket.types';
import { getSocketBaseUrl } from '../api/client';

const SOCKET_URL = getSocketBaseUrl();

let socket: Socket | null = null;
const joinedRooms = new Set<string>();

export interface BracketSocketPayload {
  bracketId: string;
  campeonatoId: string;
  evento?: string;
  state: BracketState;
  statistics: BracketStatistics;
}

export interface SumulaSocketPayload {
  bracketId: string;
  matchId: string;
  evento?: string;
  sumula: Record<string, unknown>;
}

function getStoredToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)sport_token=([^;]*)`),
  );
  const token = match ? match[1] : null;
  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }
  return token;
}

/**
 * RF-07.4 — liga ao socket mesmo sem sessão (modo público/anónimo).
 * O servidor aceita conexões sem token restritas a salas públicas.
 */
export function connectSocket(): Socket | null {
  if (socket?.connected) return socket;
  if (socket) {
    socket.disconnect();
  }

  const token = getStoredToken();
  socket = io(SOCKET_URL, {
    auth: token ? { token } : {},
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connection_status', (data: { public: boolean }) => {
    console.log(`[Socket] Conexão ${data.public ? 'pública' : 'autenticada'}:`, socket?.id);
  });

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
  joinedRooms.clear();
}

export function joinCampeonato(campeonatoId: string): void {
  const s = connectSocket();
  if (!s) return;
  const key = `campeonato:${campeonatoId}`;
  if (joinedRooms.has(key)) return;
  s.emit('join_campeonato', { campeonatoId });
  joinedRooms.add(key);
}

export function leaveCampeonato(campeonatoId: string): void {
  if (!socket) return;
  socket.emit('leave_campeonato', { campeonatoId });
  joinedRooms.delete(`campeonato:${campeonatoId}`);
}

export function joinBracket(bracketId: string): void {
  const s = connectSocket();
  if (!s) return;
  const key = `bracket:${bracketId}`;
  if (joinedRooms.has(key)) return;
  s.emit('join_bracket', { bracketId });
  joinedRooms.add(key);
}

export function leaveBracket(bracketId: string): void {
  if (!socket) return;
  socket.emit('leave_bracket', { bracketId });
  joinedRooms.delete(`bracket:${bracketId}`);
}

export function onBracketAtualizado(cb: (payload: BracketSocketPayload) => void): () => void {
  const s = connectSocket();
  if (!s) return () => undefined;
  s.on('bracket:atualizado', cb);
  return () => {
    s.off('bracket:atualizado', cb);
  };
}

export function onBracketRemovido(cb: (payload: { bracketId: string }) => void): () => void {
  const s = connectSocket();
  if (!s) return () => undefined;
  s.on('bracket:removido', cb);
  return () => {
    s.off('bracket:removido', cb);
  };
}

export function onSumulaAtualizada(cb: (payload: SumulaSocketPayload) => void): () => void {
  const s = connectSocket();
  if (!s) return () => undefined;
  s.on('bracket:sumula-atualizada', cb);
  return () => {
    s.off('bracket:sumula-atualizada', cb);
  };
}

export interface NotificacaoSocketPayload {
  id: string;
  titulo: string;
  mensagem: string;
  tipo?: string;
  lida: boolean;
  createdAt: string;
}

export function onNovaNotificacao(cb: (payload: NotificacaoSocketPayload) => void): () => void {
  const s = connectSocket();
  if (!s) return () => undefined;
  s.on('new_notification', cb);
  return () => {
    s.off('new_notification', cb);
  };
}

export interface AssinaturaAtivadaPayload {
  assinaturaId: string;
  referencia: string;
}

export function onAssinaturaAtivada(cb: (payload: AssinaturaAtivadaPayload) => void): () => void {
  const s = connectSocket();
  if (!s) return () => undefined;
  s.on('assinatura:ativada', cb);
  return () => {
    s.off('assinatura:ativada', cb);
  };
}
