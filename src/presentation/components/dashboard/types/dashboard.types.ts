export interface DashboardStats {
  totalFederacoes: number;
  totalClubes: number;
  totalAtletas: number;
  totalCampeonatos: number;
  eventosHoje: number;
  eventosAoVivo: number;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bg: string;
  trend?: number;
}

export interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'atleta' | 'campeonato' | 'partida' | 'pagamento';
  status: 'success' | 'info' | 'warning';
}

export interface ChartData {
  mes: string;
  atletas: number;
}
