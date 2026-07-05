import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Search,
  ChevronUp, ChevronDown, Award, Star, Flame, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/seo/seo';

interface RankingItem {
  id: string;
  posicao: number;
  atleta: string;
  clube: string;
  federacao: string;
  pontos: number;
  variacao: number;
  imagem?: string;
  estatisticas: {
    vitorias: number;
    derrotas: number;
    empates: number;
    participacoes: number;
  };
}

const mockRankingGeral: RankingItem[] = [
  { id: '1', posicao: 1, atleta: 'Manuel Costa', clube: 'Petro de Luanda', federacao: 'FAF', pontos: 1250, variacao: +2, estatisticas: { vitorias: 15, derrotas: 3, empates: 2, participacoes: 20 } },
  { id: '2', posicao: 2, atleta: 'João Paulo', clube: '1º de Agosto', federacao: 'FAF', pontos: 1180, variacao: -1, estatisticas: { vitorias: 14, derrotas: 4, empates: 2, participacoes: 20 } },
  { id: '3', posicao: 3, atleta: 'Pedro Mendes', clube: 'Sagrada Esperança', federacao: 'FAF', pontos: 1120, variacao: 0, estatisticas: { vitorias: 13, derrotas: 5, empates: 2, participacoes: 20 } },
  { id: '4', posicao: 4, atleta: 'João Silva', clube: 'San Font', federacao: 'FAF', pontos: 850, variacao: +5, estatisticas: { vitorias: 10, derrotas: 7, empates: 3, participacoes: 20 } },
];

const Rankings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFederacao, setSelectedFederacao] = useState('todas');
  const [selectedModalidade, setSelectedModalidade] = useState('todos');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');

  const federacoes = ['Todas', 'FAF', 'FAB', 'FAJ'];
  const modalidades = ['Todos', 'Futebol', 'Basquete', 'Ju-Jitsu'];
  const categorias = ['Todas', 'Sênior', 'Sub-20', 'Sub-17', 'Feminino'];

  const userPosition = mockRankingGeral.find(r => r.atleta === 'João Silva');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO title="Rankings" description="Rankings nacionais do desporto angolano — classificação de atletas por federação e modalidade." canonical="/rankings" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-linear-to-r from-brand to-brand-hover rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Rankings</h1>
                <p className="text-white/80 mt-1">Classificações nacionais por modalidade</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm">Atualizado em tempo real</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar atleta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              />
            </div>
            <select
              value={selectedFederacao}
              onChange={(e) => setSelectedFederacao(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              {federacoes.map(f => <option key={f} value={f.toLowerCase()}>{f}</option>)}
            </select>
            <select
              value={selectedModalidade}
              onChange={(e) => setSelectedModalidade(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              {modalidades.map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
            </select>
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              {categorias.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>
        </motion.div>

        {/* User Position Card */}
        {userPosition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6 border border-yellow-200 dark:border-yellow-800"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sua posição</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">#{userPosition.posicao}º lugar</p>
                  <p className="text-sm text-green-600">{userPosition.variacao > 0 ? `+${userPosition.variacao}` : userPosition.variacao} posições</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500">Pontos</p>
                  <p className="text-xl font-bold">{userPosition.pontos}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Vitórias</p>
                  <p className="text-xl font-bold text-green-600">{userPosition.estatisticas.vitorias}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Participações</p>
                  <p className="text-xl font-bold">{userPosition.estatisticas.participacoes}</p>
                </div>
              </div>
              <Link
                to="/meus-rankings"
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
              >
                Ver meu histórico
              </Link>
            </div>
          </motion.div>
        )}

        {/* Ranking Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atleta</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clube</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Federação</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">V/D/E</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pontos</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Var</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockRankingGeral.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer ${item.atleta === 'João Silva' ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                      }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {item.posicao === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                        {item.posicao === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                        {item.posicao === 3 && <Medal className="w-5 h-5 text-amber-600" />}
                        <span className={`font-bold ${item.posicao <= 3 ? 'text-lg' : ''}`}>{item.posicao}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-brand to-brand-hover rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{item.atleta.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.atleta}</p>
                          <p className="text-xs text-gray-500">{item.estatisticas.participacoes} participações</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{item.clube}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                        {item.federacao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <span className="text-green-600 font-medium">{item.estatisticas.vitorias}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-brand font-medium">{item.estatisticas.derrotas}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-yellow-600 font-medium">{item.estatisticas.empates}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{item.pontos}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.variacao > 0 ? (
                        <div className="flex items-center justify-center gap-1 text-green-600">
                          <ChevronUp className="w-4 h-4" />
                          <span>+{item.variacao}</span>
                        </div>
                      ) : item.variacao < 0 ? (
                        <div className="flex items-center justify-center gap-1 text-brand">
                          <ChevronDown className="w-4 h-4" />
                          <span>{item.variacao}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Ranking Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Como funciona?</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pontuação = (vitórias × peso do evento) + bônus de performance + nível da competição
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Flame className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Eventos em Destaque</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Competições nacionais têm peso 3, regionais peso 2, locais peso 1
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Ranking por Categoria</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Rankings disponíveis por modalidade, categoria de idade e gênero
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rankings;
