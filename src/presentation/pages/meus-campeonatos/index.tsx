import React, { Activity, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Calendar, MapPin, Users,
  ChevronRight, Search, Filter, TrendingUp,
  CheckCircle, XCircle, AlertCircle, Medal,
  Star, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Campeonato {
  id: string;
  nome: string;
  federacao: string;
  modalidade: string;
  categoria: string;
  dataInicio: string;
  dataFim: string;
  local: string;
  status: 'inscrito' | 'em_andamento' | 'finalizado' | 'classificado' | 'eliminado';
  minhaPosicao?: number;
  pontos?: number;
  proximaPartida?: {
    adversario: string;
    data: string;
    local: string;
  };
}

const mockCampeonatos: Campeonato[] = [
  {
    id: '1',
    nome: 'Campeonato Nacional de Futebol 2026',
    federacao: 'Federação Angolana de Futebol',
    modalidade: 'Futebol',
    categoria: 'Sênior',
    dataInicio: '01/06/2026',
    dataFim: '15/12/2026',
    local: 'Estádio da Cidadela, Luanda',
    status: 'inscrito',
    minhaPosicao: 5,
    pontos: 12,
    proximaPartida: {
      adversario: 'Petro de Luanda',
      data: '20/06/2026',
      local: 'Estádio 11 de Novembro'
    }
  },
  {
    id: '2',
    nome: 'Torneio Regional de Futebol',
    federacao: 'Federação Angolana de Futebol',
    modalidade: 'Futebol',
    categoria: 'Sênior',
    dataInicio: '10/03/2026',
    dataFim: '15/05/2026',
    local: 'Estádio do Sanatório, Luanda',
    status: 'finalizado',
    minhaPosicao: 2,
    pontos: 28
  },
  {
    id: '3',
    nome: 'Super Taça de Angola',
    federacao: 'Federação Angolana de Futebol',
    modalidade: 'Futebol',
    categoria: 'Sênior',
    dataInicio: '05/02/2026',
    dataFim: '05/03/2026',
    local: 'Estádio da Cidadela, Luanda',
    status: 'classificado',
    minhaPosicao: 1,
    pontos: 18,
    proximaPartida: {
      adversario: '1º de Agosto',
      data: '05/03/2026',
      local: 'Estádio da Cidadela'
    }
  }
];

const getStatusConfig = (status: Campeonato['status']) => {
  switch (status) {
    case 'inscrito':
      return { label: 'Inscrito', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: CheckCircle };
    case 'em_andamento':
      return { label: 'Em Andamento', color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400', icon: Activity };
    case 'finalizado':
      return { label: 'Finalizado', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400', icon: CheckCircle };
    case 'classificado':
      return { label: 'Classificado', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Star };
    case 'eliminado':
      return { label: 'Eliminado', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: XCircle };
    default:
      return { label: status, color: 'bg-gray-100', icon: AlertCircle };
  }
};

const MeusCampeonatos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedTab, setSelectedTab] = useState('inscritos');

  const filteredCampeonatos = mockCampeonatos.filter(camp => {
    if (searchTerm && !camp.nome.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (statusFilter !== 'todos' && camp.status !== statusFilter) return false;
    return true;
  });

  const tabs = [
    { id: 'inscritos', label: 'Inscrições', count: mockCampeonatos.filter(c => c.status === 'inscrito').length },
    { id: 'andamento', label: 'Em Andamento', count: mockCampeonatos.filter(c => c.status === 'em_andamento').length },
    { id: 'finalizados', label: 'Finalizados', count: mockCampeonatos.filter(c => c.status === 'finalizado').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Meus Campeonatos</h1>
                <p className="text-red-100 mt-1">Acompanhe suas competições e resultados</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm">Total: {mockCampeonatos.length} competições</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar campeonato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-red-500"
              >
                <option value="todos">Todos os status</option>
                <option value="inscrito">Inscrito</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="finalizado">Finalizado</option>
                <option value="classificado">Classificado</option>
                <option value="eliminado">Eliminado</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 font-medium transition-all relative ${selectedTab === tab.id
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                {tab.count}
              </span>
              {selectedTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Campeonatos List */}
        <div className="space-y-4">
          {filteredCampeonatos.map((campeonato, index) => {
            const statusConfig = getStatusConfig(campeonato.status);
          // const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={campeonato.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <Link to={`/campeonatos/${campeonato.id}`}>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                          <Trophy className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {campeonato.nome}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {campeonato.federacao}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
                        {/* <StatusIcon className="w-4 h-4" /> */}
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{campeonato.dataInicio} - {campeonato.dataFim}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{campeonato.local}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{campeonato.modalidade} • {campeonato.categoria}</span>
                      </div>
                    </div>

                    {campeonato.status !== 'finalizado' && (
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {campeonato.minhaPosicao && (
                          <div className="flex items-center gap-2">
                            <Medal className="w-5 h-5 text-yellow-500" />
                            <div>
                              <p className="text-xs text-gray-500">Posição Atual</p>
                              <p className="font-bold text-lg">{campeonato.minhaPosicao}º lugar</p>
                            </div>
                          </div>
                        )}
                        {campeonato.pontos && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500">Pontos</p>
                              <p className="font-bold text-lg">{campeonato.pontos}</p>
                            </div>
                          </div>
                        )}
                        {campeonato.proximaPartida && (
                          <div className="flex-1 flex items-center justify-end gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Próxima Partida</p>
                              <p className="font-medium text-sm">
                                {campeonato.proximaPartida.adversario} • {campeonato.proximaPartida.data}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {campeonato.status === 'finalizado' && campeonato.minhaPosicao && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">Classificação Final</p>
                            <p className="font-bold text-xl">
                              {campeonato.minhaPosicao === 1 ? '🏆 CAMPEÃO' : `${campeonato.minhaPosicao}º LUGAR`}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filteredCampeonatos.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum campeonato encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400">Você ainda não está inscrito em nenhum campeonato</p>
            <Link
              to="/campeonatos"
              className="inline-block mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Explorar Campeonatos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeusCampeonatos;
