import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Trophy, Activity as ActivityIcon, DollarSign } from 'lucide-react';
import { ActivityItem } from './types/dashboard.types';

interface DashboardActivitiesProps {
  activities: ActivityItem[];
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'atleta': return Users;
    case 'campeonato': return Trophy;
    case 'partida': return ActivityIcon;
    case 'pagamento': return DollarSign;
    default: return ActivityIcon;
  }
};

const getActivityColors = (status: ActivityItem['status']) => {
  switch (status) {
    case 'success': return { bg: 'bg-green-100 dark:bg-green-900/20', icon: 'text-green-600' };
    case 'info': return { bg: 'bg-blue-100 dark:bg-blue-900/20', icon: 'text-blue-600' };
    case 'warning': return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: 'text-yellow-600' };
    default: return { bg: 'bg-gray-100 dark:bg-gray-700', icon: 'text-gray-600' };
  }
};

const DashboardActivities: React.FC<DashboardActivitiesProps> = ({ activities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Atividades Recentes</h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-100 overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colors = getActivityColors(activity.status);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors.bg} shrink-0`}>
                  <Icon className={`w-4 h-4 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DashboardActivities;
