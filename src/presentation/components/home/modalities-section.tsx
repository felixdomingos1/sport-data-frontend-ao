import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Users, Calendar, Star } from 'lucide-react';
import { useFederacaoStore } from '@store/federacao.store';


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
      <section className="py-20 bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-100">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-red-600 to-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-red-600"></div>
            </div>
            <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Carregando federações...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold mb-4">
            <Trophy className="w-4 h-4" />
            <span>Federações Oficiais</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Modalidades Esportivas
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Conheça as federações que movimentam o esporte angolano
          </p>
        </motion.div>

        {displayFederacoes.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
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
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">

                      {/* IMAGEM COM OVERLAY */}
                      <div className="relative h-56 overflow-hidden">
                        {isImgLoading ? (
                          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-4 border-gray-400 border-t-transparent animate-spin"></div>
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
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {federacao.nome}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                          {federacao.descricao || `Federação oficial de ${federacao.nome} em Angola`}
                        </p>

                        {/* ESTATÍSTICAS RÁPIDAS */}
                        <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
                              <Calendar className="w-3 h-3" />
                            </div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{stats.events}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Eventos</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                              <Users className="w-3 h-3" />
                            </div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{stats.athletes}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Atletas</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-yellow-600 dark:text-yellow-400 mb-1">
                              <Trophy className="w-3 h-3" />
                            </div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{stats.titles}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Títulos</p>
                          </div>
                        </div>

                        {/* BOTÃO */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ver federação</span>
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                            <ChevronRight className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* BORDA linearE NO HOVER */}
                      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-red-600/20 to-yellow-500/20" />
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-red-600 to-red-500 text-white rounded-2xl font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
