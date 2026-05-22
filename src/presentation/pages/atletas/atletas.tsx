import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAtletaStore } from '../../../store/atleta.store';
import { useClubeStore } from '../../../store/clube.store';
import { useFederacaoStore } from '../../../store/federacao.store';
import { usePlanoStore } from '../../../store/plano.store';

const Atletas: React.FC = () => {
  const { atletas, fetchAll, create, isLoading } = useAtletaStore();
  const { clubes, fetchAll: fetchClubes } = useClubeStore();
  const { federacoes, fetchAll: fetchFederacoes } = useFederacaoStore();
  const { planos, fetchAll: fetchPlanos } = usePlanoStore();
  const [showModal, setShowModal] = useState(false);
  const [showInscricaoModal, setShowInscricaoModal] = useState(false);
  const [selectedAtletaId, setSelectedAtletaId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    usuarioId: '',
    nomeCompleto: '',
    bi: '',
    passaporte: '',
    dataNascimento: '',
    genero: 'M' as 'M' | 'F',
    nacionalidade: 'Angola',
  });
  const [inscricaoData, setInscricaoData] = useState({
    federacaoId: '',
    clubeId: '',
    planoId: '',
  });

  useEffect(() => {
    fetchAll();
    fetchClubes(1, 100);
    fetchFederacoes(1, 100);
    fetchPlanos(1, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create(formData);
      toast.success('Atleta criado com sucesso!');
      setShowModal(false);
      setFormData({
        usuarioId: '',
        nomeCompleto: '',
        bi: '',
        passaporte: '',
        dataNascimento: '',
        genero: 'M',
        nacionalidade: 'Angola',
      });
    } catch (error) {
      console.log(error);
      toast.error('Erro ao criar atleta');
    }
  };

  const handleInscricao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAtletaId) return;
    try {
      const { createInscricao } = useAtletaStore.getState();
      await createInscricao({
        atletaId: selectedAtletaId,
        ...inscricaoData,
      });
      toast.success('Inscrição realizada com sucesso!');
      setShowInscricaoModal(false);
      setSelectedAtletaId(null);
      setInscricaoData({
        federacaoId: '',
        clubeId: '',
        planoId: '',
      });
    } catch (error) {
      console.log(error);
      toast.error('Erro ao realizar inscrição');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Atletas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Novo Atleta
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gênero
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nacionalidade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {atletas.map((atleta) => (
                <tr key={atleta.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {atleta.nomeCompleto}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{atleta.bi}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(atleta.dataNascimento).toLocaleDateString('pt-PT')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {atleta.genero === 'M' ? 'Masculino' : 'Feminino'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{atleta.nacionalidade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedAtletaId(atleta.id);
                        setShowInscricaoModal(true);
                      }}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Inscrever
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Criar Atleta */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Novo Atleta</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">BI</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.bi}
                    onChange={(e) => setFormData({ ...formData, bi: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Passaporte</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.passaporte}
                    onChange={(e) => setFormData({ ...formData, passaporte: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data Nascimento</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gênero</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: e.target.value as 'M' | 'F' })}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nacionalidade</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.nacionalidade}
                    onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Inscrição */}
      {showInscricaoModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Inscrever Atleta</h3>
              <button
                onClick={() => {
                  setShowInscricaoModal(false);
                  setSelectedAtletaId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleInscricao}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Federação</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={inscricaoData.federacaoId}
                    onChange={(e) => setInscricaoData({ ...inscricaoData, federacaoId: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    {federacoes.map((fed) => (
                      <option key={fed.id} value={fed.id}>
                        {fed.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Clube</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={inscricaoData.clubeId}
                    onChange={(e) => setInscricaoData({ ...inscricaoData, clubeId: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    {clubes.map((clube) => (
                      <option key={clube.id} value={clube.id}>
                        {clube.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plano</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={inscricaoData.planoId}
                    onChange={(e) => setInscricaoData({ ...inscricaoData, planoId: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    {planos.map((plano) => (
                      <option key={plano.id} value={plano.id}>
                        {plano.nome} - {plano.preco} {plano.moeda}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Inscrever
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Atletas;
