import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WelcomeHeaderProps {
  userName: string;
  userRole?: string;
}

export const DashboardWelcome: React.FC<WelcomeHeaderProps> = ({ userName, userRole }) => {
  const currentDate = new Date();
  const greeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Garantir que userRole seja uma string
  const displayRole = typeof userRole === 'string' ? userRole : 'ATLETA';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-linear-to-r from-brand to-brand-hover dark:from-brand-dark dark:to-brand rounded-2xl shadow-lg p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting()}, {userName}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-white/80" />
              <p className="text-white/80 text-sm">
                {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>

        {displayRole && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
            <span className="text-white/80 text-sm">Perfil:</span>
            <span className="text-white font-semibold text-sm">{displayRole}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardWelcome;
