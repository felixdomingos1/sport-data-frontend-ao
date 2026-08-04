import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Users, ChevronRight, Calendar, Network } from 'lucide-react';
import { competicaoService } from '@/infrastructure/services/competicao.service';
import type { Campeonato } from '@/core/types/api.types';

const STATUS_MAP: Record<string, { label: string; color: string; dot: boolean }> = {
  INSCRICOES_ABERTAS: { label: 'Inscrições Abertas', color: 'bg-emerald-500', dot: false },
  EM_ANDAMENTO: { label: 'Em Andamento', color: 'bg-[#E60000]', dot: true },
  FINALIZADO: { label: 'Finalizado', color: 'bg-white/20', dot: false },
};

const MODALIDADE_META: Record<string, { label: string; emoji: string; img: string }> = {
  JIU_JITSU: { label: 'Jiu-Jitsu', emoji: '🥋', img: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=500&fit=crop' },
  KARATE: { label: 'Karaté', emoji: '🥋', img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&h=500&fit=crop' },
  JUDO: { label: 'Judo', emoji: '🥋', img: 'https://images.unsplash.com/photo-1548857562-6b4f5f9a4d2b?w=800&h=500&fit=crop' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
}

const DestaqueCampeonatos: React.FC = () => {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    competicaoService
      .getCampeonatosPublicos({ limit: 6 })
      .then((res) => setCampeonatos(res.data))
      .catch(() => setCampeonatos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || campeonatos.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-[#E60000] rounded-full" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Campeonatos de Combate
              </h2>
            </div>
            <p className="text-gray-500 text-base lg:text-lg">
              Jiu-Jitsu, Karaté e Judo — inscreva-se e acompanhe o chaveamento
            </p>
          </div>

          <Link
            to="/campeonatos"
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#E60000] hover:bg-[#cc0000] text-white font-medium transition shrink-0"
          >
            Ver todos
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campeonatos.map((campeonato, index) => {
            const statusInfo = STATUS_MAP[campeonato.status] ?? STATUS_MAP.EM_ANDAMENTO;
            const modal = MODALIDADE_META[campeonato.modalidade] ?? {
              label: campeonato.modalidade,
              emoji: '🏆',
              img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',
            };
            return (
              <motion.div
                key={campeonato.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <Link to={`/campeonatos/${campeonato.id}`} className="block">
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={modal.img}
                      alt={campeonato.nome}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 text-3xl drop-shadow">{modal.emoji}</span>
                    <span
                      className={`absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${statusInfo.color} text-white`}
                    >
                      {statusInfo.dot && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inset-0 rounded-full bg-white/70" />
                          <span className="relative rounded-full bg-white w-full h-full" />
                        </span>
                      )}
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="p-5 bg-[#0f0f0f] border border-[#1a1a1a] border-t-0 rounded-b-2xl">
                    <h3 className="text-white font-bold leading-snug line-clamp-2 mb-3 group-hover:text-[#E60000] transition-colors">
                      {campeonato.nome}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(campeonato.dataInicio)} — {formatDate(campeonato.dataFim)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {campeonato._count?.participacoes ?? 0}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[#E60000] text-xs font-semibold">
                      <Network className="w-3.5 h-3.5" />
                      Ver campeonato e inscrever-se
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DestaqueCampeonatos;
