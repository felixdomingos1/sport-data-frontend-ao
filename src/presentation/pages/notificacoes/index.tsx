import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle, AlertCircle, Info,
  Trophy, DollarSign, Users,
  Trash2, Settings,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'sucesso' | 'aviso' | 'info' | 'erro';
  categoria: 'competicao' | 'documento' | 'pagamento' | 'sistema';
  lida: boolean;
  data: Date;
  link?: string;
  acao?: {
    label: string;
    onClick: () => void;
  };
}

const mockNotificacoes: Notificacao[] = [
  {
    id: '1',
    titulo: 'Documentos aprovados!',
    mensagem: 'Seus documentos foram validados pela Federação Angolana de Futebol.',
    tipo: 'sucesso',
    categoria: 'documento',
    lida: false,
    data: new Date(Date.now() - 2 * 60 * 60 * 1000),
    link: '/perfil'
  },
  {
    id: '2',
    titulo: 'Nova partida agendada',
    mensagem: 'Sua próxima partida será contra Petro de Luanda no dia 20/06 às 15h.',
    tipo: 'info',
    categoria: 'competicao',
    lida: false,
    data: new Date(Date.now() - 5 * 60 * 60 * 1000),
    link: '/meus-campeonatos',
    acao: {
      label: 'Ver detalhes',
      onClick: () => { }
    }
  },
  {
    id: '3',
    titulo: 'Pagamento confirmado',
    mensagem: 'Seu pagamento do plano semestral foi confirmado. Obrigado!',
    tipo: 'sucesso',
    categoria: 'pagamento',
    lida: true,
    data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    link: '/planos-pagamentos'
  },
  {
    id: '4',
    titulo: 'Documento rejeitado',
    mensagem: 'Seu certificado médico foi rejeitado. Motivo: Documento ilegível.',
    tipo: 'erro',
    categoria: 'documento',
    lida: false,
    data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    link: '/perfil'
  },
  {
    id: '5',
    titulo: 'Campeonato Nacional 2026',
    mensagem: 'As inscrições para o Campeonato Nacional estão abertas até 30/05.',
    tipo: 'info',
    categoria: 'competicao',
    lida: true,
    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    link: '/campeonatos'
  },
];

const getTipoConfig = (tipo: Notificacao['tipo']) => {
  switch (tipo) {
    case 'sucesso': return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200', icon: CheckCircle, iconColor: 'text-green-500' };
    case 'aviso': return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200', icon: AlertCircle, iconColor: 'text-yellow-500' };
    case 'erro': return { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200', icon: X, iconColor: 'text-red-500' };
    default: return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-500' };
  }
};

const getCategoriaIcon = (categoria: Notificacao['categoria']) => {
  switch (categoria) {
    case 'competicao': return Trophy;
    case 'documento': return Users;
    case 'pagamento': return DollarSign;
    default: return Bell;
  }
};

const Notificacoes: React.FC = () => {
  const [notificacoes, setNotificacoes] = useState(mockNotificacoes);
  const [filter, setFilter] = useState<'todas' | 'nao_lidas' | 'lidas'>('todas');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todas');

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const handleMarcarComoLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const handleMarcarTodasComoLidas = () => {
    setNotificacoes(prev =>
      prev.map(n => ({ ...n, lida: true }))
    );
  };

  const handleDeletar = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotificacoes = notificacoes.filter(n => {
    if (filter === 'nao_lidas' && n.lida) return false;
    if (filter === 'lidas' && !n.lida) return false;
    if (categoriaFilter !== 'todas' && n.categoria !== categoriaFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Notificações</h1>
                <p className="text-red-100 mt-1">Mantenha-se atualizado sobre suas atividades</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {naoLidas > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center">
                      {naoLidas}
                    </span>
                  )}
                </div>
                <span className="text-sm">{naoLidas} não lidas</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === 'todas'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('nao_lidas')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === 'nao_lidas'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
              >
                Não lidas
              </button>
              <button
                onClick={() => setFilter('lidas')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === 'lidas'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
              >
                Lidas
              </button>
            </div>

            <div className="flex gap-2">
              <select
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700"
              >
                <option value="todas">Todas categorias</option>
                <option value="competicao">Competições</option>
                <option value="documento">Documentos</option>
                <option value="pagamento">Pagamentos</option>
                <option value="sistema">Sistema</option>
              </select>

              {naoLidas > 0 && (
                <button
                  onClick={handleMarcarTodasComoLidas}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Notificações List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotificacoes.map((notificacao, index) => {
              const tipoConfig = getTipoConfig(notificacao.tipo);
              const IconComponent = tipoConfig.icon;
              const CategoriaIcon = getCategoriaIcon(notificacao.categoria);
              const timeAgo = formatDistanceToNow(notificacao.data, { addSuffix: true, locale: ptBR });

              return (
                <motion.div
                  key={notificacao.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 overflow-hidden transition-all ${notificacao.lida ? 'opacity-70' : 'hover:shadow-md'
                    }`}
                  style={{ borderLeftColor: tipoConfig.iconColor.replace('text-', '') }}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${tipoConfig.bg}`}>
                        <IconComponent className={`w-5 h-5 ${tipoConfig.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notificacao.titulo}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <CategoriaIcon className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 capitalize">{notificacao.categoria}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">{timeAgo}</span>
                            </div>
                          </div>
                          {!notificacao.lida && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          {notificacao.mensagem}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          {notificacao.acao && (
                            <button
                              onClick={notificacao.acao.onClick}
                              className="text-sm text-red-500 hover:text-red-600 font-medium"
                            >
                              {notificacao.acao.label}
                            </button>
                          )}
                          {notificacao.link && (
                            <a
                              href={notificacao.link}
                              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                              Ver detalhes →
                            </a>
                          )}
                          {!notificacao.lida && (
                            <button
                              onClick={() => handleMarcarComoLida(notificacao.id)}
                              className="text-sm text-gray-400 hover:text-gray-600"
                            >
                              Marcar como lida
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletar(notificacao.id)}
                            className="text-sm text-gray-400 hover:text-red-500 ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredNotificacoes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <Bell className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filter !== 'todas'
                  ? 'Não há notificações com este filtro'
                  : 'Você não tem notificações no momento'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Preferences Link */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <Settings className="w-4 h-4" />
            Gerenciar preferências de notificação
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notificacoes;
