import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Trophy, ChevronRight } from 'lucide-react';

interface QuickActionsProps {
  federacoes: Array<{ id: string; nome: string; slug: string }>;
  clubes: Array<{ id: string; nome: string; cidade: string }>;
}

const QuickActions: React.FC<QuickActionsProps> = ({ federacoes, clubes }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:col-span-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Federations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Federações</h3>
            </div>
            <Link to="/federacoes" className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {federacoes.slice(0, 3).map((fed) => (
              <Link
                key={fed.id}
                to={`/federacoes/${fed.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
              >
                <div className="w-10 h-10 bg-linear-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{fed.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{fed.slug.toUpperCase()}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Clubs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Clubes</h3>
            </div>
            <Link to="/clubes" className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1">
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {clubes.slice(0, 3).map((clube) => (
              <Link
                key={clube.id}
                to={`/clubes/${clube.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
              >
                <div className="w-10 h-10 bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{clube.nome}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{clube.cidade || 'Localização não definida'}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;
