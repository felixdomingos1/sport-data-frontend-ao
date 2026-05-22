import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
   Mail, Phone, MapPin, Calendar, Award,
  Trophy, Users, Edit2, Save, X, Camera,
  CheckCircle, Clock, AlertCircle, FileText,
  Upload, Eye, Download,
  Activity
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Link } from 'react-router-dom';

const Perfil: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    dataNascimento: '1995-03-15',
    genero: 'M',
    nacionalidade: 'Angola',
    cidade: 'Luanda',
    bairro: 'Ingombota'
  });

  const documentos = [
    { nome: 'BI / Documento Identidade', status: 'aprovado', data: '15/03/2026', arquivo: 'bi_joao_silva.pdf' },
    { nome: 'Foto 3x4', status: 'aprovado', data: '15/03/2026', arquivo: 'foto_joao.jpg' },
    { nome: 'Certificado Médico', status: 'pendente', data: null, arquivo: null },
    { nome: 'Seguro Desportivo', status: 'rejeitado', data: '10/03/2026', motivo: 'Documento ilegível', arquivo: 'seguro.pdf' },
  ];

  const estatisticas = {
    totalCompeticoes: 17,
    vitorias: 12,
    derrotas: 3,
    empates: 2,
    titulos: 3,
    gols: 28,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pendente': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'rejeitado': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="w-4 h-4" />;
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'rejeitado': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-linear-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Meu Perfil</h1>
                <p className="text-red-100 mt-1">Gerencie suas informações pessoais e documentos</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                <span>{isEditing ? 'Cancelar' : 'Editar Perfil'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              {/* Profile Photo */}
              <div className="relative h-32 bg-linear-to-r from-red-500 to-red-600">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      <span className="text-3xl font-bold text-gray-600 dark:text-gray-300">
                        {user?.nome?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-6 px-6 text-center">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      placeholder="Nome completo"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      placeholder="Telefone"
                    />
                    <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.nome}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Atleta • ID: ATL-001</p>
                    <div className="mt-4 flex justify-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">17</p>
                        <p className="text-xs text-gray-500">Competições</p>
                      </div>
                      <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">12</p>
                        <p className="text-xs text-gray-500">Vitórias</p>
                      </div>
                      <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">3</p>
                        <p className="text-xs text-gray-500">Títulos</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 p-6 space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{user?.telefone || '+244 900 000 000'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">15 de Março de 1995 (30 anos)</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Luanda, Angola</span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Ranking Atual</h3>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">#42</p>
                    <p className="text-xs text-gray-500">Nacional - Futebol</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">+5 posições</p>
                    <p className="text-xs text-gray-500">Último mês</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documents and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estatísticas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Estatísticas de Carreira</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{estatisticas.titulos}</p>
                  <p className="text-xs text-gray-500">Títulos</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{estatisticas.totalCompeticoes}</p>
                  <p className="text-xs text-gray-500">Competições</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Award className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold text-green-600">{estatisticas.vitorias}</p>
                  <p className="text-xs text-gray-500">Vitórias</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{estatisticas.gols}</p>
                  <p className="text-xs text-gray-500">Gols Marcados</p>
                </div>
              </div>
            </motion.div>

            {/* Documentos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Documentos</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm hover:bg-red-100 transition">
                  <Upload className="w-4 h-4" />
                  Novo Documento
                </button>
              </div>
              <div className="space-y-3">
                {documentos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{doc.nome}</p>
                        <p className="text-xs text-gray-500">{doc.data ? `Enviado em ${doc.data}` : 'Não enviado'}</p>
                        {doc.motivo && <p className="text-xs text-red-500 mt-1">{doc.motivo}</p>}
                      </div>
                    </div>
                    {doc.arquivo && (
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Últimas Competições */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Últimas Competições</h3>
                <Link to="/historico" className="text-sm text-red-500 hover:text-red-600">Ver histórico completo →</Link>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Campeonato Nacional 2025</p>
                      <p className="text-xs text-gray-500">Junho - Dezembro 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">5º lugar</p>
                      <p className="text-xs text-gray-500">12 pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
