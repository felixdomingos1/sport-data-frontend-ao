import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, Shield, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../../infrastructure/services/auth.service';
import { SEO } from '../../components/seo/seo';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!token) {
      setError('Token de recuperação inválido.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword({ token, password: newPassword });
      setIsSuccess(true);
      toast.success('Senha redefinida com sucesso!');
    } catch (err: unknown) {
      let message = 'Ocorreu um erro inesperado. Tenta novamente.';

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; error?: { message?: string } } } };
        const data = axiosError.response?.data;
        message = data?.error?.message ?? data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-[#0f0f0f]">
        <SEO title="Senha Redefinida" description="A sua senha foi redefinida com sucesso." />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-6">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Senha redefinida</h2>
            <p className="text-sm text-gray-400 mb-8">
              A tua senha foi redefinida com sucesso.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl font-semibold transition"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex bg-[#0f0f0f]">
        <SEO title="Link Inválido" description="Link de recuperação inválido ou expirado." />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 mb-6">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Link inválido</h2>
            <p className="text-sm text-gray-400 mb-8">
              Este link de recuperação é inválido ou expirou.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm text-[#E60000] hover:text-[#ff3333] font-medium transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Solicitar novo link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0f0f0f]">
      <SEO title="Recuperar Senha" description="Defina a sua nova senha." />

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
              Redefinir Senha
            </h1>
            <p className="text-white/70 mt-4 text-sm xl:text-base leading-relaxed max-w-md">
              Escolhe uma nova senha para a tua conta.
            </p>
          </div>
          <div />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">SPORT DATA</p>
              <p className="text-[11px] text-gray-500 tracking-widest">ANGOLA</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Recuperar senha</h2>
            <p className="text-sm text-gray-500 mt-1">
              Define a tua nova senha.
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Nova senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar nova senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition"
                  placeholder="••••••••"
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
                  A redefinir...
                </span>
              ) : (
                'Redefinir senha'
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

export default ResetPassword;
