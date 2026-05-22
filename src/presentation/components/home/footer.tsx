import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-r from-red-600 to-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SDA</span>
              </div>
              <span className="text-xl font-bold">Sport Data Angola</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              A plataforma completa do esporte angolano, conectando federações, clubes, atletas e fãs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-red-500 transition">Início</Link></li>
              <li><Link to="/competicoes" className="text-gray-400 hover:text-red-500 transition">Competições</Link></li>
              <li><Link to="/rankings" className="text-gray-400 hover:text-red-500 transition">Rankings</Link></li>
              <li><Link to="/eventos" className="text-gray-400 hover:text-red-500 transition">Eventos</Link></li>
              <li><Link to="/ao-vivo" className="text-gray-400 hover:text-red-500 transition">Ao Vivo</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="text-gray-400 hover:text-red-500 transition">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-gray-400 hover:text-red-500 transition">Contato</Link></li>
              <li><Link to="/termos" className="text-gray-400 hover:text-red-500 transition">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="text-gray-400 hover:text-red-500 transition">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                <span className="text-gray-400 text-sm">Luanda, Angola</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-500" />
                <span className="text-gray-400 text-sm">contato@sportdata.ao</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-500" />
                <span className="text-gray-400 text-sm">+244 222 123 456</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Sport Data Angola. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
