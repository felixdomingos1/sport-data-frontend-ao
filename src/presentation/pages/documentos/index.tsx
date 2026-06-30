import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Image,
  FileCheck,
  ChevronDown,
  LucideIcon,
} from 'lucide-react';

type StatusDocumento = 'APROVADO' | 'PENDENTE' | 'REJEITADO';
type FiltroDocumento = 'todas' | 'aprovados' | 'pendentes' | 'rejeitados' | 'obrigatorios';

interface Documento {
  id: number;
  nome: string;
  subtexto: string;
  status: StatusDocumento;
  obrigatorio: boolean;
  icon: LucideIcon;
  motivoRejeicao?: string;
}

const documentos: Documento[] = [
  {
    id: 1,
    nome: 'Foto 3x4 com fundo branco',
    subtexto: 'Imagem — Enviado em 12 Jan 2026',
    status: 'APROVADO',
    obrigatorio: true,
    icon: Image,
  },
  {
    id: 2,
    nome: 'Bilhete de Identidade',
    subtexto: 'PDF / Imagem — Enviado em 12 Jan 2026',
    status: 'APROVADO',
    obrigatorio: true,
    icon: FileText,
  },
  {
    id: 3,
    nome: 'Declaração do Clube',
    subtexto: 'PDF — Aguardando envio',
    status: 'PENDENTE',
    obrigatorio: true,
    icon: FileText,
  },
  {
    id: 4,
    nome: 'Certificado Médico Desportivo',
    subtexto: 'PDF — Enviado em 05 Jan 2026',
    status: 'REJEITADO',
    obrigatorio: true,
    icon: FileCheck,
    motivoRejeicao: 'Documento ilegível. Reenvie com melhor qualidade.',
  },
  {
    id: 5,
    nome: 'Comprovativo de Residência',
    subtexto: 'PDF — Enviado em 20 Dez 2025',
    status: 'APROVADO',
    obrigatorio: false,
    icon: FileText,
  },
];

const filtros: { id: FiltroDocumento; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'aprovados', label: 'Aprovados' },
  { id: 'pendentes', label: 'Pendentes' },
  { id: 'rejeitados', label: 'Rejeitados' },
  { id: 'obrigatorios', label: 'Obrigatórios' },
];

function StatusBadge({ status }: { status: StatusDocumento }) {
  if (status === 'APROVADO') {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-[#22C55E] border border-green-500/20 uppercase tracking-wide">
        Aprovado
      </span>
    );
  }
  if (status === 'REJEITADO') {
    return (
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-[#E60000] border border-red-500/20 uppercase tracking-wide">
        Rejeitado
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-[#F59E0B] border border-orange-500/20 uppercase tracking-wide">
      Pendente
    </span>
  );
}

const Documentos: React.FC = () => {
  const [filtro, setFiltro] = useState<FiltroDocumento>('todas');
  const [tipoUpload, setTipoUpload] = useState('');

  const total = documentos.length;
  const aprovados = documentos.filter((d) => d.status === 'APROVADO').length;
  const pendentes = documentos.filter((d) => d.status === 'PENDENTE').length;
  const obrigatorios = documentos.filter((d) => d.obrigatorio);
  const obrigatoriosAprovados = obrigatorios.filter((d) => d.status === 'APROVADO').length;
  const percentualCompleto = Math.round((obrigatoriosAprovados / obrigatorios.length) * 100);

  const documentosFiltrados = documentos.filter((doc) => {
    if (filtro === 'aprovados') return doc.status === 'APROVADO';
    if (filtro === 'pendentes') return doc.status === 'PENDENTE';
    if (filtro === 'rejeitados') return doc.status === 'REJEITADO';
    if (filtro === 'obrigatorios') return doc.obrigatorio;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Total de Documentos
            </p>
            <FileText className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">{total}</p>
          <p className="text-xs text-gray-500 mt-1">ficheiros enviados</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Aprovados
            </p>
            <CheckCircle className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">{aprovados}</p>
          <p className="text-xs text-[#22C55E] mt-1">validados pela federação</p>
        </div>

        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
              Pendentes
            </p>
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold text-white">{pendentes}</p>
          <p className="text-xs text-[#F59E0B] mt-1">aguardam envio ou análise</p>
        </div>

        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold text-white/80 tracking-wider uppercase">
              Perfil Completo
            </p>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{percentualCompleto}%</p>
          <p className="text-xs text-white/70 mt-1">
            {obrigatoriosAprovados} de {obrigatorios.length} obrigatórios
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-dashed border-[#2a2a2a] p-8 text-center hover:border-[#E60000]/40 transition">
        <div className="w-14 h-14 bg-[#E60000]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-6 h-6 text-[#E60000]" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">Enviar novo documento</h3>
        <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
          Arraste o ficheiro para aqui ou seleccione do seu dispositivo. Formatos: PDF, JPG, PNG (máx. 5 MB).
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="relative w-full sm:w-auto">
            <select
              value={tipoUpload}
              onChange={(e) => setTipoUpload(e.target.value)}
              className="appearance-none w-full sm:w-56 pl-3 pr-8 py-2.5 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white focus:outline-none focus:border-[#E60000]/50 cursor-pointer"
            >
              <option value="">Tipo de documento</option>
              <option value="foto">Foto 3x4</option>
              <option value="bi">Bilhete de Identidade</option>
              <option value="declaracao">Declaração do Clube</option>
              <option value="certificado">Certificado Médico</option>
              <option value="outro">Outro</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <button className="w-full sm:w-auto px-6 py-2.5 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition">
            Seleccionar ficheiro
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {filtros.map((item) => (
          <button
            key={item.id}
            onClick={() => setFiltro(item.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filtro === item.id
                ? 'bg-[#E60000] text-white'
                : 'bg-[#0f0f0f] text-gray-400 border border-[#1a1a1a] hover:text-white hover:border-[#2a2a2a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
          <div>
            <h3 className="text-base font-semibold text-white">Documentos do Atleta</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Federação Angolana de Basquetebol
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl text-sm font-medium transition">
            <Upload className="w-4 h-4" />
            Enviar Documento
          </button>
        </div>

        <div className="divide-y divide-[#1a1a1a]">
          {documentosFiltrados.map((doc) => {
            const Icon = doc.icon;

            return (
              <div
                key={doc.id}
                className="px-5 py-4 hover:bg-[#141414] transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-white">{doc.nome}</p>
                      {doc.obrigatorio && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E60000]/10 text-[#E60000] uppercase tracking-wide">
                          Obrigatório
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{doc.subtexto}</p>
                    {doc.motivoRejeicao && (
                      <p className="text-xs text-[#E60000] mt-1.5 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {doc.motivoRejeicao}
                      </p>
                    )}
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
                      <button className="px-4 py-1.5 border border-[#E60000] text-[#E60000] rounded-xl text-xs font-medium hover:bg-[#E60000]/10 transition whitespace-nowrap">
                        {doc.status === 'REJEITADO' ? 'Reenviar' : 'Enviar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {documentosFiltrados.length === 0 && (
          <div className="px-5 py-16 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">
              Nenhum documento encontrado para o filtro seleccionado.
            </p>
          </div>
        )}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 px-5 py-4 bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a]">
        <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Os documentos obrigatórios devem estar aprovados para participar em competições oficiais.
          O prazo para envio da Declaração do Clube é <span className="text-gray-400">15 de Julho de 2026</span>.
        </p>
      </div>
    </div>
  );
};

export default Documentos;
