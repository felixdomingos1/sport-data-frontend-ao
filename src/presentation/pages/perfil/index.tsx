import React, { useState } from 'react';
import {
  Building2,
  Users,
  Trophy,
  Layers,
  CreditCard,
  Pencil,
  Upload,
  Download,
  FileText,
  Image,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const documentos = [
  {
    id: 1,
    nome: 'Foto 3x4 com fundo branco',
    subtexto: 'Imagem - 12 Jan 2026',
    status: 'APROVADO' as const,
    icon: Image,
  },
  {
    id: 2,
    nome: 'Bilhete de Identidade',
    subtexto: 'PDF / Imagem - 12 Jan 2026',
    status: 'APROVADO' as const,
    icon: FileText,
  },
  {
    id: 3,
    nome: 'Declaração do Clube',
    subtexto: 'PDF - Aguardando envio',
    status: 'PENDENTE' as const,
    icon: FileText,
  },
];

const dadosPessoais = [
  { label: 'Nome Completo', value: 'João Carlos Mateus' },
  { label: 'Data de Nascimento', value: '14 de Março de 1998' },
  { label: 'Género', value: 'Masculino' },
  { label: 'Nacionalidade', value: 'Angolana' },
  { label: 'Número de BI', value: '004823771LA041' },
  { label: 'Telefone', value: '+244 923 456 789' },
  { label: 'E-mail', value: 'joao.mateus@email.com' },
  { label: 'Província', value: 'Luanda' },
];

const perfilDetalhes = [
  { label: 'Federação', value: 'Basquetebol', icon: Building2 },
  { label: 'Clube', value: 'Petro de Luanda', icon: Users },
  { label: 'Modalidade', value: 'Basquetebol', icon: Trophy },
  { label: 'Categoria', value: 'Senior Masculino', icon: Layers },
  { label: 'Plano', value: 'Anual - até Dez 2026', icon: CreditCard },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'AT';
}

function StatusBadge({ status }: { status: 'APROVADO' | 'PENDENTE' }) {
  if (status === 'APROVADO') {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20 uppercase tracking-wide">
        Aprovado
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-[#F59E0B] border border-orange-500/20 uppercase tracking-wide">
      Pendente
    </span>
  );
}

const Perfil: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const displayName = user?.nome || 'João Mateus';
  const athleteId = 'ANG-2024-00482';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left - Profile Summary */}
      <div className="lg:col-span-1">
        <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] p-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#E60000] to-[#990000] flex items-center justify-center ring-4 ring-[#E60000]/20 mb-4">
            <span className="text-white text-3xl font-bold">{getInitials(displayName)}</span>
          </div>

          <h2 className="text-lg font-bold text-white text-center">{displayName}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{athleteId}</p>

          <span className="mt-3 text-[10px] font-bold px-3 py-1 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20 uppercase tracking-wide">
            Ativo
          </span>

          <div className="w-full mt-6 pt-6 border-t border-[#1a1a1a] space-y-4">
            {perfilDetalhes.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm text-white mt-0.5">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right - Personal Data + Documents */}
      <div className="lg:col-span-2 space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
            <h3 className="text-base font-semibold text-white">Dados Pessoais</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 border border-[#E60000] text-[#E60000] rounded-xl text-sm font-medium hover:bg-[#E60000]/10 transition"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dadosPessoais.map((field) => (
              <div key={field.label}>
                <label className="block text-[11px] text-gray-500 uppercase tracking-wide mb-1.5">
                  {field.label}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={
                      field.label === 'E-mail'
                        ? user?.email || field.value
                        : field.label === 'Telefone'
                          ? user?.telefone || field.value
                          : field.label === 'Nome Completo'
                            ? user?.nome || field.value
                            : field.value
                    }
                    className="w-full px-3 py-2.5 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white focus:outline-none focus:border-[#E60000]/50 transition"
                  />
                ) : (
                  <div className="px-3 py-2.5 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white">
                    {field.label === 'E-mail'
                      ? user?.email || field.value
                      : field.label === 'Telefone'
                        ? user?.telefone || field.value
                        : field.label === 'Nome Completo'
                          ? user?.nome || field.value
                          : field.value}
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition"
              >
                Guardar alterações
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-[#3a3a3a] text-gray-400 hover:text-white text-sm font-medium rounded-xl transition"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Documentos */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
            <h3 className="text-base font-semibold text-white">Documentos</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl text-sm font-medium transition">
              <Upload className="w-4 h-4" />
              Enviar Documento
            </button>
          </div>

          <div className="divide-y divide-[#1a1a1a]">
            {documentos.map((doc) => {
              const Icon = doc.icon;
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[#141414] transition"
                >
                  <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{doc.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.subtexto}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={doc.status} />
                    {doc.status === 'APROVADO' ? (
                      <button
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition"
                        title="Descarregar"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="px-4 py-1.5 border border-[#E60000] text-[#E60000] rounded-xl text-xs font-medium hover:bg-[#E60000]/10 transition">
                        Enviar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
