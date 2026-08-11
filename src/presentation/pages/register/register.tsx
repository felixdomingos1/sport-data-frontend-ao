import React, { useEffect, useState, useRef } from 'react';
import {
  AlertCircle,
  ArrowLeft,
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
import { useAuthStore } from '../../../store/auth.store';
import { federacaoService } from '../../../infrastructure/services/federacao.service';
import { clubeService } from '../../../infrastructure/services/clube.service';
import { Federacao } from '@core/types/api.types';
import { PROVINCIAS, MODALIDADES } from '@core/constants/angola';
import { apiClient } from '../../../infrastructure/api/client';
import { API_ENDPOINTS } from '../../../infrastructure/api/endpoints';
import { StyledSelect } from '../../../presentation/components/ui/styled-select';
import { StyledDatePicker } from '../../../presentation/components/ui/styled-datepicker';
import { SEO } from '../../components/seo/seo';

const steps = [
  { id: 1, title: 'Dados pessoais', description: 'Nome, data de nascimento, contacto' },
  { id: 2, title: 'Credenciais de acesso', description: 'Email e palavra-passe' },
  { id: 3, title: 'Filiação', description: 'Federação, academia ou associação' },
  { id: 4, title: 'Documentos', description: 'Bilhete de identidade e foto' },
];

const inputClass = (hasError: boolean) =>
  `w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-[#1a1a1a] border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition ${
    hasError ? 'border-brand' : 'border-gray-200 dark:border-[#2a2a2a]'
  }`;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [federacoes, setFederacoes] = useState<Federacao[]>([]);
  const [academias, setAcademias] = useState<{ id: string; nome: string }[]>([]);
  const [clubes, setClubes] = useState<{ id: string; nome: string }[]>([]);
  const todasEntidades = modelo === 'ambos' ? [...academias, ...clubes] : modelo === 'equipas' ? clubes : academias;
  const [modelo, setModelo] = useState<string>('ambos');
  const [loadingFederacoes, setLoadingFederacoes] = useState(false);
  const [loadingEntidade, setLoadingEntidade] = useState(false);

  const [uploadingBI, setUploadingBI] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [biUploaded, setBiUploaded] = useState(false);
  const [fotoUploaded, setFotoUploaded] = useState(false);
  const [biUrl, setBiUrl] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

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
    academia: '',
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (_field: string) => {
    setTouched((prev) => ({ ...prev, [_field]: true }));
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
    setTouched({ nome: true, dataNascimento: true, genero: true, numeroBI: true, telefone: true, provincia: true, modalidade: true, acceptTerms: true });
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.password) newErrors.password = 'Palavra-passe é obrigatória';
    else {
      if (formData.password.length < 6) newErrors.password = 'Mínimo de 6 caracteres';
      else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Deve conter pelo menos uma letra maiúscula';
      else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Deve conter pelo menos um número';
    }
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirme a palavra-passe';
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'As palavras-passe não coincidem';
    setErrors(newErrors);
    setTouched({ email: true, password: true, confirmPassword: true });
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.federacao) newErrors.federacao = 'Seleccione a federação';
    if (!formData.academia) newErrors.academia = modelo === 'ambos' ? 'Seleccione a academia ou clube' : modelo === 'equipas' ? 'Seleccione o clube' : 'Seleccione a academia';
    setErrors(newErrors);
    setTouched({ federacao: true, academia: true });
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

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.nome.trim() && formData.dataNascimento && formData.genero && formData.numeroBI.trim() && formData.telefone.trim() && formData.provincia && formData.modalidade && formData.acceptTerms;
    }
    if (currentStep === 2) {
      return formData.email.trim() && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6;
    }
    if (currentStep === 3) {
      return !!formData.federacao && !!formData.academia;
    }
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    const without244 = digits.startsWith('244') ? digits.slice(3) : digits;
    const limited = without244.slice(0, 9);

    let display = '+244 ';
    if (limited.length > 0) display += limited.slice(0, 3);
    if (limited.length > 3) display += '-' + limited.slice(3, 6);
    if (limited.length > 6) display += '-' + limited.slice(6, 9);

    updateField('telefone', display);
  };

  const [biProgress, setBiProgress] = useState(0);
  const [fotoProgress, setFotoProgress] = useState(0);
  const progressRef = useRef<number>(0);

  const uploadToCloudinaryWithProgress = async (file: File): Promise<string> => {
    const sigData = await apiClient.get<{ timestamp: number; signature: string; cloudName: string; apiKey: string; folder: string }>(API_ENDPOINTS.UPLOAD.SIGNATURE);
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', String(sigData.timestamp));
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressRef.current = Math.round((e.loaded / e.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(formData);
    });
  };

  const handleBiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBiFile(file);
    setUploadingBI(true);
    setBiProgress(0);
    progressRef.current = 0;

    const interval = setInterval(() => {
      setBiProgress(progressRef.current);
      if (progressRef.current >= 100) clearInterval(interval);
    }, 100);

    try {
      const url = await uploadToCloudinaryWithProgress(file);
      setBiProgress(100);
      clearInterval(interval);
      setBiUrl(url);
      setBiUploaded(true);
      toast.success('BI enviado com sucesso');
    } catch {
      clearInterval(interval);
      toast.error('Erro ao enviar BI');
    } finally {
      setUploadingBI(false);
    }
  };

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setUploadingFoto(true);
    setFotoProgress(0);
    progressRef.current = 0;

    const interval = setInterval(() => {
      setFotoProgress(progressRef.current);
      if (progressRef.current >= 100) clearInterval(interval);
    }, 100);

    try {
      const url = await uploadToCloudinaryWithProgress(file);
      setFotoProgress(100);
      clearInterval(interval);
      setFotoUrl(url);
      setFotoUploaded(true);
      toast.success('Foto enviada com sucesso');
    } catch {
      clearInterval(interval);
      toast.error('Erro ao enviar foto');
    } finally {
      setUploadingFoto(false);
    }
  };

  useEffect(() => {
    if (currentStep === 3 && federacoes.length === 0) {
      setLoadingFederacoes(true);
      federacaoService.getAll({ limit: 50 })
        .then((res) => setFederacoes(res.data))
        .catch(() => toast.error('Erro ao carregar federações'))
        .finally(() => setLoadingFederacoes(false));
    }
  }, [currentStep, federacoes.length]);

  useEffect(() => {
    if (formData.federacao) {
      setLoadingEntidade(true);
      setAcademias([]);
      setClubes([]);
      setFormData((prev) => ({ ...prev, academia: '' }));

      apiClient.get<{ data: Federacao }>(`/federations/${formData.federacao}`)
        .then((federacao: any) => {
          const fedModelo = (federacao.configuracao as any)?.modelo || 'ambos';
          console.log('[Register] modelo:', fedModelo);
          setModelo(fedModelo);

          if (fedModelo === 'ambos') {
            return Promise.all([
              apiClient.get<{ data: { id: string; nome: string }[] }>(`/academias?federacaoId=${formData.federacao}&limit=100`),
              clubeService.getAll({ federacaoId: formData.federacao, limit: 100 }),
            ]).then(([acadRes, clubesArr]: any) => {
              const acads = acadRes.data ?? [];
              const clubs = clubesArr;
              console.log('[Register] Academias:', acads.length, 'Clubes:', clubs.length);
              setAcademias(acads);
              setClubes(clubs);
            });
          } else if (fedModelo === 'academias') {
            return apiClient.get<{ data: { id: string; nome: string }[] }>(`/academias?federacaoId=${formData.federacao}&limit=100`)
              .then((res: any) => {
                console.log('[Register] Academias:', res.data?.length);
                setAcademias(res.data ?? []);
              });
          } else {
            return clubeService.getAll({ federacaoId: formData.federacao, limit: 100 })
              .then((res) => {
                console.log('[Register] Clubes:', res.length);
                setClubes(res);
              });
          }
        })
        .catch((err) => {
          console.error('[Register] Erro ao carregar entidades:', err);
          toast.error('Erro ao carregar entidades');
        })
        .finally(() => setLoadingEntidade(false));
    } else {
      setAcademias([]);
      setClubes([]);
      setModelo('ambos');
    }
  }, [formData.federacao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      handleNext();
      return;
    }
    setIsLoading(true);
    try {
      const telefoneLimpo = formData.telefone.replace(/[\s-]/g, '');
      await authService.register({
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: telefoneLimpo,
        password: formData.password,
        nomeCompleto: formData.nome.trim(),
        dataNascimento: formData.dataNascimento,
        genero: formData.genero,
        numeroBI: formData.numeroBI.trim(),
        provincia: formData.provincia,
        modalidade: formData.modalidade,
        federacaoId: formData.federacao || undefined,
        ...(modelo === 'equipas'
          ? { clubeId: formData.academia || undefined }
          : { academiaId: formData.academia || undefined }),
        biUrl: biUrl || undefined,
        fotoUrl: fotoUrl || undefined,
      });
      toast.success('Conta criada com sucesso!');
      try {
        await login(formData.email.trim(), formData.password);
        toast.success('A sua inscrição foi enviada para aprovação da academia. Pode acompanhar o estado no painel.', { duration: 6000 });
        navigate('/dashboard');
      } catch {
        navigate('/login?redirect=/dashboard');
      }
    } catch (error: unknown) {
      const message = (error as any)?.message || 'Erro ao criar conta';
      toast.error(message);
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
    <div className="min-h-screen flex bg-white dark:bg-[#0f0f0f]">
      <SEO title="Criar Conta" description="Registe-se na Sport Data Angola e faça parte do desporto angolano." canonical="/register" />
      {/* Left- Stepper */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between border-r border-gray-200 dark:border-[#1a1a1a] p-10 xl:p-14 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 bg-[#E60000] rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">SPORT DATA</p>
              <p className="text-[11px] text-gray-500 tracking-widest">ANGOLA</p>
            </div>
          </div>
          <h1 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white mb-3">Crie a sua conta</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-10">
            Registe-se gratuitamente e aceda à plataforma nacional de gestão desportiva de Angola.
          </p>
          <div className="space-y-6">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition ${
                    isActive ? 'bg-[#E60000] text-white' : isCompleted ? 'bg-[#E60000]/20 text-[#E60000]' : 'bg-gray-200 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-600 border border-gray-300 dark:border-[#2a2a2a]'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.id}
                  </div>
                  <div className={isActive || isCompleted ? 'opacity-100' : 'opacity-40'}>
                    <p className={`text-sm font-semibold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Já tem conta?{' '}
          <Link to="/login" className="text-[#E60000] hover:text-[#ff3333] font-semibold transition">Inicie sessão</Link>
        </p>
      </div>

      {/* Right- Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen overflow-y-auto">
        <div className="flex-1 flex items-start lg:items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-xl">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:hover:text-white hover:text-gray-900 text-sm mb-6 transition">
              <ArrowLeft className="w-4 h-4" />
              Voltar para página inicial
            </Link>
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">SPORT DATA</p>
                <p className="text-[11px] text-gray-500 tracking-widest">ANGOLA</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-600">
                  Passo {currentStep} de {steps.length}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full bg-[#E60000] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{steps[currentStep - 1].title}</h2>
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
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="text" value={formData.nome} onChange={(e) => updateField('nome', e.target.value)} onBlur={() => handleBlur('nome')}
                        className={inputClass(!!errors.nome && !!touched.nome)} placeholder="João Carlos Mateus" />
                    </div>
                    <FieldError field="nome" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <StyledDatePicker
                        label="Data de Nascimento"
                        value={formData.dataNascimento}
                        onChange={(v) => { updateField('dataNascimento', v); handleBlur('dataNascimento'); }}
                        error={!!errors.dataNascimento}
                        touched={!!touched.dataNascimento}
                      />
                      <FieldError field="dataNascimento" />
                    </div>
                    <div>
                      <StyledSelect
                        label="Género"
                        value={formData.genero}
                        onChange={(v) => { updateField('genero', v); handleBlur('genero'); }}
                        options={[
                          { label: 'Masculino', value: 'Masculino' },
                          { label: 'Feminino', value: 'Feminino' },
                        ]}
                        placeholder="Seleccionar"
                        icon={<User className="w-4 h-4" />}
                        error={!!errors.genero}
                        touched={!!touched.genero}
                      />
                      <FieldError field="genero" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Nº de Bilhete de Identidade</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" value={formData.numeroBI} onChange={(e) => updateField('numeroBI', e.target.value)} onBlur={() => handleBlur('numeroBI')}
                          className={inputClass(!!errors.numeroBI && !!touched.numeroBI)} placeholder="004823771LA041" />
                      </div>
                      <FieldError field="numeroBI" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="tel" value={formData.telefone} onChange={handlePhoneChange} onBlur={() => handleBlur('telefone')}
                          className={inputClass(!!errors.telefone && !!touched.telefone)} placeholder="+244 9XX-XXX-XXX" />
                      </div>
                      <FieldError field="telefone" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <StyledSelect
                        label="Província"
                        value={formData.provincia}
                        onChange={(v) => { updateField('provincia', v); handleBlur('provincia'); }}
                        options={PROVINCIAS.map((p) => ({ label: p, value: p }))}
                        placeholder="Seleccionar"
                        icon={<MapPin className="w-4 h-4" />}
                        error={!!errors.provincia}
                        touched={!!touched.provincia}
                      />
                      <FieldError field="provincia" />
                    </div>
                    <div>
                      <StyledSelect
                        label="Modalidade Principal"
                        value={formData.modalidade}
                        onChange={(v) => { updateField('modalidade', v); handleBlur('modalidade'); }}
                        options={MODALIDADES.map((m) => ({ label: m, value: m }))}
                        placeholder="Seleccionar"
                        icon={<Layers className="w-4 h-4" />}
                        error={!!errors.modalidade}
                        touched={!!touched.modalidade}
                      />
                      <FieldError field="modalidade" />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group pt-1">
                    <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => updateField('acceptTerms', e.target.checked)} onBlur={() => handleBlur('acceptTerms')}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-[#2a2a2a] bg-gray-100 dark:bg-[#1a1a1a] accent-[#E60000] cursor-pointer" />
                    <span className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition">
                      Concordo com os <Link to="/termos" target="_blank" className="text-[#E60000] hover:underline">Termos de Serviço</Link> e a{' '}
                      <Link to="/privacidade" target="_blank" className="text-[#E60000] hover:underline">Política de Privacidade</Link> da Sport Data Angola.
                    </span>
                  </label>
                  <FieldError field="acceptTerms" />
                </>
              )}

              {/* Step 2- Credenciais */}
              {currentStep === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} onBlur={() => handleBlur('email')}
                        className={inputClass(!!errors.email && !!touched.email)} placeholder="joao.mateus@email.com" />
                    </div>
                    <FieldError field="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Palavra-passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => updateField('password', e.target.value)} onBlur={() => handleBlur('password')}
                        className={`${inputClass(!!errors.password && !!touched.password)} pr-12`} placeholder="Mínimo 6 caracteres" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 dark:hover:text-gray-300 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <FieldError field="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Confirmar Palavra-passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} onBlur={() => handleBlur('confirmPassword')}
                        className={`${inputClass(!!errors.confirmPassword && !!touched.confirmPassword)} pr-12`} placeholder="Repita a palavra-passe" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 dark:hover:text-gray-300 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <StyledSelect
                      label="Federação"
                      value={formData.federacao}
                      onChange={(v) => { updateField('federacao', v); handleBlur('federacao'); }}
                      options={loadingFederacoes
                        ? [{ label: 'A carregar...', value: '' }]
                        : federacoes.map((f) => ({ label: f.nome, value: f.id }))
                      }
                      placeholder={loadingFederacoes ? 'A carregar federações...' : 'Seleccionar federação'}
                      error={!!errors.federacao}
                      touched={!!touched.federacao}
                      disabled={loadingFederacoes}
                    />
                    <FieldError field="federacao" />
                  </div>
                  <div>
                    <StyledSelect
                      label={modelo === 'ambos' ? 'Academia / Clube' : modelo === 'equipas' ? 'Clube' : 'Academia'}
                      value={formData.academia}
                      onChange={(v) => { updateField('academia', v); handleBlur('academia'); }}
                      options={!formData.federacao
                        ? [{ label: 'Seleccione primeiro uma federação', value: '' }]
                        : loadingEntidade
                          ? [{ label: 'A carregar...', value: '' }]
                          : [{ label: modelo === 'ambos' ? 'Seleccionar academia ou clube' : modelo === 'equipas' ? 'Seleccionar clube' : 'Seleccionar academia', value: '' }, ...todasEntidades.map((e) => ({ label: e.nome, value: e.id }))]
                      }
                      placeholder={!formData.federacao ? 'Seleccione primeiro uma federação' : loadingEntidade ? 'A carregar...' : modelo === 'ambos' ? 'Seleccionar academia ou clube' : modelo === 'equipas' ? 'Seleccionar clube' : 'Seleccionar academia'}
                      disabled={!formData.federacao || loadingEntidade}
                    />
                  </div>
                </>
              )}

              {/* Step 4- Documentos */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="border border-dashed border-gray-300 dark:border-[#2a2a2a] rounded-2xl p-6 hover:border-[#E60000]/40 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Bilhete de Identidade</p>
                        <p className="text-xs text-gray-500 mt-0.5">PDF ou imagem - máx. 5 MB</p>
                        {biUploaded ? (
                          <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" /> BI enviado com sucesso
                          </div>
                        ) : uploadingBI ? (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400">A enviar...</span>
                              <span className="text-gray-500">{biProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#E60000] rounded-full transition-all duration-300"
                                style={{ width: `${biProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-[#E60000] text-[#E60000] rounded-xl text-xs font-medium hover:bg-[#E60000]/10 transition cursor-pointer">
                            <Upload className="w-3.5 h-3.5" /> Seleccionar ficheiro
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleBiUpload} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border border-dashed border-gray-300 dark:border-[#2a2a2a] rounded-2xl p-6 hover:border-[#E60000]/40 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-xl flex items-center justify-center shrink-0">
                        <Image className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Foto 3x4 com fundo branco</p>
                        <p className="text-xs text-gray-500 mt-0.5">JPG ou PNG - máx. 2 MB</p>
                        {fotoUploaded ? (
                          <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" /> Foto enviada com sucesso
                          </div>
                        ) : uploadingFoto ? (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400">A enviar...</span>
                              <span className="text-gray-500">{fotoProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#E60000] rounded-full transition-all duration-300"
                                style={{ width: `${fotoProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-[#E60000] text-[#E60000] rounded-xl text-xs font-medium hover:bg-[#E60000]/10 transition cursor-pointer">
                            <Upload className="w-3.5 h-3.5" /> Seleccionar ficheiro
                            <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFotoUpload} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-600">
                    Os documentos serão analisados pela federação após o registo. Pode enviá-los também mais tarde na secção Documentos.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {currentStep > 1 && (
                  <button type="button" onClick={handleBack}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 dark:hover:text-white dark:hover:border-[#3a3a3a] hover:text-gray-900 hover:border-gray-400 rounded-xl font-medium transition">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                )}
                <button type="submit" disabled={isLoading || !canProceed()}
                  className="flex-1 py-3.5 bg-[#E60000] hover:bg-[#cc0000] text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> A criar conta...
                    </span>
                  ) : currentStep === 4 ? 'Criar conta' : 'Continuar'}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 lg:hidden pt-2">
                Já tem conta?{' '}
                <Link to="/login" className="text-[#E60000] font-semibold">Inicie sessão</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
