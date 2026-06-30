import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { StatCardProps } from './types/dashboard.types';

interface DashboardStatsProps {
  stats: StatCardProps[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            {stat.trend !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend >= 0 ? 'text-green-600' : 'text-brand'}`}>
                {stat.trend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{Math.abs(stat.trend)}%</span>
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
