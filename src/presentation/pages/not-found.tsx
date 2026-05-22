import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Home, ArrowLeft, Search, Trophy,
  Map, Users, Calendar
} from 'lucide-react';

const NotFound: React.FC = () => {
  const suggestions = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, color: 'bg-purple-500' },
    { name: 'Federações', path: '/federacoes', icon: Users, color: 'bg-blue-500' },
    { name: 'Campeonatos', path: '/campeonatos', icon: Trophy, color: 'bg-yellow-500' },
    { name: 'Eventos', path: '/eventos', icon: Calendar, color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="relative">
            <h1 className="text-9xl md:text-9xl font-bold text-white opacity-20">404</h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">Página Não Encontrada</h2>
          <p className="text-gray-400 mt-2">
            Oops! A página que você está procurando não existe ou foi movida.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por federações, clubes, atletas..."
              className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {suggestions.map((item, index) => (
            <Link
              key={item.name + index}
              to={item.path}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300"
            >
              <div className={`absolute inset-0 ${item.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
              <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color.replace('bg-', 'text-')}`} />
              <p className="text-white font-medium">{item.name}</p>
            </Link>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-xl text-white hover:bg-white/20 transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 rounded-xl text-white hover:bg-red-600 transition group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Ir para Home
          </Link>
        </motion.div>

        {/* Footer Decoration */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
            <Map className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              Sport Data Angola • Plataforma Nacional de Gestão Desportiva
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
