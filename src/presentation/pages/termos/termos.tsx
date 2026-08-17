import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { SEO } from '../../components/seo/seo';

const TermosServico: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <SEO
        title="Termos de Serviço"
        description="Termos e condições de utilização da plataforma Sport Data Angola."
        canonical="/termos"
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Termos de Serviço</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Última atualização: 11 de Agosto de 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao aceder e utilizar a plataforma <strong>Sport Data Angola</strong> (&ldquo;Plataforma&rdquo;),
              disponível em <strong>sportdataangola.com</strong>, o utilizador (&ldquo;Utilizador&rdquo; ou
              &ldquo;Atleta&rdquo;) concorda integralmente com os presentes Termos de Serviço (&ldquo;Termos&rdquo;).
              Caso não concorde com qualquer disposição aqui contida, deverá abster-se de utilizar a Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Descrição do Serviço</h2>
            <p>
              A Sport Data Angola é uma plataforma digital de gestão desportiva que permite:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>O registo e gestão de atletas, clubes, associações e federações desportivas;</li>
              <li>A organização e gestão de campeonatos, competições e eventos desportivos;</li>
              <li>A emissão de licenças desportivas digitais e gestão de documentos;</li>
              <li>A consulta de rankings, estatísticas e calendários desportivos;</li>
              <li>A comunicação entre os diversos intervenientes do ecossistema desportivo angolano.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Elegibilidade e Registo</h2>
            <p className="mb-3">
              <strong>3.1.</strong> Para se registar na Plataforma, o Utilizador deve ter pelo menos 16 (dezasseis)
              anos de idade ou estar devidamente autorizado por um representante legal.
            </p>
            <p className="mb-3">
              <strong>3.2.</strong> O Utilizador compromete-se a fornecer informações verdadeiras, precisas,
              actuais e completas durante o processo de registo, incluindo nome completo, número de bilhete de
              identidade, data de nascimento e demais dados solicitados.
            </p>
            <p className="mb-3">
              <strong>3.3.</strong> A falsificação de documentos ou a prestação de informações falsas constitui
              violação grave dos presentes Termos e poderá resultar na suspensão ou cancelamento imediato da
              conta, sem prejuízo de responsabilidade civil e criminal nos termos da legislação angolana aplicável.
            </p>
            <p>
              <strong>3.4.</strong> Cada Utilizador é responsável por manter a confidencialidade das suas
              credenciais de acesso (e-mail e palavra-passe). Qualquer actividade realizada através da sua
              conta será da sua exclusiva responsabilidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Planos e Pagamentos</h2>
            <p className="mb-3">
              <strong>4.1.</strong> O registo na Plataforma é gratuito. Contudo, determinadas funcionalidades,
              como a inscrição em campeonatos, emissão de licenças e acesso a funcionalidades premium, estão
              sujeitas ao pagamento de taxas de acordo com os planos disponíveis (&ldquo;Planos&rdquo;).
            </p>
            <p className="mb-3">
              <strong>4.2.</strong> Os preços e condições dos Planos são apresentados na página de subscrição
              e podem ser alterados mediante aviso prévio de 30 (trinta) dias.
            </p>
            <p>
              <strong>4.3.</strong> Os pagamentos são processados através de gateways de pagamento seguros,
              e a Sport Data Angola não armazena dados completos de cartões de crédito ou débito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Direitos e Deveres do Utilizador</h2>
            <p className="mb-3"><strong>O Utilizador tem o direito de:</strong></p>
            <ul className="list-disc pl-6 mt-1 mb-4 space-y-1">
              <li>Aceder à Plataforma de acordo com os Planos subscritos;</li>
              <li>Actualizar, rectificar ou eliminar os seus dados pessoais, nos termos da lei;</li>
              <li>Receber suporte técnico através dos canais oficiais;</li>
              <li>Cancelar a sua conta a qualquer momento.</li>
            </ul>
            <p className="mb-3"><strong>O Utilizador compromete-se a:</strong></p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Não utilizar a Plataforma para fins ilícitos ou não autorizados;</li>
              <li>Não publicar conteúdos ofensivos, difamatórios, obscenos ou que violem direitos de terceiros;</li>
              <li>Não tentar aceder a áreas restritas da Plataforma ou a dados de outros utilizadores;</li>
              <li>Não utilizar mecanismos automatizados (bots, scrapers) para extrair dados da Plataforma sem autorização;</li>
              <li>Respeitar os direitos de propriedade intelectual da Sport Data Angola e de terceiros.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da Plataforma, incluindo mas não se limitando a textos, gráficos, logótipos,
              ícones, imagens, código-fonte, base de dados e software, é propriedade exclusiva da Sport Data
              Angola ou dos seus licenciadores, estando protegido pelas leis de propriedade intelectual da
              República de Angola e tratados internacionais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Limitação de Responsabilidade</h2>
            <p className="mb-3">
              <strong>7.1.</strong> A Sport Data Angola envida todos os esforços para garantir a disponibilidade,
              segurança e exactidão da Plataforma. No entanto, a Plataforma é fornecida &ldquo;tal como está&rdquo;
              (&ldquo;as is&rdquo;), sem garantias expressas ou implícitas.
            </p>
            <p>
              <strong>7.2.</strong> Em nenhuma circunstância a Sport Data Angola será responsável por danos
              indirectos, incidentais, especiais ou consequentes resultantes da utilização ou impossibilidade
              de utilização da Plataforma, incluindo perda de dados, lucros cessantes ou interrupção de negócios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Suspensão e Cancelamento</h2>
            <p className="mb-3">
              <strong>8.1.</strong> A Sport Data Angola reserva-se o direito de suspender ou cancelar qualquer
              conta de Utilizador que viole os presentes Termos, sem aviso prévio e sem direito a reembolso.
            </p>
            <p>
              <strong>8.2.</strong> O Utilizador poderá cancelar a sua conta a qualquer momento através das
              definições da Plataforma. O cancelamento não exonera o Utilizador do pagamento de valores
              devidos até à data do cancelamento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Legislação Aplicável e Foro</h2>
            <p>
              Os presentes Termos são regidos e interpretados de acordo com as leis da República de Angola.
              Para dirimir quaisquer litígios emergentes da interpretação ou execução dos presentes Termos,
              as partes elegem o foro da comarca de Luanda, com expressa renúncia a qualquer outro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. Alterações aos Termos</h2>
            <p>
              A Sport Data Angola reserva-se o direito de modificar os presentes Termos a qualquer momento.
              As alterações entrarão em vigor 15 (quinze) dias após a sua publicação na Plataforma. A
              continuação da utilização da Plataforma após esse período constitui aceitação tácita das
              novas condições.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">11. Contacto</h2>
            <p>
              Para questões relacionadas com os presentes Termos de Serviço, o Utilizador poderá contactar
              a equipa da Sport Data Angola através do e-mail{' '}
              <a href="mailto:suporte@sportdataangola.com" className="text-[#E60000] hover:underline">
                suporte@sportdataangola.com
              </a>{' '}
              ou através dos canais de suporte disponíveis na Plataforma.
            </p>
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

export default TermosServico;
