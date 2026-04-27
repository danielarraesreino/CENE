"use client";

import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Video, 
  FileText, 
  CheckCircle, 
  Info, 
  Play, 
  Layout, 
  UserPlus, 
  HeartHandshake,
  MessageSquare,
  AlertTriangle,
  FileSignature
} from 'lucide-react';

// --- COMPONENTES DE UI REUTILIZÁVEIS ---

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
    {children}
  </div>
);

const TeacherNote = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4 rounded-r-lg">
    <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2">
      <Info size={18} />
      <span>Nota de Produção / Material de Apoio</span>
    </div>
    <div className="text-amber-900 text-sm">
      {children}
    </div>
  </div>
);

const VideoPlaceholder = ({ title, duration }: { title: string, duration: string }) => (
  <div className="bg-slate-800 rounded-lg aspect-video flex flex-col items-center justify-center text-white relative overflow-hidden group cursor-pointer">
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
    <Play size={48} className="mb-2 text-white/80 group-hover:text-white transition-transform group-hover:scale-110" />
    <span className="font-medium z-10">{title}</span>
    <span className="text-sm text-slate-300 z-10">{duration}</span>
  </div>
);

// --- CONTEÚDOS DOS MÓDULOS ---

const IntroContent = () => (
  <div className="space-y-8 animation-fade-in">
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Apresentação do Curso</h2>
      <p className="text-slate-600 text-lg">Boas-vindas e introdução ao Manual para Conselheiros em DQ.</p>
    </div>

    <Card>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Video className="text-blue-600" />
        Vídeos Introdutórios
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VideoPlaceholder title="Apresentação Matheus/CENE" duration="Máx 90 seg" />
        <VideoPlaceholder title="Proposta do Curso" duration="Máx 90 seg" />
        <VideoPlaceholder title="O e-book Gratuito" duration="Máx 90 seg" />
      </div>
      
      <TeacherNote>
        <strong>Ação pendente:</strong> Escrever roteiro da fala, revisar conteúdo do Manual, fazer Capa/Arte final e diagramação para o e-book. <br/>
        <strong>Responsável:</strong> Matheus | <strong>Prazo:</strong> 10 de maio
      </TeacherNote>
    </Card>
  </div>
);

const Module1Content = () => (
  <div className="space-y-8 animation-fade-in">
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Módulo 1: Introdução</h2>
      <p className="text-slate-600 text-lg">A Comunidade Terapêutica como Micro Sociedade e o papel do Profissional de Referência.</p>
    </div>

    <Card>
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">Contexto Histórico e Legal</h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-2">
          <CheckCircle className="text-green-500 mt-1 shrink-0" size={20} />
          <span><strong>História das CTs:</strong> Panorama no mundo e no Brasil.</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="text-green-500 mt-1 shrink-0" size={20} />
          <span><strong>Definição atual:</strong> A CT presente na legislação atual.</span>
        </li>
      </ul>
      <TeacherNote>
        Inserir <strong>Anexo 1</strong> (História) e <strong>Anexo 2 + Docs</strong> (Legislação atual).
      </TeacherNote>
    </Card>

    <Card>
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">A CT como Micro Sociedade</h3>
      <p className="mb-4 text-slate-700">
        Para George De Leon e outros teóricos do modelo clássico, a CT opera como um mundo em miniatura, 
        onde a convivência reproduz os desafios da vida real em um ambiente controlado.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-1">Espelhamento Social</h4>
          <p className="text-sm text-blue-800">A CT reflete as normas, papéis e responsabilidades da sociedade externa.</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-1">Aprendizado Vicariante</h4>
          <p className="text-sm text-blue-800">Residentes aprendem observando o comportamento e as consequências uns dos outros.</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-1">Hierarquia e Estrutura</h4>
          <p className="text-sm text-blue-800">O uso de funções (cargos) simula o mercado de trabalho e a estrutura cidadã.</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-1">Cultura de Pertencimento</h4>
          <p className="text-sm text-blue-800">O indivíduo deixa de ser "paciente" para se tornar "membro" de uma coletividade.</p>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">O Ordenamento e a Nova Figura</h3>
      <div className="space-y-4 text-slate-700">
        <p>
          A eficácia da micro sociedade reside na identificação. O residente não segue ordens de um médico, 
          mas sim as normas de um grupo com o qual ele se identifica, tornando necessária uma organização estrutural (Vide Anexo 4).
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Necessidade de ambiente que favoreça identificação entre pares.</li>
          <li>Resolução CONAD 01/15: Exigência de um Profissional de Referência por acolhido.</li>
          <li>Atendimento especializado: Demandas clínicas, psiquiátricas e psicossociais complexas.</li>
        </ul>
        <div className="bg-slate-100 p-4 rounded border-l-4 border-blue-500 mt-4">
          <p className="font-medium text-slate-800">
            É neste contexto que surge a necessidade do <strong>Profissional de Referência (Conselheiro)</strong>. 
            Este e-book descreve suas atribuições, postura e técnicas.
          </p>
        </div>
      </div>
      <TeacherNote>
        - Linkar melhor o assunto Micro Sociedade com a necessidade do Conselheiro.<br/>
        - Aqui pode entrar uma aula sobre <strong>Plano de Atendimento Singular (PAS) - Anexo 3</strong>.<br/>
        - Inserir hiperlinks sobre <strong>Psicopatologia</strong>.
      </TeacherNote>
    </Card>
  </div>
);

const Module2Content = () => (
  <div className="space-y-8 animation-fade-in">
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Módulo 2: Apresentação do Manual</h2>
      <p className="text-slate-600 text-lg">Objetivos, definições e a estrutura do Manual do Conselheiro.</p>
    </div>

    <Card>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="text-blue-600" />
        Objetivo do Manual
      </h3>
      <p className="text-slate-700 mb-4">
        Apresentar maneiras de o Conselheiro aplicar suas qualidades básicas, tornando-se mais eficiente e criando um ambiente 
        que estimule o Acolhido a vivenciar plenamente seu Plano de Atendimento Singular (PAS), mantendo o enfoque terapêutico 
        com técnicas claras baseadas no modelo de CT.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6 relative">
        <div className="absolute -top-3 -left-3 bg-blue-600 text-white p-2 rounded-full shadow-md">
          <Users size={20} />
        </div>
        <h4 className="font-bold text-blue-900 ml-4 mb-2">Definição: Profissional de Referência</h4>
        <p className="text-blue-800 italic ml-4">
          "O profissional encarregado da oferta e da integração das atividades, serviços e dos demais profissionais envolvidos. 
          Cabe a ele facilitar a integração social do indivíduo, mapeando sua rede social, identificando demandas, propondo 
          soluções e fornecendo aporte. Pode fazer a interlocução com familiares e grupos de convívio..." 
          <br/><span className="text-sm font-semibold mt-2 block">— Ribeiro & Laranjeira (org.), 2013.</span>
        </p>
      </div>

      <TeacherNote>
        Considerar introduzir aqui (ou no final) a origem histórica do Conselheiro em DQ, 
        trazido para o Brasil por John Burns (Fundador da Vila Serena / Método Minnesota).
      </TeacherNote>
    </Card>

    <Card>
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">Subdivisões do Manual</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {[
          "I. O dia a dia do Conselheiro",
          "II. O conselheiro como Modelo",
          "III. O conselheiro e suas Competências Técnicas",
          "IV. O conselheiro como Agente de Mudanças",
          "V. O conselheiro, o Registro e a Coleta de Dados",
          "VI. A História – O Modelo Minnesota",
          "VII. Técnicas de Aconselhamento",
          "VIII. Considerações Finais"
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded border border-slate-100 hover:border-blue-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
              {idx + 1}
            </div>
            <span className="font-medium text-slate-700">{item.substring(item.indexOf(' ')+1)}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const Module3Content = () => (
  <div className="space-y-8 animation-fade-in">
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Módulo 3: O Dia a Dia do Conselheiro</h2>
      <p className="text-slate-600 text-lg">Rotinas, atribuições e intervenções práticas.</p>
    </div>

    <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
        <HeartHandshake /> Ambiente de Auto-Ajuda
      </h3>
      <p className="text-indigo-100">
        "Membros de uma Comunidade, trabalhando juntos para ajudarem uns aos outros e a si mesmo. 
        Um ambiente de auto-ajuda é aquele que dá apoio e tem uma preocupação humanizada e estimula a autonomia."
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Task 1 */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <Users className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-bold text-slate-800 mb-2">1. Reuniões com Monitores</h4>
            <p className="text-sm text-slate-600">Além das atividades do cronograma, promove reuniões semanais com Monitores/Integradores do seu grupo.</p>
            <TeacherNote>Buscar conceitos de George de Leon/Elena Gotti sobre hierarquia na CT.</TeacherNote>
          </div>
        </div>
      </Card>

      {/* Task 2 */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <UserPlus className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-bold text-slate-800 mb-2">2. Indicação de Padrinhos</h4>
            <p className="text-sm text-slate-600">O Conselheiro indica os Monitores e Padrinhos observando parâmetros pré-estabelecidos.</p>
            <TeacherNote>Desenvolver critérios de escolha (IA pode ajudar na estruturação desses critérios).</TeacherNote>
          </div>
        </div>
      </Card>

      {/* Task 3 */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <MessageSquare className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-bold text-slate-800 mb-2">3. Aconselhamento Individual</h4>
            <p className="text-sm text-slate-600">Mantém sessões regularmente com os Acolhidos. As técnicas serão abordadas adiante (págs 11 e 12).</p>
            <TeacherNote>Aqui pode entrar mais uma aula já pronta <strong>(Anexo 5)</strong>.</TeacherNote>
          </div>
        </div>
      </Card>

      {/* Task 4 */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <FileSignature className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-bold text-slate-800 mb-2">4. Construção do PAS</h4>
            <p className="text-sm text-slate-600">Participa ativamente na construção, acompanha execução e reavalia regularmente o Plano de Atendimento Singular.</p>
            <TeacherNote>A aula sobre PAS pode entrar aqui ao invés de ser no início.</TeacherNote>
          </div>
        </div>
      </Card>

      {/* Task 5 */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <FileText className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-bold text-slate-800 mb-2">5. Evolução de Prontuários</h4>
            <p className="text-sm text-slate-600">Atualiza os prontuários utilizando linguagem técnica, estritamente descritiva e adequada.</p>
            <TeacherNote>Montar apresentação sobre linguagem técnica/glossário (psicologia e serviço social).</TeacherNote>
          </div>
        </div>
      </Card>

      {/* Task 6, 7 & 8 */}
      <Card className="hover:shadow-md transition-shadow md:col-span-2 border-indigo-200">
        <div className="flex items-start gap-3">
          <HeartHandshake className="text-indigo-500 mt-1" />
          <div className="w-full">
            <h4 className="font-bold text-slate-800 mb-3">6 a 8. Dinâmica Multidisciplinar e Familiar</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><CheckCircle size={16} className="text-indigo-400 mt-0.5 shrink-0"/> Encaminha demandas à equipe Multidisciplinar.</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-indigo-400 mt-0.5 shrink-0"/> Atende, aconselha e notifica a família em casos de desvio no processo.</li>
              <li className="flex gap-2"><CheckCircle size={16} className="text-indigo-400 mt-0.5 shrink-0"/> Convoca pais/responsáveis para intervenções (sob supervisão).</li>
            </ul>
            <TeacherNote>Estes tópicos sobre família podem ser agrupados e acompanhados de material específico.</TeacherNote>
          </div>
        </div>
      </Card>

      {/* Task 9 */}
      <Card className="hover:shadow-md transition-shadow md:col-span-2 border-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-500 mt-1" />
          <div>
            <h4 className="font-bold text-slate-800 mb-2">9. Prevenção de Evasão / Alta Antecipada</h4>
            <p className="text-sm text-slate-600">O Conselheiro busca sanar ou reverter situações de pedido de alta antecipada.</p>
            <TeacherNote>Acompanha material sobre <strong>Estágios de Mudança</strong> e introdução à <strong>Entrevista Motivacional</strong>.</TeacherNote>
          </div>
        </div>
      </Card>

    </div>
  </div>
);


// --- COMPONENTE PRINCIPAL ---

export default function CeneTrailPage() {
  const [activeTab, setActiveTab] = useState('intro');

  const navItems = [
    { id: 'intro', label: 'Apresentação', icon: Play },
    { id: 'mod1', label: 'Módulo 1: Introdução', icon: Layout },
    { id: 'mod2', label: 'Módulo 2: O Manual', icon: BookOpen },
    { id: 'mod3', label: 'Módulo 3: Dia a Dia', icon: CheckCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'intro': return <IntroContent />;
      case 'mod1': return <Module1Content />;
      case 'mod2': return <Module2Content />;
      case 'mod3': return <Module3Content />;
      default: return <IntroContent />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 hidden md:flex shrink-0">
        <div className="p-6 bg-slate-950">
          <h1 className="text-xl font-bold text-white tracking-tight">CENE Educação</h1>
          <p className="text-xs text-blue-400 mt-1 uppercase font-semibold tracking-wider">Gestores & Coordenadores</p>
        </div>
        
        <div className="p-4 flex-1">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-4 px-2">Roteiro do Curso</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white font-medium shadow-md' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-200' : 'text-slate-400'} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
        
        <div className="p-4 bg-slate-800/50 text-xs text-slate-500 border-t border-slate-800">
          Rascunho de Produção v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-20 shadow-md">
          <h1 className="font-bold">CENE Educação</h1>
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded p-2 text-sm"
          >
            {navItems.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Estilos Globais para pequenas animações */}
      <style dangerouslySetInnerHTML={{__html: `
        .animation-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
