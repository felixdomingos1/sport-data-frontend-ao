import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';

const CtaSection: React.FC = () => (
  <section className="py-20 lg:py-24 bg-[#0a0a0a] border-t border-[#1a1a1a]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-[#E60000] rounded-3xl overflow-hidden px-8 py-12 lg:px-16 lg:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E60000] to-[#990000]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Faça parte da revolução desportiva
              </h2>
              <p className="text-white/80 text-sm lg:text-base max-w-lg">
                Registe-se gratuitamente e aceda ao painel do atleta, rankings nacionais e
                competições oficiais de Angola.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#E60000] font-semibold rounded-xl hover:bg-gray-100 transition"
            >
              Criar conta
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;
