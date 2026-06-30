import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Clock,
  Trophy,
  Activity,
  Eye,
  Heart,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Team {
  id: string;
  name: string;
  flag: string;
  logo?: string;
  score: number;
}

interface Event {
  id: string;
  title: string;
  sport: string;
  location: string;
  date: string;
  participants: number;
  image: string;
  status: 'live' | 'upcoming' | 'finished' | 'halftime' | 'interval';
  homeTeam: Team;
  awayTeam: Team;
  period?: string;
  spectators?: number;
  broadcastChannel?: string;
}

const LiveEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Clássico Africano',
        sport: 'Futebol',
        location: 'Estádio 11 de Novembro, Luanda',
        date: '2026-03-15T15:00:00',
        participants: 22,
        image:
          'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop',
        status: 'live',
        homeTeam: {
          id: 'angola',
          name: 'Angola',
          flag: 'https://flagcdn.com/w320/ao.png',
          score: 2,
        },
        awayTeam: {
          id: 'nigeria',
          name: 'Nigéria',
          flag: 'https://flagcdn.com/w320/ng.png',
          score: 1,
        },
        period: "2º Tempo - 78'",
        spectators: 28500,
        broadcastChannel: 'TPA 1',
      },

      {
        id: '2',
        title: 'Dérbi Europeu',
        sport: 'Basquetebol',
        location: 'Pavilhão da Cidadela, Luanda',
        date: '2026-03-16T18:00:00',
        participants: 10,
        image:
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
        status: 'live',
        homeTeam: {
          id: 'spain',
          name: 'Espanha',
          flag: 'https://flagcdn.com/w320/es.png',
          score: 78,
        },
        awayTeam: {
          id: 'france',
          name: 'França',
          flag: 'https://flagcdn.com/w320/fr.png',
          score: 74,
        },
        period: `4º Período - 5'30"`,
        spectators: 8500,
        broadcastChannel: 'TV Zimbo',
      },

      {
        id: '3',
        title: 'Supertaça Asiática',
        sport: 'Andebol',
        location: 'Kilamba Arena, Luanda',
        date: '2026-03-17T14:00:00',
        participants: 14,
        image:
          'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop',
        status: 'halftime',
        homeTeam: {
          id: 'japan',
          name: 'Japão',
          flag: 'https://flagcdn.com/w320/jp.png',
          score: 18,
        },
        awayTeam: {
          id: 'south-korea',
          name: 'Coreia do Sul',
          flag: 'https://flagcdn.com/w320/kr.png',
          score: 15,
        },
        period: 'Intervalo',
        spectators: 3200,
      },

      {
        id: '4',
        title: 'Maratona Internacional',
        sport: 'Atletismo',
        location: 'Marginal de Luanda',
        date: '2026-03-20T06:00:00',
        participants: 500,
        image:
          'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop',
        status: 'upcoming',
        homeTeam: {
          id: 'kenya',
          name: 'Quénia',
          flag: 'https://flagcdn.com/w320/ke.png',
          score: 0,
        },
        awayTeam: {
          id: 'ethiopia',
          name: 'Etiópia',
          flag: 'https://flagcdn.com/w320/et.png',
          score: 0,
        },
      },

      {
        id: '5',
        title: 'Final Sul-Americana',
        sport: 'Voleibol',
        location: 'Pavilhão Multiusos, Luanda',
        date: '2026-03-22T16:00:00',
        participants: 12,
        image:
          'https://images.unsplash.com/photo-1592656094267-764a45160876?w=800&h=600&fit=crop',
        status: 'finished',
        homeTeam: {
          id: 'brazil',
          name: 'Brasil',
          flag: 'https://flagcdn.com/w320/br.png',
          score: 3,
        },
        awayTeam: {
          id: 'argentina',
          name: 'Argentina',
          flag: 'https://flagcdn.com/w320/ar.png',
          score: 1,
        },
      },

      {
        id: '6',
        title: 'Combate Internacional',
        sport: 'Jiu-Jitsu',
        location: 'Cidadela Desportiva, Luanda',
        date: '2026-03-23T10:00:00',
        participants: 45,
        image:
          'https://images.unsplash.com/photo-1599058917765-a3ed875e5c47?w=800&h=600&fit=crop',
        status: 'upcoming',
        homeTeam: {
          id: 'portugal',
          name: 'Portugal',
          flag: 'https://flagcdn.com/w320/pt.png',
          score: 0,
        },
        awayTeam: {
          id: 'usa',
          name: 'Estados Unidos',
          flag: 'https://flagcdn.com/w320/us.png',
          score: 0,
        },
      },
    ];
    setEvents(mockEvents);
  }, []);

  const displayedEvents = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  const getStatusConfig = (status: Event['status']) => {
    const configs = {
      live: {
        label: 'AO VIVO',
        className: 'bg-[#E60000] text-white',
        icon: <Activity className="w-3 h-3 animate-pulse" />,
        animated: true,
      },
      halftime: {
        label: 'INTERVALO',
        className: 'bg-yellow-600 text-white',
        icon: <Clock className="w-3 h-3" />,
        animated: false,
      },
      upcoming: {
        label: 'PRÓXIMO',
        className: 'bg-emerald-600 text-white',
        icon: <Calendar className="w-3 h-3" />,
        animated: false,
      },
      finished: {
        label: 'FINALIZADO',
        className: 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a]',
        icon: <Trophy className="w-3 h-3" />,
        animated: false,
      },
      interval: {
        label: 'INTERVALO',
        className: 'bg-yellow-600 text-white',
        icon: <Clock className="w-3 h-3" />,
        animated: false,
      },
    };
    return configs[status];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return `Hoje, ${date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
    if (days === 1) return `Amanhã, ${date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="py-20 lg:py-28 bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER COM ESTATÍSTICAS */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-[#E60000] rounded-full" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Eventos Desportivos
              </h2>
            </div>
            <p className="text-gray-500 text-base lg:text-lg">
              Acompanhe as maiores competições do país em tempo real
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f0f0f] border border-[#1a1a1a]">
              <div className="w-2 h-2 bg-[#E60000] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-300">{events.filter(e => e.status === 'live').length} AO VIVO</span>
            </div>
            {hasMore && (
              <button
                onClick={() => setVisibleCount(p => p + 3)}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#E60000] hover:bg-[#cc0000] text-white font-medium transition"
              >
                Ver mais
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* GRID DE EVENTOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayedEvents.map((event, index) => {
            const statusConfig = getStatusConfig(event.status);
            const isLive = event.status === 'live';

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#2a2a2a] transition-all duration-300">

                  {/* BACKGROUND IMAGE COM OVERLAY */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                    {/* STATUS BADGE */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${statusConfig.className}`}>
                        {statusConfig.icon}
                        <span>{statusConfig.label}</span>
                      </div>
                    </div>

                    {/* SPORT BADGE */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium">
                      {event.sport}
                    </div>

                    {/* LIVE INDICATOR ANIMADO */}
                    {isLive && (
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-brand opacity-75"></span>
                            <span className="relative h-2 w-2 rounded-full bg-brand"></span>
                          </span>
                          <span className="text-xs font-bold text-white">LIVE</span>
                        </div>
                        {event.period && (
                          <div className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-md">
                            <span className="text-xs text-white">{event.period}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* PLACAR E TIMES */}
                  <div className="p-5">
                    {/* TIMES E PLACAR */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-4">
                        {/* TIME DA CASA */}
                        <div className="flex-1 text-center">
                          <div className="relative inline-block">
                            <img
                              src={event.homeTeam.flag}
                              alt={event.homeTeam.name}
                              className="w-12 h-8 object-cover rounded shadow-md mx-auto mb-2"
                            />
                          </div>
                          <p className="font-bold text-white text-sm line-clamp-2">
                            {event.homeTeam.name}
                          </p>
                        </div>

                        {/* PLACAR CENTRAL */}
                        <div className="mx-4 px-4 py-2 rounded-xl bg-[#1a1a1a]">
                          {isLive || event.status === 'halftime' || event.status === 'finished' ? (
                            <div className="text-center">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl font-black text-white">
                                  {event.homeTeam.score}
                                </span>
                                <span className="text-xl font-bold text-gray-500">VS</span>
                                <span className="text-3xl font-black text-white">
                                  {event.awayTeam.score}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <span className="text-sm font-semibold text-gray-500">VS</span>
                            </div>
                          )}
                        </div>

                        {/* TIME FORA */}
                        <div className="flex-1 text-center">
                          <div className="relative inline-block">
                            <img
                              src={event.awayTeam.flag}
                              alt={event.awayTeam.name}
                              className="w-12 h-8 object-cover rounded shadow-md mx-auto mb-2"
                            />
                          </div>
                          <p className="font-bold text-white text-sm line-clamp-2">
                            {event.awayTeam.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DETALHES DO EVENTO */}
                    <div className="space-y-2 mb-4 pt-3 border-t border-[#1a1a1a]">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} className="shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={14} className="shrink-0" />
                        <span>{event.participants} participantes</span>
                      </div>

                      {event.spectators && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Eye size={14} className="shrink-0" />
                          <span>{event.spectators.toLocaleString()} espectadores</span>
                        </div>
                      )}

                      {event.broadcastChannel && (
                        <div className="flex items-center gap-2 text-sm text-[#E60000] font-medium">
                          <Activity size={14} className="shrink-0" />
                          <span>Transmissão: {event.broadcastChannel}</span>
                        </div>
                      )}
                    </div>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1a1a1a]">
                      <Link
                        to={`/eventos/${event.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl font-medium transition"
                      >
                        <span>Detalhes</span>
                        <ChevronRight size={16} />
                      </Link>

                      <button className="p-2 rounded-xl bg-[#1a1a1a] text-gray-500 hover:text-[#E60000] transition-colors">
                        <Heart size={18} />
                      </button>

                      <button className="p-2 rounded-xl bg-[#1a1a1a] text-gray-500 hover:text-[#E60000] transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* BORDA INDICADORA DE STATUS AO VIVO */}
                  {isLive && (
                    <div className="absolute inset-0 pointer-events-none rounded-2xl ring-2 ring-brand/50 animate-pulse" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BANNER DE DESTAQUE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden"
        >
          <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E60000]/10 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#E60000]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Próximos Eventos Importantes</h3>
                  <p className="text-gray-500 text-sm">Não perca as principais competições do calendário desportivo angolano</p>
                </div>
              </div>
              <Link
                to="/eventos"
                className="px-6 py-2.5 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl font-medium transition whitespace-nowrap"
              >
                Ver calendário completo
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveEvents;
