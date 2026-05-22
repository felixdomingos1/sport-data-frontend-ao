import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Shield,
  Trophy,
} from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../infrastructure/services/auth.service';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

const steps: Step[] = [
  { id: 1, title: 'Dados Pessoais', description: 'Informações básicas', icon: User },
  { id: 2, title: 'Contato', description: 'Email e telefone', icon: Mail },
  { id: 3, title: 'Segurança', description: 'Crie sua senha', icon: Shield },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form Data
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
  });

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validações
  const validateNome = (value: string) => {
    if (!value) return 'Nome é obrigatório';
    if (value.length < 3) return 'Nome deve ter pelo menos 3 caracteres';
    return '';
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email é obrigatório';
    if (!emailRegex.test(value)) return 'Email inválido';
    return '';
  };

  const validateTelefone = (value: string) => {
    if (!value) return 'Telefone é obrigatório';
    const phoneRegex = /^\+?[0-9]{9,12}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Telefone inválido';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Senha é obrigatória';
    if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    if (!/[A-Z]/.test(value)) return 'Senha deve conter pelo menos uma letra maiúscula';
    if (!/[0-9]/.test(value)) return 'Senha deve conter pelo menos um número';
    return '';
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return 'Confirme sua senha';
    if (value !== formData.password) return 'As senhas não coincidem';
    return '';
  };

  const validateStep1 = () => {
    const nomeError = validateNome(formData.nome);
    setErrors(prev => ({ ...prev, nome: nomeError }));
    return !nomeError;
  };

  const validateStep2 = () => {
    const emailError = validateEmail(formData.email);
    const telefoneError = validateTelefone(formData.telefone);
    setErrors(prev => ({ ...prev, email: emailError, telefone: telefoneError }));
    return !emailError && !telefoneError;
  };

  const validateStep3 = () => {
    const passwordError = validatePassword(formData.password);
    const confirmError = validateConfirmPassword(formData.confirmPassword);
    setErrors(prev => ({ ...prev, password: passwordError, confirmPassword: confirmError }));
    return !passwordError && !confirmError;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();

    if (isValid && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 3 && validateStep3()) {
      setIsLoading(true);
      try {
        await authService.register({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          password: formData.password,
        });

        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl pointer-events-auto flex items-center gap-3 p-4`}>
            <div className="shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Registro realizado com sucesso!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Redirecionando para o login...
              </p>
            </div>
          </div>
        ), { duration: 3000 });

        setTimeout(() => navigate('/login'), 3000);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao registrar');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getStepStatus = (stepId: number) => {
    if (currentStep > stepId) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'pending';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-gray-900 via-red-900 to-gray-900">
      {/* Background Animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="backdrop-blur-xl rounded-3xl p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-red-600 to-yellow-500 rounded-2xl shadow-lg mb-4"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
              <p className="text-gray-300 text-sm mt-1">Registre-se no Sport Data Angola</p>
            </div>

            {/* Steps Progress */}
            <div className="mb-8">
              <div className="flex justify-between">
                {steps.map((step) => {
                  const status = getStepStatus(step.id);
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex-1 text-center">
                      <div className="relative">
                        <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${status === 'completed'
                            ? 'bg-green-500'
                            : status === 'current'
                              ? 'bg-red-500 ring-4 ring-red-500/30'
                              : 'bg-gray-600'
                          }`}>
                          {status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Icon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <p className={`text-xs mt-2 font-medium ${status === 'current'
                            ? 'text-red-400'
                            : status === 'completed'
                              ? 'text-green-400'
                              : 'text-gray-400'
                          }`}>
                          {step.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Dados Pessoais */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Nome completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          onBlur={() => handleBlur('nome')}
                          className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.nome && touched.nome
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-600 focus:ring-red-500'
                            }`}
                          placeholder="Digite seu nome completo"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.nome && touched.nome && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.nome}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Contato */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onBlur={() => handleBlur('email')}
                          className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email && touched.email
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-600 focus:ring-red-500'
                            }`}
                          placeholder="seu@email.com"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && touched.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Telefone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          onBlur={() => handleBlur('telefone')}
                          className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.telefone && touched.telefone
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-600 focus:ring-red-500'
                            }`}
                          placeholder="+244 923 456 789"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.telefone && touched.telefone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.telefone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Segurança */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          onBlur={() => handleBlur('password')}
                          className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password && touched.password
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-600 focus:ring-red-500'
                            }`}
                          placeholder="Crie uma senha forte"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.password && touched.password && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Confirmar senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          onBlur={() => handleBlur('confirmPassword')}
                          className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.confirmPassword && touched.confirmPassword
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-600 focus:ring-red-500'
                            }`}
                          placeholder="Confirme sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.confirmPassword && touched.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-1 text-sm text-red-400 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 bg-white/10 border border-gray-600 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </motion.button>
                )}

                {currentStep < 3 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        Finalizar
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {/* Link para login */}
              <p className="text-center text-gray-300 text-sm mt-6">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-red-400 hover:text-red-300 font-semibold transition inline-flex items-center gap-1 group"
                >
                  Faça login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes enter {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-enter {
          animation: enter 0.2s ease-out;
        }
        @keyframes leave {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.9); }
        }
        .animate-leave {
          animation: leave 0.2s ease-in;
        }
      `}</style>
    </div>
  );
};

export default Register;
