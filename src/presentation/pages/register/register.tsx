import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Image,
  Layers,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  Upload,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../infrastructure/services/auth.service';

const steps = [
  {
    id: 1,
    title: 'Dados pessoais',
    description: 'Nome, data de nascimento, contacto',
  },
  {
    id: 2,
    title: 'Credenciais de acesso',
    description: 'Email e palavra-passe',
  },
  {
    id: 3,
    title: 'Filiação',
    description: 'Federação, academia ou associação',
  },
  {
    id: 4,
    title: 'Documentos',
    description: 'Bilhete de identidade e foto',
  },
];

const inputClass = (hasError: boolean) =>
  `w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition ${
    hasError ? 'border-brand' : 'border-[#2a2a2a]'
  }`;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    genero: '',
    numeroBI: '',
    telefone: '',
    provincia: '',
    modalidade: '',
    acceptTerms: false,
    email: '',
    password: '',
    confirmPassword: '',
    federacao: '',
    clube: '',
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome completo é obrigatório';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    if (!formData.genero) newErrors.genero = 'Seleccione o género';
    if (!formData.numeroBI.trim()) newErrors.numeroBI = 'Número de BI é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.provincia) newErrors.provincia = 'Seleccione a província';
    if (!formData.modalidade) newErrors.modalidade = 'Seleccione a modalidade';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Deve aceitar os termos para continuar';
    setErrors(newErrors);
    setTouched({
      nome: true,
      dataNascimento: true,
      genero: true,
      numeroBI: true,
      telefone: true,
      provincia: true,
      modalidade: true,
      acceptTerms: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.password) newErrors.password = 'Palavra-passe é obrigatória';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo de 6 caracteres';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirme a palavra-passe';
    else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'As palavras-passe não coincidem';
    }
    setErrors(newErrors);
    setTouched({ email: true, password: true, confirmPassword: true });
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.federacao) newErrors.federacao = 'Seleccione a federação';
    if (!formData.clube) newErrors.clube = 'Seleccione o clube ou academia';
    setErrors(newErrors);
    setTouched({ federacao: true, clube: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let valid = false;
    if (currentStep === 1) valid = validateStep1();
    if (currentStep === 2) valid = validateStep2();
    if (currentStep === 3) valid = validateStep3();
    if (currentStep === 4) valid = true;
    if (valid && currentStep < 4) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      handleNext();
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone.trim(),
        password: formData.password,
      });
      toast.success('Conta criada com sucesso!');
      navigate('/login');
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const FieldError = ({ field }: { field: string }) =>
    errors[field] && touched[field] ? (
      <p className="mt-1.5 text-sm text-brand-light flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex bg-[#0f0f0f]">
      {/* Left- Stepper */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between border-r border-[#1a1a1a] p-10 xl:p-14 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 bg-[#E60000] rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">SPORT DATA</p>
              <p className="text-[11px] text-gray-500 tracking-widest">ANGOLA</p>
            </div>
          </div>

          <h1 className="text-2xl xl:text-3xl font-bold text-white mb-3">Crie a sua conta</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-10">
            Registe-se gratuitamente e aceda à plataforma nacional de gestão desportiva de Angola.
          </p>

          <div className="space-y-6">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition ${
                      isActive
                        ? 'bg-[#E60000] text-white'
                        : isCompleted
                          ? 'bg-[#E60000]/20 text-[#E60000]'
                          : 'bg-[#1a1a1a] text-gray-600 border border-[#2a2a2a]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <div className={isActive || isCompleted ? 'opacity-100' : 'opacity-40'}>
                    <p
                      className={`text-sm font-semibold ${
                        isActive ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          Já tem conta?{' '}
          <Link to="/login" className="text-[#E60000] hover:text-[#ff3333] font-semibold transition">
            Inicie sessão
          </Link>
        </p>
      </div>

      {/* Right- Form */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="flex-1 flex items-start lg:items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-2xl">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">SPORT DATA ANGOLA</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  Passo {currentStep} de {steps.length}
                </span>
                <span className="text-xs text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E60000] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">{steps[currentStep - 1].title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {currentStep === 1 && 'Preencha os seus dados para criar a conta'}
                {currentStep === 2 && 'Defina o e-mail e a palavra-passe de acesso'}
                {currentStep === 3 && 'Indique a sua filiação desportiva'}
                {currentStep === 4 && 'Envie os documentos obrigatórios'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1- Dados pessoais */}
              {currentStep === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => updateField('nome', e.target.value)}
                        onBlur={() => handleBlur('nome')}
                        className={inputClass(!!errors.nome && !!touched.nome)}
                        placeholder="João Carlos Mateus"
                      />
                    </div>
                    <FieldError field="nome" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Data de Nascimento
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="date"
                          value={formData.dataNascimento}
                          onChange={(e) => updateField('dataNascimento', e.target.value)}
                          onBlur={() => handleBlur('dataNascimento')}
                          className={inputClass(!!errors.dataNascimento && !!touched.dataNascimento)}
                        />
                      </div>
                      <FieldError field="dataNascimento" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Género</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                          value={formData.genero}
                          onChange={(e) => updateField('genero', e.target.value)}
                          onBlur={() => handleBlur('genero')}
                          className={`${inputClass(!!errors.genero && !!touched.genero)} appearance-none cursor-pointer`}
                        >
                          <option value="">Seleccionar</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                        </select>
                      </div>
                      <FieldError field="genero" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Nº de Bilhete de Identidade
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={formData.numeroBI}
                          onChange={(e) => updateField('numeroBI', e.target.value)}
                          onBlur={() => handleBlur('numeroBI')}
                          className={inputClass(!!errors.numeroBI && !!touched.numeroBI)}
                          placeholder="004823771LA041"
                        />
                      </div>
                      <FieldError field="numeroBI" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Telefone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="tel"
                          value={formData.telefone}
                          onChange={(e) => updateField('telefone', e.target.value)}
                          onBlur={() => handleBlur('telefone')}
                          className={inputClass(!!errors.telefone && !!touched.telefone)}
                          placeholder="+244 923 456 789"
                        />
                      </div>
                      <FieldError field="telefone" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Província
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                          value={formData.provincia}
                          onChange={(e) => updateField('provincia', e.target.value)}
                          onBlur={() => handleBlur('provincia')}
                          className={`${inputClass(!!errors.provincia && !!touched.provincia)} appearance-none cursor-pointer`}
                        >
                          <option value="">Seleccionar</option>
                          <option value="Luanda">Luanda</option>
                          <option value="Benguela">Benguela</option>
                          <option value="Huíla">Huíla</option>
                          <option value="Huambo">Huambo</option>
                        </select>
                      </div>
                      <FieldError field="provincia" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Modalidade Principal
                      </label>
                      <div className="relative">
                        <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                          value={formData.modalidade}
                          onChange={(e) => updateField('modalidade', e.target.value)}
                          onBlur={() => handleBlur('modalidade')}
                          className={`${inputClass(!!errors.modalidade && !!touched.modalidade)} appearance-none cursor-pointer`}
                        >
                          <option value="">Seleccionar</option>
                          <option value="Basquetebol">Basquetebol</option>
                          <option value="Futebol">Futebol</option>
                          <option value="Voleibol">Voleibol</option>
                          <option value="Atletismo">Atletismo</option>
                        </select>
                      </div>
                      <FieldError field="modalidade" />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group pt-1">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) => updateField('acceptTerms', e.target.checked)}
                      onBlur={() => handleBlur('acceptTerms')}
                      className="mt-0.5 w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a] accent-[#E60000] cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition">
                      Concordo com os{' '}
                      <span className="text-[#E60000]">Termos de Serviço</span> e a{' '}
                      <span className="text-[#E60000]">Política de Privacidade</span> da Sport Data
                      Angola.
                    </span>
                  </label>
                  <FieldError field="acceptTerms" />
                </>
              )}

              {/* Step 2- Credenciais */}
              {currentStep === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={inputClass(!!errors.email && !!touched.email)}
                        placeholder="joao.mateus@email.com"
                      />
                    </div>
                    <FieldError field="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Palavra-passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        className={`${inputClass(!!errors.password && !!touched.password)} pr-12`}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <FieldError field="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Confirmar Palavra-passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        className={`${inputClass(!!errors.confirmPassword && !!touched.confirmPassword)} pr-12`}
                        placeholder="Repita a palavra-passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <FieldError field="confirmPassword" />
                  </div>
                </>
              )}

              {/* Step 3- Filiação */}
              {currentStep === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Federação
                    </label>
                    <select
                      value={formData.federacao}
                      onChange={(e) => updateField('federacao', e.target.value)}
                      onBlur={() => handleBlur('federacao')}
                      className={`${inputClass(!!errors.federacao && !!touched.federacao)} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccionar federação</option>
                      <option value="fab">Federação Angolana de Basquetebol</option>
                      <option value="faf">Federação Angolana de Futebol</option>
                      <option value="fav">Federação Angolana de Voleibol</option>
                    </select>
                    <FieldError field="federacao" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Clube / Academia
                    </label>
                    <select
                      value={formData.clube}
                      onChange={(e) => updateField('clube', e.target.value)}
                      onBlur={() => handleBlur('clube')}
                      className={`${inputClass(!!errors.clube && !!touched.clube)} appearance-none cursor-pointer`}
                    >
                      <option value="">Seleccionar clube ou academia</option>
                      <option value="petro">Petro de Luanda</option>
                      <option value="1agosto">1º de Agosto</option>
                      <option value="interclube">Interclube</option>
                      <option value="libolo">Recreativo do Libolo</option>
                    </select>
                    <FieldError field="clube" />
                  </div>
                </>
              )}

              {/* Step 4- Documentos */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="border border-dashed border-[#2a2a2a] rounded-2xl p-6 hover:border-[#E60000]/40 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Bilhete de Identidade</p>
                        <p className="text-xs text-gray-500 mt-0.5">PDF ou imagem- máx. 5 MB</p>
                        <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-[#E60000] text-[#E60000] rounded-xl text-xs font-medium hover:bg-[#E60000]/10 transition cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          Seleccionar ficheiro
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="border border-dashed border-[#2a2a2a] rounded-2xl p-6 hover:border-[#E60000]/40 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                        <Image className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Foto 3x4 com fundo branco</p>
                        <p className="text-xs text-gray-500 mt-0.5">JPG ou PNG- máx. 2 MB</p>
                        <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-[#E60000] text-[#E60000] rounded-xl text-xs font-medium hover:bg-[#E60000]/10 transition cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          Seleccionar ficheiro
                          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Os documentos serão analisados pela federação após o registo. Pode enviá-los
                    também mais tarde na secção Documentos.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className={`flex gap-3 pt-4 ${currentStep === 1 ? '' : ''}`}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#3a3a3a] rounded-xl font-medium transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      A criar conta...
                    </span>
                  ) : currentStep === 4 ? (
                    'Criar conta'
                  ) : (
                    'Continuar'
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 lg:hidden pt-2">
                Já tem conta?{' '}
                <Link to="/login" className="text-[#E60000] font-semibold">
                  Inicie sessão
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
