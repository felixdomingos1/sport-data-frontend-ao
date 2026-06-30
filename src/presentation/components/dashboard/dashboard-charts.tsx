import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { ChartData } from './types/dashboard.types';

interface DashboardChartsProps {
  growthData: ChartData[];
  modalidadesData: { name: string; value: number; color: string }[];
  crescimentoTotal: number;
  metaAnual: number;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  growthData,
  modalidadesData,
  crescimentoTotal,
  metaAnual,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('mensal');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Growth Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crescimento de Atletas</h3>
            <p className="text-sm text-gray-500">Comparação mensal de novos atletas</p>
          </div>
          <div className="flex gap-2">
            {['mensal', 'trimestral', 'anual'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${selectedPeriod === period
                    ? 'bg-brand text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="colorAtletas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="mes" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Area
              type="monotone"
              dataKey="atletas"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAtletas)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Crescimento total</p>
              <p className="text-2xl font-bold text-green-600">+{crescimentoTotal}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Meta anual</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metaAnual.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modalidades Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Distribuição por Modalidade</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={modalidadesData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {modalidadesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {modalidadesData.map((modalidade) => (
            <div key={modalidade.name} className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: modalidade.color }} />
              <span className="text-sm text-gray-600 dark:text-gray-300">{modalidade.name}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{modalidade.value}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
