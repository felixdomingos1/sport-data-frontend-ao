import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Clock, Tag, Building2 } from 'lucide-react';
import { eventoService } from '../../../infrastructure/services/evento.service';
import type { Evento } from '../../../core/types/api.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';

const STATUS_MAP: Record<string, { label: string; color: string; dot: boolean }> = {
  PUBLICADO: { label: 'Próximo', color: 'bg-emerald-500', dot: false },
  EM_ANDAMENTO: { label: 'Ao Vivo', color: 'bg-brand', dot: true },
  FINALIZADO: { label: 'Finalizado', color: 'bg-white/20', dot: false },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-500', dot: false },
  RASCUNHO: { label: 'Rascunho', color: 'bg-white/10', dot: false },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const EventoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    eventoService
      .getById(id)
      .then(setEvento)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <SportLoadingScreen message="A carregar evento..." fullscreen={false} size="md" />
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🏟</p>
          <p className="text-lg font-medium">Evento não encontrado</p>
          <Link to="/eventos" className="inline-flex items-center gap-2 text-brand text-sm font-bold mt-4 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos eventos
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = STATUS_MAP[evento.status] ?? STATUS_MAP.PUBLICADO;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO
        title={evento.titulo}
        description={evento.descricao ?? `Evento desportivo: ${evento.titulo}`}
        canonical={`/eventos/${evento.id}`}
        image={evento.imagemUrl}
      />

      <div className="relative h-[400px] md:h-[480px] overflow-hidden">
        <img
          src={evento.imagemUrl || evento.bannerUrl || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop'}
          alt={evento.titulo}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-24 bg-brand rounded-full" />

        <div className="relative h-full flex flex-col justify-end pl-14 pr-8 pb-10 max-w-4xl">
          <Link to="/eventos" className="inline-flex items-center gap-2 text-gray-600 dark:text-white/60 text-xs font-bold tracking-wide mb-4 hover:text-gray-900 dark:hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar aos eventos
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
                <Tag className="w-3 h-3" />
                {evento.tipo}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${statusInfo.color} text-white`}>
                {statusInfo.dot && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inset-0 rounded-full bg-white/70" />
                    <span className="relative rounded-full bg-white w-full h-full" />
                  </span>
                )}
                {statusInfo.label}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-3">
              {evento.titulo}
            </h1>

            {evento.modalidade && (
              <p className="text-gray-500 dark:text-white/50 text-sm font-semibold tracking-wide">{evento.modalidade}</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-4">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Início</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(evento.dataInicio)}</p>
            </div>
          </div>

          {evento.dataFim && (
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-500 dark:text-white/60" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Fim</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(evento.dataFim)}</p>
              </div>
            </div>
          )}

          {evento.local && (
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-500 dark:text-white/60" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest">Local</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{evento.local}</p>
              </div>
            </div>
          )}
        </motion.div>

        {evento.descricao && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-3">Sobre o Evento</h2>
            <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed whitespace-pre-line">{evento.descricao}</p>
          </motion.div>
        )}

        {evento.endereco && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-3">Endereço</h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 text-sm">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{evento.endereco}</span>
            </div>
          </motion.div>
        )}

        {(evento.federacao || evento.academia || evento.associacao) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-5"
          >
            <h2 className="text-sm font-bold text-gray-500 dark:text-white/40 uppercase tracking-widest mb-3">Organização</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-500 dark:text-white/60" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {evento.federacao?.nome ?? evento.academia?.nome ?? "Entidade Desportiva"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventoDetalhe;
