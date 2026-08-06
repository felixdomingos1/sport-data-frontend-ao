import React, { useState } from 'react';
import { AlertCircle, Mail, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../../infrastructure/services/auth.service';
import { SEO } from '../../components/seo/seo';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.forgotPassword({ email: email.trim() });
      setIsSent(true);
    } catch (err: unknown) {
      let message = (err as any)?.message || 'Ocorreu um erro inesperado. Tenta novamente.';

      if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex bg-white dark:bg-[#0f0f0f]">
        <SEO title="Email Enviado" description="Instruções de recuperação de senha enviadas." />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E60000]/20 mb-6">
              <svg className="h-8 w-8 text-[#E60000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email enviado</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Se existir uma conta associada a esse email, receberás as instruções para recuperar a senha.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-[#E60000] hover:text-[#ff3333] font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0f0f0f]">
      <SEO title="Esqueci a Senha" description="Recupere o acesso à sua conta Sport Data Angola." canonical="/forgot-password" />

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#E60000]/30" />
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#E60000] rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide leading-tight">SPORT DATA</p>
              <p className="text-[11px] text-white/60 tracking-widest">ANGOLA</p>
            </div>
          </div>
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight max-w-lg">
              Recuperação de Senha
            </h1>
            <p className="text-white/70 mt-4 text-sm xl:text-base leading-relaxed max-w-md">
              Não te preocupes. Enviaremos instruções para recuperares o acesso à tua conta.
            </p>
          </div>
          <div />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 text-sm mb-6 transition">
            <ArrowLeft className="w-4 h-4" />
            Voltar para iniciar sessão
          </Link>
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">SPORT DATA</p>
              <p className="text-[11px] text-gray-500 tracking-widest">ANGOLA</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Esqueci a senha</h2>
            <p className="text-sm text-gray-500 mt-1">
              Insere o teu email para receberes instruções de recuperação.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  A enviar...
                </span>
              ) : (
                'Enviar instruções'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Lembraste da senha?{' '}
            <Link to="/login" className="text-[#E60000] hover:text-[#ff3333] font-semibold transition">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
