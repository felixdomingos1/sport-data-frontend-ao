import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useClubeStore } from '../../../store/clube.store';
import { useFederacaoStore } from '../../../store/federacao.store';
import SportLoadingScreen from '../../components/ui/sport-loading-screen';

const Clubes: React.FC = () => {
  const { clubes, fetchAll, create, isLoading } = useClubeStore();
  const { federacoes, fetchAll: fetchFederacoes } = useFederacaoStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    federacaoId: '',
    cidade: '',
    endereco: '',
    telefone: '',
    email: '',
    website: '',
    anoFundacao: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchAll();
    fetchFederacoes(1, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create(formData);
      toast.success('Clube criado com sucesso!');
      setShowModal(false);
      setFormData({
        nome: '',
        slug: '',
        federacaoId: '',
        cidade: '',
        endereco: '',
        telefone: '',
        email: '',
        website: '',
        anoFundacao: new Date().getFullYear(),
      });
    } catch (error) {
      console.log(error);

      toast.error('Erro ao criar clube');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clubes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Novo Clube
        </button>
      </div>

      {isLoading ? (
        <SportLoadingScreen message="A carregar clubes..." fullscreen={false} size="md" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubes.map((clube) => (
            <div key={clube.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {clube.nome}
              </h3>
              <p className="text-gray-600 mb-4">{clube.cidade}</p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <strong>Fundação:</strong> {clube.anoFundacao}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {clube.email}
                </p>
                <p className="text-gray-600">
                  <strong>Telefone:</strong> {clube.telefone}
                </p>
                {clube.website && (
                  <p className="text-gray-600">
                    <strong>Website:</strong>{' '}
                    <a href={clube.website} target="_blank" className="text-blue-500">
                      {clube.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Novo Clube</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Federação</label>
                  <select
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.federacaoId}
                    onChange={(e) => setFormData({ ...formData, federacaoId: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700">Cidade</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Endereço</label>
                  <textarea
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
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
    </div>
  );
};

export default Clubes;
