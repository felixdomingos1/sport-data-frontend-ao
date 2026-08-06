import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Shield,
  User,
  Users,
  Building2,
  Trophy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import { useLoadingStore } from '../../../store/loading.store';
import { SEO } from '../../components/seo/seo';

const STADIUM_BG =
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  const { login, isLoading, isAuthenticated } = useAuthStore();
  const { show: showLoading, hide: hideLoading } = useLoadingStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirect');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    useAuthStore.getState().clearSession();
  }, []);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'E-mail ou número de atleta é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const athleteIdRegex = /^[A-Z]{3}-\d{4}-\d{5}$/i;
    if (!emailRegex.test(value) && !athleteIdRegex.test(value.trim())) {
      return 'Introduza um e-mail válido ou número de atleta';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Palavra-passe é obrigatória';
    if (value.length < 6) return 'Palavra-passe deve ter pelo menos 6 caracteres';
    return '';
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  useEffect(() => {
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
  }, [email, touched.email]);

  useEffect(() => {
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  }, [password, touched.password]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    try {
      showLoading('A autenticar...');
      await login(email.trim(), password);
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email.trim());
      } else {
        localStorage.removeItem('rememberEmail');
      }
      toast.success('Login realizado com sucesso!');
      showLoading('Bem-vindo! A preparar o painel...');
      navigate(redirectTo || '/dashboard', { replace: true });
    } catch (error: unknown) {
      hideLoading();
      let message: string | undefined;

      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any)?.response?.status;
        if (status === 429) {
          message = 'Demasiadas tentativas. Aguarde alguns minutos e tente novamente.';
        } else {
          message = (error as any)?.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message || 'Erro ao fazer login');
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="min-h-screen flex">
      <SEO title="Entrar" description="Aceda à sua conta Sport Data Angola — plataforma de gestão desportiva angolana." canonical="/login" />
      {/* Left- Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STADIUM_BG})` }}
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
              Plataforma Nacional de Gestão Desportiva
            </h1>
            <p className="text-white/70 mt-4 text-sm xl:text-base leading-relaxed max-w-md">
              Gerencie atletas, federações, associações e competições num único ecossistema
              desportivo nacional.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <Users className="w-4 h-4 text-[#E60000] shrink-0" />
              <span className="text-sm">Mais de 1.000 atletas registados</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Building2 className="w-4 h-4 text-[#E60000] shrink-0" />
              <span className="text-sm">18 associações e 43 academias</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Trophy className="w-4 h-4 text-[#E60000] shrink-0" />
              <span className="text-sm">7 campeonatos activos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right- Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0f0f0f] px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 text-sm mb-6 transition">
            <ArrowLeft className="w-4 h-4" />
            Voltar para página inicial
          </Link>
          {/* Mobile logo */}
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bem-vindo de volta</h2>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Inicie sessão na sua conta Sport Data Angola
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-mail ou Nº de Atleta
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-[#1a1a1a] border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition ${
                    errors.email && touched.email ? 'border-brand' : 'border-gray-200 dark:border-[#2a2a2a]'
                  }`}
                  placeholder="joao.mateus@email.com"
                />
              </div>
              {errors.email && touched.email && (
                <p className="mt-1.5 text-sm text-brand-light flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Palavra-passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-100 dark:bg-[#1a1a1a] border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition ${
                    errors.password && touched.password ? 'border-brand' : 'border-gray-200 dark:border-[#2a2a2a]'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 dark:hover:text-gray-300 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="mt-1.5 text-sm text-brand-light flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-[#2a2a2a] bg-gray-100 dark:bg-[#1a1a1a] text-[#E60000] focus:ring-[#E60000] focus:ring-offset-0 cursor-pointer accent-[#E60000]"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition">
                  Lembrar-me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#E60000] hover:text-[#ff3333] font-medium transition"
              >
                Esqueci a senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password}
              className="w-full py-3.5 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  A entrar...
                </span>
              ) : (
                'Entrar'
              )}
            </button>

            <p className="text-center text-sm text-gray-500 pt-2">
              Não tem conta?{' '}
              <Link
                to="/register"
                className="text-[#E60000] hover:text-[#ff3333] font-semibold transition"
              >
                Registe-se aqui
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
