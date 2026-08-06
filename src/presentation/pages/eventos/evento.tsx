import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventoService } from '../../../infrastructure/services/evento.service';
import type { Evento } from '../../../core/types/api.types';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import Pagination from '../../components/ui/pagination';
import { SEO } from '../../components/seo/seo';

interface EventCardData {
  id: string;
  title: string;
  sport: string;
  location: string;
  date: string;
  participants: number;
  image: string;
  status: 'upcoming' | 'live' | 'finished';
  category: string;
}

const STATUS_MAP: Record<string, 'upcoming' | 'live' | 'finished'> = {
  PUBLICADO: 'upcoming',
  EM_ANDAMENTO: 'live',
  FINALIZADO: 'finished',
};

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'CAMPEONATO', name: 'Campeonatos' },
  { id: 'TORNEIO', name: 'Torneios' },
  { id: 'EXIBICAO', name: 'Exibições' },
  { id: 'TREINO', name: 'Treinos' },
  { id: 'PALESTRA', name: 'Palestras' },
  { id: 'WORKSHOP', name: 'Workshops' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const StatusBadge: React.FC<{ status: EventCardData['status'] }> = ({ status }) => {
  if (status === 'live') return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-brand text-white">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inset-0 rounded-full bg-white/70" />
        <span className="relative rounded-full bg-white w-full h-full" />
      </span>
      Ao Vivo
    </span>
  );
  if (status === 'upcoming') return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-emerald-500 text-white">
      <Clock className="w-3 h-3" />
      Próximo
    </span>
  );
  return (
    <span className="inline-flex text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-gray-300 dark:bg-white/20 text-gray-600 dark:text-white/70">
      Finalizado
    </span>
  );
};

const EventCard: React.FC<{ event: EventCardData; index: number }> = ({ event, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="break-inside-avoid mb-5 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative rounded-xl overflow-hidden ring-1 ring-white/5 shadow-2xl">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-auto object-cover transition-transform duration-700 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
            {event.sport}
          </span>
          <StatusBadge status={event.status} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2">
            {event.title}
          </h3>
          <motion.div
            initial={false}
            animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>{event.participants} participantes</span>
              </div>
            </div>
            <Link to={`/eventos/${event.id}`}>
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-white text-gray-900 text-xs font-bold tracking-wide hover:bg-gray-100 active:scale-[0.98] transition-all duration-150">
                <span>Ver detalhes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </motion.div>
          <motion.div
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-3 text-white/60 text-[11px]"
          >
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {event.participants}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Eventos: React.FC = () => {
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const result = await eventoService.getAll({ page, limit, status: 'PUBLICADO' });
        setEvents(result.data);
        setTotalPages(result.pagination.totalPages);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [page]);

  const mapToCardData = (evento: Evento): EventCardData => ({
    id: evento.id,
    title: evento.titulo,
    sport: evento.modalidade || evento.tipo,
    location: evento.local || 'Angola',
    date: evento.dataInicio,
    participants: 0,
    image: evento.imagemUrl || evento.bannerUrl || `https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=1000&fit=crop`,
    status: STATUS_MAP[evento.status] || 'upcoming',
    category: evento.tipo,
  });

  const cardEvents = events.map(mapToCardData);

  const filtered = selectedCategory === 'all'
    ? cardEvents
    : cardEvents.filter(e => e.category === selectedCategory);

  const liveCount = filtered.filter(e => e.status === 'live').length;
  const upcomingCount = filtered.filter(e => e.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <SEO title="Eventos" description="Eventos desportivos em Angola — calendário de competições, torneios e campeonatos." canonical="/eventos" />
      <div className="relative h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop"
          alt="Hero atletas"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0A0A0B] via-transparent to-black/30" />
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-brand rounded-full" />
        <div className="relative h-full flex flex-col justify-center pl-14 pr-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-brand text-xs font-bold tracking-[0.2em] uppercase mb-3"
          >
            Angola · Eventos Desportivos
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-4"
          >
            Competições<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
              em destaque
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          className="text-gray-600 dark:text-white/60 text-base max-w-sm leading-relaxed"
          >
            Descubra e acompanhe as maiores competições desportivas de Angola.
          </motion.p>
          {!loading && liveCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/20 border border-brand/30 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-brand/60" />
                <span className="relative rounded-full bg-brand w-full h-full" />
              </span>
              <span className="text-brand-light text-sm font-semibold">
                {liveCount} evento{liveCount > 1 ? 's' : ''} ao vivo agora
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="border-y border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-10 overflow-x-auto scrollbar-none">
          {[
            { label: 'Eventos', value: events.length },
            { label: 'Ao Vivo', value: liveCount, accent: true },
            { label: 'Próximos', value: upcomingCount },
            { label: 'Categorias', value: CATEGORIES.length - 1 },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-3 shrink-0">
              <span className={`text-2xl font-black tabular-nums ${stat.accent ? 'text-brand' : 'text-gray-900 dark:text-white'}`}>
                {stat.value}
              </span>
              <span className="text-gray-500 dark:text-white/40 text-xs uppercase tracking-widest">{stat.label}</span>
              <span className="w-px h-5 bg-gray-200 dark:bg-white/10 last:hidden" />
            </div>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
        <div
          ref={pillsRef}
          className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none"
        >
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${isActive
                    ? 'bg-white text-gray-900 shadow-lg shadow-white/10'
                    : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-200 dark:hover:bg-white/8 border border-gray-200 dark:border-white/10'
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <SportLoadingScreen message="A carregar eventos..." fullscreen={false} size="md" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400 dark:text-white/30">
            <p className="text-5xl mb-4">🏟</p>
            <p className="text-lg font-medium">Nenhum evento encontrado</p>
            <p className="text-sm mt-1">Tente seleccionar outra categoria</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            <AnimatePresence>
              {filtered.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <div className="border-t border-gray-200 dark:border-white/5 mt-4">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm">Quer registar o seu evento?</p>
            <p className="text-gray-500 dark:text-white/40 text-xs mt-0.5">Publique competições e alcance atletas em todo o país.</p>
          </div>
          <Link to="/registar-evento">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand hover:bg-brand active:scale-95 transition-all duration-150 text-white text-sm font-bold tracking-wide">
              <Zap className="w-4 h-4" />
              Publicar evento
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
