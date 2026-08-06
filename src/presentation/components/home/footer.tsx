import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-[#1a1a1a] text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide">SPORT DATA</p>
                <p className="text-[10px] text-gray-500 tracking-widest">ANGOLA</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              A plataforma nacional de gestão desportiva, conectando atletas, federações e
              competições em Angola.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Plataforma</h3>
            <ul className="space-y-2.5">
              <li><Link to="/federacoes" className="text-sm text-gray-600 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 transition">Federações</Link></li>
              <li><Link to="/clubes" className="text-sm text-gray-600 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 transition">Clubes</Link></li>
              <li><Link to="/atletas" className="text-sm text-gray-600 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 transition">Atletas</Link></li>
              <li><Link to="/rankings" className="text-sm text-gray-600 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 transition">Rankings</Link></li>
              <li><Link to="/eventos" className="text-sm text-gray-600 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 transition">Eventos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Conta</h3>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm text-gray-600 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 transition">Entrar</Link></li>
              <li><Link to="/register" className="text-sm text-gray-600 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 transition">Criar conta</Link></li>
              <li><Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-500 dark:hover:text-white hover:text-gray-900 transition">Painel do Atleta</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-[#E60000] shrink-0 mt-0.5" />
                Luanda, Angola
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-[#E60000] shrink-0" />
                contato@sportdata.ao
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-[#E60000] shrink-0" />
                +244 222 123 456
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-[#1a1a1a] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Sport Data Angola. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/termos" className="text-xs text-gray-500 dark:text-gray-600 hover:text-gray-800 dark:hover:text-gray-400 transition">Termos</Link>
            <Link to="/privacidade" className="text-xs text-gray-500 dark:text-gray-600 hover:text-gray-800 dark:hover:text-gray-400 transition">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
