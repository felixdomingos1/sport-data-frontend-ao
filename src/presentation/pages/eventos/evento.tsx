import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';

interface Event {
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

const SPORTS = [
  {
    name: 'Futebol', category: 'football', icon: '⚽', images: [
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=1300&fit=crop',
      'https://images.unsplash.com/photo-1459865264687-287d453a4c7e?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=1100&fit=crop',
    ]
  },
  {
    name: 'Basquetebol', category: 'basketball', icon: '🏀', images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=900&fit=crop',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&h=1100&fit=crop',
    ]
  },
  {
    name: 'Jiu-Jitsu', category: 'martial-arts', icon: '🥋', images: [
      'https://images.unsplash.com/photo-1599058917765-a3ed875e5c47?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&h=1300&fit=crop',
    ]
  },
  {
    name: 'Atletismo', category: 'athletics', icon: '🏃', images: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&h=900&fit=crop',
    ]
  },
  {
    name: 'Ginástica', category: 'gymnastics', icon: '🤸', images: [
      'https://images.unsplash.com/photo-1530821875964-909c3b6f1e8e?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1518611012118-696072a03feb?w=800&h=1300&fit=crop',
    ]
  },
  {
    name: 'Voleibol', category: 'volleyball', icon: '🏐', images: [
      'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=900&fit=crop',
    ]
  },
  {
    name: 'Natação', category: 'swimming', icon: '🏊', images: [
      'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=800&h=1300&fit=crop',
    ]
  },
  {
    name: 'Boxe', category: 'boxing', icon: '🥊', images: [
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=1100&fit=crop',
      'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&h=1200&fit=crop',
    ]
  },
  {
    name: 'Ténis', category: 'tennis', icon: '🎾', images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=900&fit=crop',
    ]
  },
  {
    name: 'Ciclismo', category: 'cycling', icon: '🚴', images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=1000&fit=crop',
    ]
  },
];

const LOCATIONS = [
  'Luanda', 'Benguela', 'Huíla',
  'Estádio 11 de Novembro', 'Cidadela Desportiva', 'Kilamba Arena',
  'Pavilhão Multiusos', 'Marginal de Luanda'
];

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'football', name: 'Futebol' },
  { id: 'basketball', name: 'Basquete' },
  { id: 'martial-arts', name: 'Artes Marciais' },
  { id: 'athletics', name: 'Atletismo' },
  { id: 'gymnastics', name: 'Ginástica' },
  { id: 'volleyball', name: 'Voleibol' },
  { id: 'swimming', name: 'Natação' },
  { id: 'boxing', name: 'Boxe' },
  { id: 'tennis', name: 'Ténis' },
  { id: 'cycling', name: 'Ciclismo' },
];

function generateEvents(): Event[] {
  const list: Event[] = [];
  SPORTS.forEach((sport, si) => {
    sport.images.forEach((image, ii) => {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 60));
      const roll = Math.random();
      list.push({
        id: `${si}-${ii}`,
        title: `Campeonato de ${sport.name}`,
        sport: sport.name,
        location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
        date: date.toISOString(),
        participants: Math.floor(Math.random() * 500) + 50,
        image,
        status: roll > 0.75 ? 'live' : roll > 0.45 ? 'upcoming' : 'finished',
        category: sport.category,
      });
    });
  });
  return list;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Status Badge ────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: Event['status'] }> = ({ status }) => {
  if (status === 'live') return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-red-600 text-white">
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
    <span className="inline-flex text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/20 text-white/70">
      Finalizado
    </span>
  );
};

// ─── Event Card ───────────────────────────────────────────────────────────────
const EventCard: React.FC<{ event: Event; index: number }> = ({ event, index }) => {
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
        {/* Photo */}
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-auto object-cover transition-transform duration-700 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          loading="lazy"
        />

        {/* Always-on vignette at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Top row */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
            {event.sport}
          </span>
          <StatusBadge status={event.status} />
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2">
            {event.title}
          </h3>

          {/* Meta - revealed on hover */}
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

          {/* Compact meta when not hovered */}
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="break-inside-avoid mb-5">
    <div className="rounded-xl bg-white/5 animate-pulse" style={{ height: Math.floor(Math.random() * 180) + 260 }} />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Eventos: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setEvents(generateEvents());
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = selectedCategory === 'all'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const liveCount = filtered.filter(e => e.status === 'live').length;
  const upcomingCount = filtered.filter(e => e.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative h-[480px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=600&fit=crop"
          alt="Hero atletas"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/30" />

        {/* Accent line */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-red-500 rounded-full" />

        <div className="relative h-full flex flex-col justify-center pl-14 pr-8 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase mb-3"
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
            className="text-white/60 text-base max-w-sm leading-relaxed"
          >
            Descubra e acompanhe as maiores competições desportivas de Angola.
          </motion.p>

          {/* Live indicator */}
          {!loading && liveCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-red-500/60" />
                <span className="relative rounded-full bg-red-500 w-full h-full" />
              </span>
              <span className="text-red-400 text-sm font-semibold">
                {liveCount} evento{liveCount > 1 ? 's' : ''} ao vivo agora
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <div className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-10 overflow-x-auto scrollbar-none">
          {[
            { label: 'Eventos', value: filtered.length },
            { label: 'Ao Vivo', value: liveCount, accent: true },
            { label: 'Próximos', value: upcomingCount },
            { label: 'Modalidades', value: '12+' },
            { label: 'Atletas', value: '1.000+' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-3 shrink-0">
              <span className={`text-2xl font-black tabular-nums ${stat.accent ? 'text-red-500' : 'text-white'}`}>
                {stat.value}
              </span>
              <span className="text-white/40 text-xs uppercase tracking-widest">{stat.label}</span>
              <span className="w-px h-5 bg-white/10 last:hidden" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Category Filter ───────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/5">
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
                    : 'text-white/50 hover:text-white/80 hover:bg-white/8 border border-white/10'
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Masonry Grid ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <SportLoadingScreen message="A carregar eventos..." fullscreen={false} size="md" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">
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
      </div>

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <div className="border-t border-white/5 mt-4">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">Quer registar o seu evento?</p>
            <p className="text-white/40 text-xs mt-0.5">Publique competições e alcance atletas em todo o país.</p>
          </div>
          <Link to="/registar-evento">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all duration-150 text-white text-sm font-bold tracking-wide">
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
