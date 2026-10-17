import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Search
} from 'lucide-react';
import { SEO } from '../../components/seo/seo';
import Pagination from '../../components/ui/pagination';
import { apiClient } from '../../../infrastructure/api/client';
import { API_ENDPOINTS } from '../../../infrastructure/api/endpoints';
import { federacaoService } from '../../../infrastructure/services/federacao.service';

interface RankingAtleta {
  id: string;
  posicao: number;
  pontos: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  partidas: number;
  modalidade: string;
  atleta?: {
    usuario?: { nome: string };
  };
  federacao?: {
    id: string;
    nome: string;
    slug: string;
  };
}

interface RankingResponse {
  ranking: RankingAtleta[];
  total: number;
  categorias?: string[];
  filters: {
    federacaoId?: string;
    modalidade?: string;
    genero?: string;
  };
}

const modalidades = ['Todas', 'Judo', 'Karaté', 'Jujitsu', 'Boxe', 'Taekwondo', 'Natação', 'Atletismo', 'Basquetebol', 'Futebol', 'Andebol', 'Voleibol'];

const generos = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
];

const Rankings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModalidade, setSelectedModalidade] = useState('Todas');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedFederacao, setSelectedFederacao] = useState('');
  const [genero, setGenero] = useState<'M' | 'F'>('M');
  const [ranking, setRanking] = useState<RankingAtleta[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [federacoes, setFederacoes] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  useEffect(() => {
    federacaoService.getAll({ limit: 100 }).then((res) => {
      setFederacoes(res.data.map((f) => ({ id: f.id, nome: f.nome })));
    }).catch(() => {});
  }, []);

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<RankingResponse>(API_ENDPOINTS.COMPETICAO.RANKING_GERAL, {
        params: {
          page,
          limit,
          genero,
          federacaoId: selectedFederacao || undefined,
          modalidade: selectedModalidade !== 'Todas' ? selectedModalidade : undefined,
          categoria: selectedCategoria || undefined,
        },
      });
      setRanking(res?.ranking ?? []);
      setTotal(res?.total ?? 0);
      setCategorias(res?.categorias ?? []);
    } catch {
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }, [selectedModalidade, selectedCategoria, selectedFederacao, genero, page]);

  useEffect(() => {
    fetchRanking();
    const interval = setInterval(fetchRanking, 5 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRanking]);

  const changeGenero = (g: 'M' | 'F') => {
    setPage(1);
    setGenero(g);
    setSelectedCategoria('');
  };

  const changeModalidade = (m: string) => {
    setPage(1);
    setSelectedModalidade(m);
    setSelectedCategoria('');
  };

  const changeFederacao = (f: string) => {
    setPage(1);
    setSelectedFederacao(f);
    setSelectedCategoria('');
  };

  const changeCategoria = (c: string) => {
    setPage(1);
    setSelectedCategoria(c);
  };

  const filtered = ranking.filter((r) => {
    const nome = r.atleta?.usuario?.nome ?? '';
    if (searchTerm && !nome.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getAtletaNome = (r: RankingAtleta) => r.atleta?.usuario?.nome ?? 'Desconhecido';
  const getFederacaoNome = (r: RankingAtleta) => r.federacao?.nome ?? '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO title="Rankings" description="Rankings nacionais do desporto angolano." canonical="/rankings" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-gradient-to-r from-brand to-red-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Rankings Nacionais</h1>
                <p className="text-white/80 mt-1">Classificação atualizada dos atletas por modalidade</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">{total} atletas</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Procurar atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand transition"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedFederacao}
              onChange={(e) => changeFederacao(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand transition"
            >
              <option value="">Todas as federações</option>
              {federacoes.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
            <select
              value={selectedModalidade}
              onChange={(e) => changeModalidade(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand transition"
            >
              {modalidades.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={selectedCategoria}
              onChange={(e) => changeCategoria(e.target.value)}
              disabled={categorias.length === 0}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand transition disabled:opacity-50"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6">
          {generos.map((g) => (
            <button
              key={g.value}
              onClick={() => changeGenero(g.value as 'M' | 'F')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition ${
                genero === g.value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nenhum atleta encontrado no ranking.</p>
              </div>
            ) : (
              <>
                {filtered.slice(0, 3).length >= 3 && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 0, 2].map((idx) => {
                      const r = filtered[idx];
                      if (!r) return null;
                      const isFirst = idx === 0;
                      return (
                        <div key={r.id} className={`rounded-xl p-4 text-center ${isFirst ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-amber-900 col-start-2' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
                          <div className={`text-2xl font-black mb-1 ${isFirst ? 'text-amber-800' : 'text-gray-400 dark:text-gray-600'}`}>
                            #{r.posicao ?? idx + 1}
                          </div>
                          <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${isFirst ? 'bg-amber-300' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <Trophy className={`w-5 h-5 ${isFirst ? 'text-amber-700' : 'text-gray-400'}`} />
                          </div>
                          <p className={`text-sm font-bold truncate ${isFirst ? 'text-amber-900' : 'text-gray-900 dark:text-white'}`}>
                            {getAtletaNome(r)}
                          </p>
                          <p className={`text-xs mt-0.5 ${isFirst ? 'text-amber-700' : 'text-gray-500'}`}>
                            {getFederacaoNome(r)}
                          </p>
                          <p className={`text-lg font-black mt-1 ${isFirst ? 'text-amber-800' : 'text-brand'}`}>
                            {r.pontos} pts
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-left">
                      <tr className="text-[10px] uppercase tracking-widest text-gray-500">
                        <th className="px-4 py-3 w-12">#</th>
                        <th className="px-4 py-3">Atleta</th>
                        <th className="px-4 py-3 hidden md:table-cell">Federação</th>
                        <th className="px-4 py-3 text-center">Pts</th>
                        <th className="px-4 py-3 text-center hidden sm:table-cell">V</th>
                        <th className="px-4 py-3 text-center hidden sm:table-cell">D</th>
                        <th className="px-4 py-3 text-center hidden sm:table-cell">J</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r, i) => (
                        <tr key={r.id} className={`border-t border-gray-100 dark:border-gray-700/50 ${i < 3 ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              i === 0 ? 'bg-amber-400 text-amber-900' :
                              i === 1 ? 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300' :
                              i === 2 ? 'bg-amber-700/20 text-amber-700' :
                              'text-gray-500'
                            }`}>
                              {r.posicao ?? i + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-gray-900 dark:text-white">{getAtletaNome(r)}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{getFederacaoNome(r)}</td>
                          <td className="px-4 py-3 text-center font-bold text-brand">{r.pontos}</td>
                          <td className="px-4 py-3 text-center text-green-600 font-medium hidden sm:table-cell">{r.vitorias}</td>
                          <td className="px-4 py-3 text-center text-red-500 font-medium hidden sm:table-cell">{r.derrotas}</td>
                          <td className="px-4 py-3 text-center text-gray-500 hidden sm:table-cell">{r.partidas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
        <Pagination page={page} totalPages={Math.ceil(total / limit)} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default Rankings;