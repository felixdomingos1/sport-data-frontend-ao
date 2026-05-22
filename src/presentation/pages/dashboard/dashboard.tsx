import React from 'react';
import { useAuthStore } from '@/store/auth.store';
import {
  Calendar, Trophy, TrendingUp, Bell,
  Medal, Clock, ArrowRight, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const proximasPartidas = [
  { id: 1, adversario: 'Petro de Luanda', data: '20/06/2026', horario: '15:00', local: 'Estádio da Cidadela' },
  { id: 2, adversario: '1º de Agosto', data: '27/06/2026', horario: '16:00', local: 'Estádio 11 de Novembro' },
];

const meusCampeonatos = [
  { id: 1, nome: 'Campeonato Nacional', posicao: 5, pontos: 12, status: 'em_andamento' },
  { id: 2, nome: 'Torneio Regional', posicao: 2, pontos: 18, status: 'classificado' },
];

const ultimosResultados = [
  { id: 1, adversario: 'Sagrada Esperança', resultado: '2-0', data: '10/06/2026', vitoria: true },
  { id: 2, adversario: 'Kabuscorp', resultado: '1-1', data: '03/06/2026', vitoria: false },
];

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const userName = user?.nome?.split(' ')[0] || 'Atleta';

  const notificacoesNaoLidas = 3;

  return (
    <div className="space-y-6">
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Olá, {userName}! 👋</h1>
            <p className="text-red-100 mt-1">Bem-vindo ao seu painel de atleta</p>
          </div>
          <Link
            to="/notificacoes"
            className="relative p-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
          >
            <Bell className="w-5 h-5" />
            {notificacoesNaoLidas > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center">
                {notificacoesNaoLidas}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Stats Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-gray-500">Competições</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <Medal className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">5º</p>
          <p className="text-sm text-gray-500">Ranking Nacional</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm text-gray-500">Partidas</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <TrendingUp className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-2xl font-bold">+5</p>
          <p className="text-sm text-gray-500">Posições</p>
        </div>
      </div>

      {/* Próximas Partidas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold">Próximas Partidas</h2>
            </div>
            <Link to="/meus-campeonatos" className="text-sm text-red-500 hover:text-red-600">
              Ver todas →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {proximasPartidas.length > 0 ? (
            proximasPartidas.map((partida) => (
              <div key={partida.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">vs {partida.adversario}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{partida.data} • {partida.horario}</span>
                      <span className="text-xs text-gray-400">{partida.local}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">Nenhuma partida agendada</div>
          )}
        </div>
      </div>

      {/* Meus Campeonatos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold">Meus Campeonatos</h2>
              </div>
              <Link to="/meus-campeonatos" className="text-sm text-red-500 hover:text-red-600">
                Ver todos →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {meusCampeonatos.map((camp) => (
              <div key={camp.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{camp.nome}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">{camp.posicao}º lugar</span>
                      <span className="text-sm text-gray-500">{camp.pontos} pontos</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${camp.status === 'em_andamento'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                    }`}>
                    {camp.status === 'em_andamento' ? 'Em andamento' : 'Classificado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimos Resultados */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold">Últimos Resultados</h2>
              </div>
              <Link to="/historico" className="text-sm text-red-500 hover:text-red-600">
                Ver histórico →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {ultimosResultados.map((resultado) => (
              <div key={resultado.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">vs {resultado.adversario}</p>
                    <p className="text-sm text-gray-500 mt-1">{resultado.data}</p>
                  </div>
                  <div className={`text-right font-bold ${resultado.vitoria ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                    {resultado.resultado}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/meus-campeonatos"
          className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 transition"
        >
          <div>
            <p className="font-medium text-red-700 dark:text-red-300">Ver Campeonatos</p>
            <p className="text-sm text-red-600/70">Acompanhe suas competições</p>
          </div>
          <ArrowRight className="w-5 h-5 text-red-500" />
        </Link>
        <Link
          to="/perfil"
          className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 transition"
        >
          <div>
            <p className="font-medium text-blue-700 dark:text-blue-300">Meu Perfil</p>
            <p className="text-sm text-blue-600/70">Atualize seus dados</p>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-500" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
