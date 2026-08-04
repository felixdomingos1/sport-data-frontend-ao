import { io, Socket } from 'socket.io-client';
import type { BracketStatistics, BracketState } from '../../core/types/bracket.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
const SOCKET_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

let socket: Socket | null = null;
const joinedRooms = new Set<string>();

export interface BracketSocketPayload {
  bracketId: string;
  campeonatoId: string;
  evento?: string;
  state: BracketState;
  statistics: BracketStatistics;
}

function getStoredToken(): string | null {
  const token = localStorage.getItem('access_token');
  if (!token || token === 'undefined' || token === 'null') {
    return null;
  }
  return token;
}

export function connectSocket(): Socket | null {
  const token = getStoredToken();
  if (!token) return null;
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
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
  if (joinedRooms.has(campeonatoId)) return;
  s.emit('join_campeonato', { campeonatoId });
  joinedRooms.add(campeonatoId);
}

export function leaveCampeonato(campeonatoId: string): void {
  if (!socket) return;
  socket.emit('leave_campeonato', { campeonatoId });
  joinedRooms.delete(campeonatoId);
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
