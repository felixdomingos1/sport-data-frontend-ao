import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Users, Calendar, Star } from 'lucide-react';
import { useFederacaoStore } from '@store/federacao.store';
import SportLoadingScreen from '../ui/sport-loading-screen';


const ModalitiesSection: React.FC = () => {
  const { federacoes, fetchAll, isLoading } = useFederacaoStore();
  const [sportImages, setSportImages] = useState<Record<string, string>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const getSportImage = (nomeFederacao: string): string => {
    const nome = nomeFederacao.toLowerCase();

    const imageMap: Record<string, string> = {
      'futebol': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop',
      'basquetebol': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
      'andebol': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop',
      'voleibol': 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=600&h=400&fit=crop',
      'tenis': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop',
      'jiu jitsu': 'https://images.unsplash.com/photo-1599058917765-a3ed875e5c47?w=600&h=400&fit=crop',
      'boxe': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop',
      'natacao': 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=600&h=400&fit=crop',
      'atletismo': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop',
      'ginastica': 'https://images.unsplash.com/photo-1530821875964-909c3b6f1e8e?w=600&h=400&fit=crop',
      'karate': 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=600&h=400&fit=crop',
      'judô': 'https://images.unsplash.com/photo-1555597492-1dfb5fdf37f0?w=600&h=400&fit=crop',
      'taekwondo': 'https://images.unsplash.com/photo-1555597492-1dfb5fdf37f0?w=600&h=400&fit=crop',
      'ciclismo': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop',
      'xadrez': 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&h=400&fit=crop',
      'default': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
    };

    for (const [key, value] of Object.entries(imageMap)) {
      if (nome.includes(key)) {
        return value;
      }
    }
    return imageMap.default;
  };

  useEffect(() => {
    fetchAll(1, 12);
  }, [fetchAll]);

  // Pré-carregar imagens
  useEffect(() => {
    if (federacoes.length > 0) {
      federacoes.forEach((federacao) => {
        const imageUrl = getSportImage(federacao.nome);
        setImageLoading(prev => ({ ...prev, [federacao.id]: true }));

        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          setSportImages(prev => ({ ...prev, [federacao.id]: imageUrl }));
          setImageLoading(prev => ({ ...prev, [federacao.id]: false }));
        };
        img.onerror = () => {
          setSportImages(prev => ({ ...prev, [federacao.id]: imageMapDefault }));
          setImageLoading(prev => ({ ...prev, [federacao.id]: false }));
        };
      });
    }
  }, [federacoes]);

  const imageMapDefault = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop';

  const getStats = (index: number) => {
    const stats = [
      { events: 24, athletes: 450, titles: 8 },
      { events: 18, athletes: 320, titles: 12 },
      { events: 32, athletes: 580, titles: 15 },
      { events: 15, athletes: 280, titles: 6 },
      { events: 42, athletes: 720, titles: 22 },
      { events: 28, athletes: 490, titles: 10 },
      { events: 20, athletes: 360, titles: 7 },
      { events: 35, athletes: 610, titles: 18 },
    ];
    return stats[index % stats.length];
  };

  const federacoesList = Array.isArray(federacoes) ? federacoes : [];
  const displayFederacoes = federacoesList.slice(0, 8);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <SportLoadingScreen message="A carregar modalidades..." fullscreen={false} size="md" />
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-28 bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E60000]/10 border border-[#E60000]/20 text-[#E60000] text-sm font-semibold mb-4">
            <Trophy className="w-4 h-4" />
            <span>Federações Oficiais</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Modalidades Esportivas
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg">
            Conheça as federações que movimentam o esporte angolano
          </p>
        </motion.div>

        {displayFederacoes.length === 0 ? (
          <div className="text-center py-20 bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a1a1a] mb-4">
              <Trophy className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-500 text-lg">
              Nenhuma federação encontrada. As federações aparecerão aqui em breve.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayFederacoes.map((federacao, index) => {
              const stats = getStats(index);
              const imageUrl = sportImages[federacao.id] || getSportImage(federacao.nome);
              const isImgLoading = imageLoading[federacao.id];

              return (
                <motion.div
                  key={federacao.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link to={`/federacoes/${federacao.id}`}>
                    <div className="relative bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#2a2a2a] transition-all duration-300">

                      {/* IMAGEM COM OVERLAY */}
                      <div className="relative h-56 overflow-hidden">
                        {isImgLoading ? (
                          <div className="w-full h-full bg-[#1a1a1a] animate-pulse flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-4 border-[#2a2a2a] border-t-[#E60000] animate-spin" />
                          </div>
                        ) : (
                          <>
                            <img
                              src={imageUrl}
                              alt={federacao.nome}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                          </>
                        )}

                        {/* BADGE DE DESTAQUE */}
                        {index < 3 && (
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold shadow-lg">
                              <Star className="w-3 h-3 fill-current" />
                              <span>Destaque</span>
                            </div>
                          </div>
                        )}

                        {/* ÍCONE DO ESPORTE */}
                        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* CONTEÚDO */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                          {federacao.nome}
                        </h3>

                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                          {federacao.descricao || `Federação oficial de ${federacao.nome} em Angola`}
                        </p>

                        {/* ESTATÍSTICAS RÁPIDAS */}
                        <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-[#1a1a1a]">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[#E60000] mb-1">
                              <Calendar className="w-3 h-3" />
                            </div>
                            <p className="text-xs font-semibold text-gray-300">{stats.events}</p>
                            <p className="text-xs text-gray-500">Eventos</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                              <Users className="w-3 h-3" />
                            </div>
                            <p className="text-xs font-semibold text-gray-300">{stats.athletes}</p>
                            <p className="text-xs text-gray-500">Atletas</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                              <Trophy className="w-3 h-3" />
                            </div>
                            <p className="text-xs font-semibold text-gray-300">{stats.titles}</p>
                            <p className="text-xs text-gray-500">Títulos</p>
                          </div>
                        </div>

                        {/* BOTÃO */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                          <span className="text-sm font-medium text-gray-500">Ver federação</span>
                          <div className="w-8 h-8 rounded-full bg-[#E60000]/10 flex items-center justify-center group-hover:bg-[#E60000] transition-colors duration-300">
                            <ChevronRight className="w-4 h-4 text-[#E60000] group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Borda no hover */}
                      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-[#E60000]/30" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* BOTÃO VER MAIS */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/federacoes"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl font-bold transition"
          >
            <span>Ver todas as federações</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default ModalitiesSection;
