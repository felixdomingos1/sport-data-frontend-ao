import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Trophy, Shield,
  Mail, Phone, Globe, ArrowRight, CheckCircle,
  Star, TrendingUp,  Zap, Building,
  FileText, Activity, ChevronRight, AlertCircle
} from 'lucide-react';
import { useFederacaoStore } from '../../../store/federacao.store';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';
import { SEO } from '../../components/seo/seo';

const FederacaoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { federacaoAtual, isLoading, error, fetchFederacaoById } = useFederacaoStore();
  const [activeTab, setActiveTab] = useState<'sobre' | 'clubes' | 'atletas' | 'campeonatos' | 'rankings'>('sobre');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (id) {
      fetchFederacaoById(id);
    }
  }, [id, fetchFederacaoById]);

  if (isLoading) {
    return <SportLoadingScreen message="A carregar federação..." />;
  }

  if (error || !federacaoAtual) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle className="w-16 h-16 text-brand mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Federação não encontrada</h2>
          <p className="text-white/60 mb-6">
            {error || 'A federação que você está procurando não existe ou foi removida.'}
          </p>
          <Link to="/federacoes" className="inline-flex items-center gap-2 px-6 py-3 bg-brand rounded-xl hover:bg-brand-hover transition">
            <ArrowRight className="w-5 h-5" />
            Ver todas federações
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Clubes', value: federacaoAtual.clubes?.length || 0, icon: Building, color: 'text-blue-500' },
    { label: 'Atletas', value: federacaoAtual.atletas?.length || 0, icon: Users, color: 'text-green-500' },
    { label: 'Campeonatos', value: federacaoAtual.campeonatos?.length || 0, icon: Trophy, color: 'text-yellow-500' },
    { label: 'Planos', value: federacaoAtual.planos?.length || 0, icon: Star, color: 'text-purple-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EM_ANDAMENTO': return 'bg-green-500';
      case 'INSCRICOES_ABERTAS': return 'bg-blue-500';
      case 'FINALIZADO': return 'bg-gray-500';
      case 'RASCUNHO': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'INSCRICOES_ABERTAS': return 'Inscrições Abertas';
      case 'FINALIZADO': return 'Finalizado';
      case 'RASCUNHO': return 'Rascunho';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <SEO title={federacaoAtual?.nome ?? 'Federação'} description={federacaoAtual?.descricao ?? 'Detalhes da federação desportiva angolana.'} canonical={`/federacoes/${id}`} />
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-black/40 z-10" />

        {/* Background Image Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand/20 to-transparent" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-center px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden shrink-0">
              {federacaoAtual.logo ? (
                <img src={federacaoAtual.logo} alt={federacaoAtual.nome} className="w-full h-full object-cover" />
              ) : (
                <Shield className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <p className="text-brand-light text-sm font-semibold tracking-wider">Federação Oficial</p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-1">{federacaoAtual.nome}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {federacaoAtual.email && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm">
                <Mail className="w-4 h-4 text-brand-light" />
                <span>{federacaoAtual.email}</span>
              </div>
            )}
            {federacaoAtual.telefone && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm">
                <Phone className="w-4 h-4 text-brand-light" />
                <span>{federacaoAtual.telefone}</span>
              </div>
            )}
            {federacaoAtual.website && (
              <a
                href={federacaoAtual.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm hover:bg-white/20 transition"
              >
                <Globe className="w-4 h-4 text-brand-light" />
                <span>Website Oficial</span>
              </a>
            )}
            {federacaoAtual.endereco && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm">
                <MapPin className="w-4 h-4 text-brand-light" />
                <span>{federacaoAtual.endereco}</span>
              </div>
            )}
          </div>

          {federacaoAtual.descricao && (
            <p className="mt-6 text-white/70 max-w-2xl leading-relaxed">
              {federacaoAtual.descricao}
            </p>
          )}
        </div>
      </div>

      {/* Stats Strip */}
      <div className="border-y border-white/5 bg-white/[0.02] sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 shrink-0">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-green-500/60" />
              <span className="relative rounded-full bg-green-500 w-full h-full" />
            </span>
            <span className="text-xs text-white/60">Ativo</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-white/10 bg-[#0A0A0B]/80 backdrop-blur-sm sticky top-[73px] z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto scrollbar-none">
            {[
              { id: 'sobre', label: 'Sobre', icon: Activity },
              { id: 'clubes', label: 'Clubes', icon: Building, count: federacaoAtual.clubes?.length },
              { id: 'atletas', label: 'Atletas', icon: Users, count: federacaoAtual.atletas?.length },
              { id: 'campeonatos', label: 'Campeonatos', icon: Trophy, count: federacaoAtual.campeonatos?.length },
              { id: 'rankings', label: 'Rankings', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-all duration-200 ${activeTab === tab.id
                    ? 'border-brand text-white'
                    : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/10 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Sobre Tab */}
          {activeTab === 'sobre' && (
            <motion.div
              key="sobre"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Descrição */}
              <div className="bg-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-light" />
                  Sobre a Federação
                </h2>
                <p className="text-white/70 leading-relaxed">
                  {federacaoAtual.descricao || 'Informações não disponíveis.'}
                </p>
              </div>

              {/* Planos Disponíveis */}
              {federacaoAtual.planos && federacaoAtual.planos.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Planos Disponíveis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {federacaoAtual.planos.map((plano) => (
                      <div key={plano.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-brand/50 transition-all">
                        <h3 className="font-bold text-lg">{plano.nome}</h3>
                        <p className="text-2xl font-bold text-brand-light mt-2">
                          {Number(plano.preco).toLocaleString()} KZ
                        </p>
                        <p className="text-sm text-white/50">
                          {plano.duracao === 'TRIMESTRAL' ? 'Trimestral' :
                            plano.duracao === 'SEMESTRAL' ? 'Semestral' :
                              plano.duracao === 'ANUAL' ? 'Anual' : 'Mensal'}
                        </p>
                        {plano.beneficios && plano.beneficios.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {plano.beneficios.slice(0, 3).map((beneficio, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-white/60">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span>{beneficio}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações de Contato */}
              <div className="bg-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-brand-light" />
                  Contactos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {federacaoAtual.email && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Mail className="w-5 h-5 text-brand-light" />
                      <div>
                        <p className="text-sm text-white/50">Email</p>
                        <p className="text-white">{federacaoAtual.email}</p>
                      </div>
                    </div>
                  )}
                  {federacaoAtual.telefone && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Phone className="w-5 h-5 text-brand-light" />
                      <div>
                        <p className="text-sm text-white/50">Telefone</p>
                        <p className="text-white">{federacaoAtual.telefone}</p>
                      </div>
                    </div>
                  )}
                  {federacaoAtual.endereco && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <MapPin className="w-5 h-5 text-brand-light" />
                      <div>
                        <p className="text-sm text-white/50">Endereço</p>
                        <p className="text-white">{federacaoAtual.endereco}</p>
                      </div>
                    </div>
                  )}
                  {federacaoAtual.website && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Globe className="w-5 h-5 text-brand-light" />
                      <div>
                        <p className="text-sm text-white/50">Website</p>
                        <a href={federacaoAtual.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-light transition">
                          {federacaoAtual.website.replace('https://', '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Clubes Tab */}
          {activeTab === 'clubes' && (
            <motion.div
              key="clubes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {federacaoAtual.clubes && federacaoAtual.clubes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {federacaoAtual.clubes.map((clube) => (
                    <Link key={clube.id} to={`/clubes/${clube.id}`}>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-brand/50 hover:bg-white/10 transition-all group">
                        <div className="flex items-start gap-3">
                          {clube.logo ? (
                            <img src={clube.logo} alt={clube.nome} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold group-hover:text-brand-light transition">{clube.nome}</h3>
                            <p className="text-sm text-white/50">{clube.cidade || 'Localização não definida'}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-brand-light transition" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Building className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">Nenhum clube registrado nesta federação</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Campeonatos Tab */}
          {activeTab === 'campeonatos' && (
            <motion.div
              key="campeonatos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Year Filter */}
              {federacaoAtual.campeonatos && federacaoAtual.campeonatos.length > 0 && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {[...new Set(federacaoAtual.campeonatos.map(c => c.temporada))].map(year => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${selectedYear === year
                          ? 'bg-brand text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                {federacaoAtual.campeonatos
                  ?.filter(c => c.temporada === selectedYear)
                  .map((camp) => (
                    <Link key={camp.id} to={`/campeonatos/${camp.id}`}>
                      <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-brand/50 hover:bg-white/10 transition-all">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`w-2 h-2 rounded-full ${getStatusColor(camp.status)}`} />
                              <span className="text-xs text-white/60">{getStatusText(camp.status)}</span>
                            </div>
                            <h3 className="text-lg font-bold">{camp.nome}</h3>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/50">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(camp.dataInicio).toLocaleDateString('pt-PT')} - {new Date(camp.dataFim).toLocaleDateString('pt-PT')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                {camp.modalidade}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {camp.tipo === 'INDIVIDUAL' ? 'Individual' : camp.tipo === 'EQUIPAS' ? 'Equipas' : 'Misto'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-brand-light group-hover:gap-2 transition-all">
                            <span className="text-sm">Ver detalhes</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              {(!federacaoAtual.campeonatos || federacaoAtual.campeonatos.filter(c => c.temporada === selectedYear).length === 0) && (
                <div className="text-center py-16">
                  <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">Nenhum campeonato encontrado para {selectedYear}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Atletas Tab */}
          {activeTab === 'atletas' && (
            <motion.div
              key="atletas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {federacaoAtual.atletas && federacaoAtual.atletas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {federacaoAtual.atletas.map((inscricao) => {
                    const atletaData = 'atleta' in inscricao ? (inscricao as Record<string, unknown>).atleta : null;
                    const atletaNome = atletaData?.nomeCompleto || 'Atleta';
                    const atletaImg = atletaData?.imagemUrl;

                    return (
                      <Link key={inscricao.id} to={`/atletas/${inscricao.atletaId}`}>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-brand/50 hover:bg-white/10 transition-all group">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-hover rounded-full flex items-center justify-center overflow-hidden shrink-0">
                              {atletaImg ? (
                                <img src={atletaImg} alt={atletaNome} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white font-bold text-lg">
                                  {atletaNome.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold group-hover:text-brand-light transition">{atletaNome}</h3>
                              <p className="text-sm text-white/50">Nº Registro: {inscricao.numeroRegistro || 'N/A'}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-brand-light transition" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">Nenhum atleta registrado nesta federação</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Rankings Tab */}
          {activeTab === 'rankings' && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">Rankings serão exibidos em breve</p>
              <Link to="/rankings" className="inline-block mt-4 text-brand-light hover:text-brand-light transition">
                Ver rankings gerais →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/5 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm">Quer fazer parte desta federação?</p>
            <p className="text-white/40 text-xs mt-0.5">Registre-se como atleta ou clube e comece a competir.</p>
          </div>
          <Link to="/register">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand hover:bg-brand active:scale-95 transition-all duration-150 text-white text-sm font-bold tracking-wide">
              <Zap className="w-4 h-4" />
              Registrar-se
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FederacaoDetalhe;
