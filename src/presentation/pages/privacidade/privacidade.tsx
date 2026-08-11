import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { SEO } from '../../components/seo/seo';

const PoliticaPrivacidade: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <SEO
        title="Política de Privacidade"
        description="Política de privacidade e protecção de dados pessoais da plataforma Sport Data Angola."
        canonical="/privacidade"
      />

      <header className="border-b border-gray-200 dark:border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#E60000] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">SPORT DATA</p>
              <p className="text-[11px] text-gray-500 tracking-widest">ANGOLA</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xs text-gray-500 dark:text-gray-600 uppercase tracking-widest mb-2">Documento Legal</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Última atualização: 11 de Agosto de 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Introdução</h2>
            <p>
              A <strong>Sport Data Angola</strong> (&ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou
              &ldquo;Plataforma&rdquo;) está comprometida com a protecção dos dados pessoais dos seus
              utilizadores (&ldquo;Utilizador&rdquo; ou &ldquo;Titular dos Dados&rdquo;), em conformidade
              com a <strong>Lei n.º 22/11, de 17 de Junho — Lei da Protecção de Dados Pessoais</strong>{' '}
              da República de Angola e demais legislação aplicável.
            </p>
            <p className="mt-3">
              Esta Política de Privacidade descreve como recolhemos, utilizamos, armazenamos e protegemos
              as informações pessoais fornecidas pelos Utilizadores da Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Dados Recolhidos</h2>
            <p className="mb-3">A Sport Data Angola recolhe as seguintes categorias de dados pessoais:</p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">2.1. Dados de Identificação</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nome completo</li>
                  <li>Data de nascimento</li>
                  <li>Género</li>
                  <li>Número de Bilhete de Identidade (BI)</li>
                  <li>Número de passaporte (quando aplicável)</li>
                  <li>Nacionalidade</li>
                  <li>Província de residência</li>
                  <li>Fotografia 3x4</li>
                  <li>Cópia digital do Bilhete de Identidade</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">2.2. Dados de Contacto</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Endereço de e-mail</li>
                  <li>Número de telefone</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">2.3. Dados Desportivos</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Modalidade desportiva principal</li>
                  <li>Federação de filiação</li>
                  <li>Academia ou clube de filiação</li>
                  <li>Peso e altura</li>
                  <li>Histórico de inscrições em campeonatos</li>
                  <li>Resultados, classificações e rankings</li>
                  <li>Documentos desportivos (certificados médicos, seguros, termos de responsabilidade)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">2.4. Dados de Navegação e Técnicos</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Endereço IP</li>
                  <li>Tipo de navegador e sistema operativo</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                  <li>Cookies essenciais para o funcionamento da Plataforma</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Finalidade do Tratamento</h2>
            <p className="mb-3">Os dados pessoais são recolhidos e tratados para as seguintes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Gestão de conta:</strong> criar e gerir a conta do Utilizador na Plataforma;</li>
              <li><strong>Filiação desportiva:</strong> registar o atleta junto de federações, associações e academias;</li>
              <li><strong>Inscrição em campeonatos:</strong> processar inscrições e participações em competições desportivas;</li>
              <li><strong>Emissão de licenças:</strong> emitir licenças desportivas digitais;</li>
              <li><strong>Comunicação:</strong> enviar notificações sobre campeonatos, eventos, prazos e alterações relevantes;</li>
              <li><strong>Pagamentos:</strong> processar pagamentos de planos, inscrições e taxas;</li>
              <li><strong>Estatísticas e rankings:</strong> gerar classificações e estatísticas desportivas públicas;</li>
              <li><strong>Cumprimento legal:</strong> responder a obrigações legais e regulatórias aplicáveis;</li>
              <li><strong>Melhoria do serviço:</strong> analisar padrões de utilização para melhorar a Plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Base Legal para o Tratamento</h2>
            <p className="mb-3">
              O tratamento dos dados pessoais é realizado com base nos seguintes fundamentos legais, nos
              termos da Lei da Protecção de Dados Pessoais:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Consentimento do Titular:</strong> para o registo, envio de comunicações e tratamento de documentos;</li>
              <li><strong>Execução de contrato:</strong> para a prestação dos serviços contratados (planos, inscrições);</li>
              <li><strong>Cumprimento de obrigação legal:</strong> para verificação de identidade perante federações e autoridades desportivas;</li>
              <li><strong>Interesse legítimo:</strong> para melhoria da Plataforma, prevenção de fraude e segurança.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Partilha de Dados com Terceiros</h2>
            <p className="mb-3">
              A Sport Data Angola poderá partilhar os dados pessoais do Utilizador com as seguintes
              entidades, exclusivamente para as finalidades descritas nesta Política:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Federações, Associações e Academias:</strong> para efeitos de filiação, validação de documentos, inscrições e participação em competições;</li>
              <li><strong>Prestadores de serviços:</strong> processadores de pagamento, serviços de armazenamento em nuvem (Cloudinary), serviços de e-mail;</li>
              <li><strong>Autoridades competentes:</strong> quando exigido por lei, ordem judicial ou determinação de autoridade administrativa.</li>
            </ul>
            <p className="mt-3">
              A Sport Data Angola não vende, aluga ou comercializa dados pessoais dos seus Utilizadores
              a terceiros para fins de marketing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Transferência Internacional de Dados</h2>
            <p>
              Alguns dos nossos prestadores de serviços (como o Cloudinary para armazenamento de imagens)
              podem estar localizados fora de Angola. Nestes casos, a Sport Data Angola assegura que são
              adoptadas as medidas técnicas e contratuais adequadas para garantir um nível de protecção
              equivalente ao exigido pela legislação angolana.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Conservação dos Dados</h2>
            <p className="mb-3">
              Os dados pessoais são conservados apenas durante o período necessário para as finalidades
              para as quais foram recolhidos, observando os seguintes prazos:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dados de conta:</strong> enquanto a conta estiver activa e até 2 (dois) anos após o cancelamento;</li>
              <li><strong>Dados desportivos e rankings:</strong> conservados permanentemente para fins estatísticos e históricos, de forma anonimizada sempre que possível;</li>
              <li><strong>Documentos de identificação:</strong> até 5 (cinco) anos após o cancelamento da conta, para cumprimento de obrigações legais;</li>
              <li><strong>Dados de pagamento:</strong> pelo período exigido pela legislação fiscal angolana (10 anos).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Direitos do Titular dos Dados</h2>
            <p className="mb-3">
              Nos termos da Lei da Protecção de Dados Pessoais, o Utilizador tem os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Direito de acesso:</strong> obter confirmação sobre se os seus dados estão a ser tratados e aceder aos mesmos;</li>
              <li><strong>Direito de rectificação:</strong> solicitar a correcção de dados inexactos ou incompletos;</li>
              <li><strong>Direito de eliminação:</strong> solicitar a eliminação dos seus dados, nos casos previstos na lei;</li>
              <li><strong>Direito de oposição:</strong> opor-se ao tratamento dos seus dados para fins de marketing directo;</li>
              <li><strong>Direito de limitação:</strong> solicitar a limitação do tratamento em determinadas circunstâncias;</li>
              <li><strong>Direito de portabilidade:</strong> receber os seus dados num formato estruturado e transferi-los para outro responsável;</li>
              <li><strong>Direito de retirar o consentimento:</strong> a qualquer momento, sem afectar a licitude do tratamento anterior.</li>
            </ul>
            <p className="mt-3">
              Para exercer os seus direitos, o Utilizador deverá contactar-nos através do e-mail{' '}
              <a href="mailto:privacidade@sportdataangola.com" className="text-[#E60000] hover:underline">
                privacidade@sportdataangola.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Segurança dos Dados</h2>
            <p>
              A Sport Data Angola implementa medidas técnicas e organizativas adequadas para proteger os
              dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição, incluindo:
              encriptação de dados em trânsito (SSL/TLS), armazenamento seguro de palavras-passe (hash
              com bcrypt), autenticação de dois factores para administradores, monitorização contínua de
              acessos e backups regulares.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. Cookies</h2>
            <p className="mb-3">
              A Plataforma utiliza cookies essenciais para o seu funcionamento, nomeadamente:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Cookies de sessão:</strong> necessários para manter o Utilizador autenticado durante a navegação;</li>
              <li><strong>Cookies de preferências:</strong> para memorizar preferências de tema (claro/escuro) e idioma.</li>
            </ul>
            <p className="mt-3">
              A Plataforma não utiliza cookies de rastreamento de terceiros para fins publicitários.
              O Utilizador poderá configurar o seu navegador para recusar cookies, mas tal poderá
              afectar a funcionalidade da Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">11. Menores de Idade</h2>
            <p>
              A Plataforma não é dirigida a menores de 16 (dezasseis) anos. Não recolhemos intencionalmente
              dados pessoais de menores sem o consentimento verificável dos seus representantes legais.
              Caso tomemos conhecimento de que recolhemos inadvertidamente dados de um menor sem o devido
              consentimento, eliminaremos esses dados de imediato.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">12. Alterações a esta Política</h2>
            <p>
              A Sport Data Angola reserva-se o direito de actualizar esta Política de Privacidade a
              qualquer momento. As alterações serão publicadas nesta página e, quando significativas,
              os Utilizadores serão notificados por e-mail ou através de aviso na Plataforma com pelo
              menos 15 (quinze) dias de antecedência.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">13. Encarregado de Protecção de Dados</h2>
            <p>
              Para quaisquer questões relacionadas com a protecção de dados pessoais, o Utilizador
              poderá contactar o Encarregado de Protecção de Dados da Sport Data Angola através do e-mail{' '}
              <a href="mailto:privacidade@sportdataangola.com" className="text-[#E60000] hover:underline">
                privacidade@sportdataangola.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">14. Autoridade de Controlo</h2>
            <p>
              O Utilizador tem o direito de apresentar reclamação junto da autoridade de controlo
              competente em matéria de protecção de dados pessoais na República de Angola — a{' '}
              <strong>Agência de Protecção de Dados (APD)</strong> — caso considere que os seus
              direitos foram violados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">15. Contacto</h2>
            <p>
              Para qualquer esclarecimento sobre esta Política de Privacidade, contacte-nos através de:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>E-mail: <a href="mailto:privacidade@sportdataangola.com" className="text-[#E60000] hover:underline">privacidade@sportdataangola.com</a></li>
              <li>Morada: Sport Data Angola, Luanda, República de Angola</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-[#1a1a1a]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Voltar para página inicial
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PoliticaPrivacidade;
