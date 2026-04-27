"use client";

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Users, 
  HeartHandshake, 
  Award, 
  MonitorPlay, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/cene-logo.jpeg" alt="CENE Logo" className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <h1 className="font-bold text-xl leading-tight text-emerald-900">CENE</h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Especialização e Desenvolvimento</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#pilares" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition">Nossas Áreas</a>
            <a href="#sobre" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition">Quem Somos</a>
            <Link href="/login" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
              Acessar Plataforma
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Nova Plataforma EAD CENE
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Especialize-se com os <span className="text-emerald-600">maiores especialistas</span> do Brasil, de onde você estiver.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Cursos online com certificação reconhecida em Dependência Química, População em Situação de Rua e Gerontologia. Capacitação atualizada com profissionais de Notório Saber.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login" className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-xl shadow-emerald-200">
              Conhecer Cursos Online <ChevronRight size={20} />
            </Link>
            <button className="flex items-center justify-center gap-2 bg-white text-emerald-700 border-2 border-emerald-100 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition">
              Falar com Consultor
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-200 rounded-3xl transform rotate-3 scale-105"></div>
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Estudante EAD" 
            className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Certificação</p>
              <p className="font-bold text-slate-800">Reconhecida</p>
            </div>
          </div>
        </div>
      </section>

      {/* CHANCELAS / SOCIAL PROOF */}
      <section className="bg-white border-y border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">Cursos chancelados por instituições de excelência</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition duration-500">
            <div className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Award className="text-emerald-600" /> UPPSI
            </div>
            <div className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Award className="text-emerald-600" /> FEBRACT
            </div>
            <div className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Award className="text-emerald-600" /> UNISAL
            </div>
            <div className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Award className="text-emerald-600" /> INESP
            </div>
          </div>
        </div>
      </section>

      {/* PILARES DE ATUAÇÃO */}
      <section id="pilares" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Nossos Pilares</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Escolha sua área de especialização</h2>
            <p className="text-slate-600 text-lg">Conteúdo técnico e didático desenvolvido por especialistas reconhecidos em cada área para transformar sua atuação profissional.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition">
                <HeartHandshake size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Dependência Química</h4>
              <p className="text-slate-600 mb-6 line-clamp-3">
                Tratamento e Prevenção. Capacitações em Boas Práticas, Intervenções Familiares e formação para Monitores e Coordenadores de Comunidades Terapêuticas.
              </p>
              <Link href="/login" className="text-emerald-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver cursos <ChevronRight size={18} />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                <Users size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">População em Situação de Rua</h4>
              <p className="text-slate-600 mb-6 line-clamp-3">
                Da População Invisível às Políticas de Visibilidade. Preparação completa para equipes de Abordagem Social e políticas públicas (PSR).
              </p>
              <Link href="/login" className="text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver cursos <ChevronRight size={18} />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 group">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition">
                <GraduationCap size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Gerontologia</h4>
              <p className="text-slate-600 mb-6 line-clamp-3">
                Cursos focados no desenvolvimento humano e cuidado com a população idosa. Técnicas e metodologias atuais aplicadas à psicologia e psiquiatria geriátrica.
              </p>
              <Link href="/login" className="text-purple-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Ver cursos <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS DA PLATAFORMA */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Por que escolher o EAD do CENE?</h2>
              <p className="text-white text-lg mb-8 leading-relaxed">
                Desde 2018, já realizamos mais de 15 eventos presenciais de grande porte. Agora, levamos toda essa expertise para o ambiente digital, permitindo que você estude no seu ritmo.
              </p>
              <ul className="space-y-4">
                {[
                  "Aulas 100% online na melhor plataforma EAD",
                  "Conteúdo com profissionais renomados (UPPSI, FEBRACT)",
                  "Certificados válidos em todo o território nacional",
                  "Acesso a materiais complementares e comunidade de alunos"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-emerald-50">
                    <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={24} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-800/50 p-6 rounded-2xl text-center border border-emerald-700">
                <MonitorPlay className="w-10 h-10 mx-auto text-emerald-400 mb-4" />
                <h4 className="text-3xl font-bold text-white mb-1">100%</h4>
                <p className="text-emerald-100 text-sm">Online e Flexível</p>
              </div>
              <div className="bg-emerald-800/50 p-6 rounded-2xl text-center border border-emerald-700">
                <Users className="w-10 h-10 mx-auto text-emerald-400 mb-4" />
                <h4 className="text-3xl font-bold text-white mb-1">+15</h4>
                <p className="text-emerald-100 text-sm">Grandes Eventos Realizados</p>
              </div>
              <div className="bg-emerald-800/50 p-6 rounded-2xl text-center border border-emerald-700 col-span-2">
                 <p className="text-white italic mb-4 font-medium">"Profissionais renomadas, experientes e de universidades de primeira linha reuniram-se para formar nosso corpo docente."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIRETORIA / QUEM SOMOS */}
      <section id="sobre" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2 relative">
             <div className="aspect-[4/5] bg-slate-200 rounded-3xl overflow-hidden relative shadow-2xl">
                <img 
                  src="/matheus.jpeg" 
                  alt="Matheus Leite Praça" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-xl">Matheus Leite Praça</p>
                  <p className="text-sm text-emerald-300">Diretor Executivo</p>
                </div>
             </div>
          </div>
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Coordenação Especializada</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Conheça o Diretor Executivo</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              O CENE é guiado por uma liderança com ampla experiência teórica e prática no acolhimento e tratamento humano.
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700"><strong>Psicólogo</strong> e Especialista em dependência química (UNIAD/UNIFESP).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">Membro do Conselho Deliberativo e <strong>Docente da FEBRACT</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">Conselheiro em Tóxico Dependência FLACT | CICAD | OEA - Nível Avançado.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">Gestor Técnico das Comunidades Terapêutica Nova Esperança (SJC-SP).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-emerald-50 py-20 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Pronto para dar o próximo passo na sua carreira?</h2>
          <p className="text-lg text-slate-600 mb-10">Acesse nossa plataforma agora, confira a grade curricular completa dos cursos e garanta sua vaga nas próximas turmas online.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-xl shadow-emerald-200">
              Criar Conta Gratuita
            </Link>
            <button className="bg-white text-emerald-700 border-2 border-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition flex items-center justify-center gap-2">
              <Phone size={20}/> (12) 99261-9587
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="/cene-logo.jpeg" alt="CENE Logo" className="w-8 h-8 rounded object-cover" />
              <h2 className="font-bold text-xl text-white">CENE</h2>
            </div>
            <p className="text-sm mb-6">Especialização e Desenvolvimento Humano. Capacitando profissionais desde 2018 para transformar vidas.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Contato</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 hover:text-emerald-400 transition cursor-pointer">
                <Phone size={18} /> (12) 99261-9587
              </li>
              <li className="flex items-center gap-3 hover:text-emerald-400 transition cursor-pointer">
                <Mail size={18} /> cene.cursos@gmail.com
              </li>
              <li className="flex items-center gap-3 hover:text-emerald-400 transition cursor-pointer">
                <MonitorPlay size={18} /> www.cenecursos.com.br
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Endereço Sede</h4>
            <div className="flex items-start gap-3 text-sm">
              <MapPin size={18} className="flex-shrink-0 mt-1" />
              <p>
                Av. Manuel Borba Gato, 986<br/>
                Jardim Esplanada<br/>
                São José dos Campos - SP
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          <p>© {new Date().getFullYear()} CENE - Especialização e Desenvolvimento Humano. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
