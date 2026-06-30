import React, { useEffect, useRef, useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  FileCheck,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAtletaMeStore } from '@/store/atleta-me.store';
import SportLoadingScreen from '@/presentation/components/ui/sport-loading-screen';
import {
  formatDatePt,
  getDocumentoLabel,
  getInscricaoAtiva,
  OBRIGATORIOS,
  TIPO_DOCUMENTO_LABELS,
} from '@/presentation/utils/atleta.utils';
import type { StatusDocumento, TipoDocumento } from '@/core/types/atleta-me.types';

type FiltroDocumento = 'todas' | 'aprovados' | 'pendentes' | 'rejeitados' | 'obrigatorios';

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
      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand/10 text-[#E60000] border border-brand/20 uppercase tracking-wide">
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
  const { profile, documentos, isLoading, isSaving, fetchDocumentos, fetchMe, uploadDocumento } =
    useAtletaMeStore();
  const [filtro, setFiltro] = useState<FiltroDocumento>('todas');
  const [tipoUpload, setTipoUpload] = useState<TipoDocumento | ''>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMe();
    fetchDocumentos();
  }, [fetchMe, fetchDocumentos]);

  const inscricao = getInscricaoAtiva(profile?.inscricoes);
  const total = documentos.length;
  const aprovados = documentos.filter((d) => d.status === 'APROVADO').length;
  const pendentes = documentos.filter((d) => d.status === 'PENDENTE').length;
  const obrigatoriosEnviados = documentos.filter((d) => OBRIGATORIOS.includes(d.tipo));
  const obrigatoriosAprovados = obrigatoriosEnviados.filter((d) => d.status === 'APROVADO').length;
  const percentualCompleto = OBRIGATORIOS.length
    ? Math.round((obrigatoriosAprovados / OBRIGATORIOS.length) * 100)
    : 0;

  const documentosFiltrados = documentos.filter((doc) => {
    if (filtro === 'aprovados') return doc.status === 'APROVADO';
    if (filtro === 'pendentes') return doc.status === 'PENDENTE';
    if (filtro === 'rejeitados') return doc.status === 'REJEITADO';
    if (filtro === 'obrigatorios') return OBRIGATORIOS.includes(doc.tipo);
    return true;
  });

  const handleUpload = async (file: File) => {
    if (!tipoUpload) {
      toast.error('Seleccione o tipo de documento');
      return;
    }
    try {
      await uploadDocumento(tipoUpload, file);
      toast.success('Documento enviado com sucesso');
      setTipoUpload('');
    } catch {
      toast.error('Erro ao enviar documento. Verifique se o Cloudinary está configurado.');
    }
  };

  if (isLoading && documentos.length === 0) {
    return <SportLoadingScreen message="A carregar documentos..." fullscreen={false} size="md" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase mb-3">Total</p>
          <p className="text-3xl font-bold text-white">{total}</p>
        </div>
        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase mb-3">Aprovados</p>
          <p className="text-3xl font-bold text-white">{aprovados}</p>
        </div>
        <div className="bg-[#0f0f0f] rounded-2xl p-5 border border-[#1a1a1a]">
          <p className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase mb-3">Pendentes</p>
          <p className="text-3xl font-bold text-white">{pendentes}</p>
        </div>
        <div className="bg-[#E60000] rounded-2xl p-5 border border-[#E60000]">
          <p className="text-[10px] font-semibold text-white/80 tracking-wider uppercase mb-3">Perfil Completo</p>
          <p className="text-3xl font-bold text-white">{percentualCompleto}%</p>
        </div>
      </div>

      <div className="bg-[#0f0f0f] rounded-2xl border border-dashed border-[#2a2a2a] p-8 text-center">
        <Upload className="w-6 h-6 text-[#E60000] mx-auto mb-4" />
        <h3 className="text-base font-semibold text-white mb-1">Enviar novo documento</h3>
        <p className="text-sm text-gray-500 mb-5">PDF, JPG ou PNG (máx. 5 MB)</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="relative w-full sm:w-auto">
            <select
              value={tipoUpload}
              onChange={(e) => setTipoUpload(e.target.value as TipoDocumento | '')}
              className="appearance-none w-full sm:w-64 pl-3 pr-8 py-2.5 bg-[#080808] border border-[#1a1a1a] rounded-xl text-sm text-white focus:outline-none focus:border-[#E60000]/50"
            >
              <option value="">Tipo de documento</option>
              {(Object.keys(TIPO_DOCUMENTO_LABELS) as TipoDocumento[]).map((tipo) => (
                <option key={tipo} value={tipo}>
                  {TIPO_DOCUMENTO_LABELS[tipo]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#E60000] hover:bg-[#cc0000] text-white text-sm font-medium rounded-xl transition disabled:opacity-50"
          >
            {isSaving ? 'A enviar...' : 'Seleccionar ficheiro'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filtros.map((item) => (
          <button
            key={item.id}
            onClick={() => setFiltro(item.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filtro === item.id
                ? 'bg-[#E60000] text-white'
                : 'bg-[#0f0f0f] text-gray-400 border border-[#1a1a1a] hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-base font-semibold text-white">Documentos do Atleta</h3>
          <p className="text-xs text-gray-500 mt-0.5">{inscricao?.federacao?.nome ?? 'Federação'}</p>
        </div>

        <div className="divide-y divide-[#1a1a1a]">
          {documentosFiltrados.map((doc) => (
            <div key={doc.id} className="px-5 py-4 hover:bg-[#141414] transition">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-white">{getDocumentoLabel(doc)}</p>
                    {OBRIGATORIOS.includes(doc.tipo) && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E60000]/10 text-[#E60000] uppercase">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Enviado em {formatDatePt(doc.createdAt)}</p>
                  {doc.motivoRejeicao && (
                    <p className="text-xs text-[#E60000] mt-1.5 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {doc.motivoRejeicao}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={doc.status} />
                  {doc.url && (
                    <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {documentosFiltrados.length === 0 && (
          <p className="px-5 py-16 text-sm text-gray-500 text-center">Nenhum documento encontrado.</p>
        )}
      </div>

      <div className="flex items-start gap-3 px-5 py-4 bg-[#0f0f0f] rounded-2xl border border-[#1a1a1a]">
        <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500">
          Documentos obrigatórios aprovados são necessários para participar em competições oficiais.
        </p>
      </div>
    </div>
  );
};

export default Documentos;
