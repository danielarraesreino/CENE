'use client';

import { useQuery } from '@tanstack/react-query';
import { courseKeys } from '@/lib/api/keys';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ClinicalLayout } from '@/components/layout/ClinicalLayout';
import { ClinicalHeader } from '@/components/clinical/ui/ClinicalHeader';
import { ClinicalCard } from '@/components/clinical/ui/ClinicalCard';
import { 
  PlayCircle, 
  FileText, 
  ChevronRight, 
  BookOpen, 
  Loader2,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Clock,
  Lock,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { ApiError } from '@/lib/api/ApiError';
import { MobileLessonPlayer } from '@/components/courses/MobileLessonPlayer';
import { LessonStatusBadge } from '@/components/courses/LessonStatusBadge';

interface CourseData {
  title: string;
  description: string;
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      content_type: string;
      video_url?: string;
      content_html?: string;
      pdf_file?: string;
      duration_minutes: number;
    }[];
  }[];
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const { markComplete, syncQueue, getLessonStatus, pendingCount } = useLessonProgress({
    courseSlug: params.slug,
    autoSync: true,
    onSyncSuccess: () => toast.success('Progresso sincronizado! 🎉'),
    onSyncError: (error: ApiError) => {
      if (error.isRetryable) {
        toast.warning('Conexão instável. Seu progresso será salvo ao reconectar.');
      }
    },
  });

  // Timer para tracking de tempo gasto na aula
  useEffect(() => {
    if (!activeLesson) return;
    const timer = setInterval(() => setTimeSpent(s => s + 1), 1000);
    return () => {
      clearInterval(timer);
      setTimeSpent(0); // Reseta ao trocar de aula
    };
  }, [activeLesson]);

  // Botão de marcar como concluída
  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    
    try {
      await markComplete(activeLesson.id, timeSpent);
      toast.success('Aula concluída!');
    } catch (error) {
      console.error('[MARK_COMPLETE_ERROR]', error);
    }
  };
  
  const { data, isLoading, error } = useQuery<CourseData>({
    queryKey: courseKeys.detail(params.slug),
    queryFn: async () => {
      const res = await fetch(`/api/content/courses/${params.slug}/`);
      if (!res.ok) throw new Error('Curso não encontrado');
      return res.json();
    },
  });

  // Handle errors separately for TanStack Query v5 compatibility
  useEffect(() => {
    if (error) {
      toast.error('Não foi possível carregar este curso.');
    }
  }, [error]);

  // Linearize lessons for next/prev navigation
  const allLessons = data?.modules?.flatMap((m: any) => m.lessons) || [];
  const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson?.id);

  const handleNext = () => {
    const nextLesson = allLessons.slice(currentIndex + 1).find((l: any) => l.is_unlocked);
    if (nextLesson) setActiveLesson(nextLesson);
    else toast.info('Você chegou ao fim das aulas disponíveis no momento.');
  };

  const handlePrev = () => {
    const prevLessons = allLessons.slice(0, currentIndex).reverse();
    const prevUnlocked = prevLessons.find((l: any) => l.is_unlocked);
    if (prevUnlocked) setActiveLesson(prevUnlocked);
  };

  // Responsive Detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <ClinicalLayout containerClassName="flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </ClinicalLayout>
    );
  }

  if (error || !data) {
    return (
      <ClinicalLayout>
        <div className="p-20 text-center">
          <h1 className="text-2xl font-black text-red-500">Curso indisponível</h1>
          <Link href="/cursos" className="text-slate-400 hover:text-emerald-600 mt-4 inline-block font-bold">
            ← Voltar para lista
          </Link>
        </div>
      </ClinicalLayout>
    );
  }

  if (isMobile && activeLesson) {
    return (
      <div className="fixed inset-0 z-[100] bg-white overflow-hidden">
        <MobileLessonPlayer
          lesson={activeLesson as any}
          courseSlug={params.slug}
          lessons={allLessons as any}
          currentIndex={currentIndex}
          onNext={handleNext}
          onPrev={handlePrev}
          onComplete={handleMarkComplete}
        />
      </div>
    );
  }

  return (
    <ClinicalLayout containerClassName="max-w-7xl pt-8">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/cursos" className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-black text-xs uppercase tracking-widest transition-all">
          <ArrowLeft size={16} />
          Voltar aos Cursos
        </Link>
      </div>

      <ClinicalHeader 
        title={data.title}
        subtitle={activeLesson ? `Aula: ${activeLesson.title}` : data.description}
        icon={<BookOpen size={20} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Main Player Area */}
        <div className="space-y-8">
          <ClinicalCard className="bg-white min-h-[500px] overflow-hidden p-0 border-slate-100">
            {!activeLesson ? (
              <div className="h-[500px] flex flex-col items-center justify-center text-center p-20">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                  <PlayCircle size={64} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">Pronto para começar?</h2>
                <p className="text-slate-500 font-medium max-w-sm">
                  Selecione um módulo e uma aula na barra lateral para iniciar seu aprendizado.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {activeLesson.content_type === 'video' && activeLesson.video_url && (
                  <div className="aspect-video bg-black">
                    <iframe 
                      src={activeLesson.video_url.replace('watch?v=', 'embed/')} 
                      className="w-full h-full" 
                      allowFullScreen 
                    />
                  </div>
                )}
                
                <div className="p-10 prose prose-slate max-w-none">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {activeLesson.content_type}
                    </span>
                    <span className="text-slate-300 font-bold">•</span>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      {activeLesson.duration_minutes} min
                    </span>
                  </div>

                  <h2 className="text-3xl font-black text-slate-900 mb-6 !mt-0">
                    {activeLesson.title}
                  </h2>

                  {activeLesson.content_html && (
                    <div 
                      className="text-slate-600 leading-relaxed text-lg font-medium"
                      dangerouslySetInnerHTML={{ __html: activeLesson.content_html }} 
                    />
                  )}

                  {activeLesson.content_type === 'pdf' && activeLesson.pdf_file && (
                    <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">Material de Apoio (PDF)</p>
                          <p className="text-xs text-slate-500 font-medium">Download disponível para estudo offline</p>
                        </div>
                      </div>
                      <a 
                        href={activeLesson.pdf_file} 
                        target="_blank" 
                        className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Download
                      </a>
                    </div>
                  )}

                  {/* Mark as Completed Button */}
                  <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                      <Clock size={18} />
                      Tempo nesta aula: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                    </div>
                    <button 
                      onClick={handleMarkComplete}
                      className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 transition-all active:scale-95"
                    >
                      <CheckCircle2 size={20} />
                      Marcar como Concluída
                    </button>
                  </div>
                </div>
              </div>
            )}
          </ClinicalCard>
        </div>

        {/* Sidebar Content Tree */}
        <aside className="space-y-6">
          {pendingCount > 0 && (
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2.5rem] flex flex-col gap-4">
              <div className="flex items-center gap-3 text-amber-800">
                <RefreshCw size={20} className="animate-spin" />
                <span className="font-black text-[10px] uppercase tracking-widest">
                  {pendingCount} Pendente{pendingCount > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-amber-700/70 text-xs font-medium leading-relaxed">
                Você concluiu aulas offline. Sincronizaremos automaticamente quando sua conexão retornar.
              </p>
              <button 
                onClick={() => syncQueue()}
                className="bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Tentar Sincronizar Agora
              </button>
            </div>
          )}

          <ClinicalCard variant="glass" className="p-8 border-white/50 sticky top-32">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <BookOpen size={20} className="text-emerald-600" />
                Conteúdo
              </h3>
              <Link 
                href={`/instrutor/cursos/${params.slug}/analytics`}
                className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all group"
                title="Ver Analytics"
              >
                <TrendingUp size={18} className="group-hover:scale-110 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-300px)] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              {data.modules?.map((mod: any) => (
                <div key={mod.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {mod.title}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {mod.lessons?.map((lesson: any) => {
                      const isActive = activeLesson?.id === lesson.id;
                      const isUnlocked = lesson.is_unlocked;
                      const isCompleted = lesson.is_completed;
                      
                      return (
                        <li key={lesson.id}>
                          <button 
                            onClick={() => {
                              if (!isUnlocked) {
                                toast.error('Esta aula está bloqueada. Complete os pré-requisitos primeiro.');
                                return;
                              }
                              setActiveLesson(lesson);
                            }} 
                            className={`w-full text-left p-4 rounded-2xl text-sm transition-all flex items-center justify-between group ${
                              isActive 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 translate-x-1' 
                                : isUnlocked
                                  ? 'bg-white/50 hover:bg-white text-slate-600 border border-transparent hover:border-emerald-100 hover:translate-x-1'
                                  : 'bg-slate-50 text-slate-400 cursor-not-allowed grayscale'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {lesson.content_type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                              <div className="flex flex-col">
                                <span className="font-bold truncate">{lesson.title}</span>
                                <LessonStatusBadge 
                                  isUnlocked={isUnlocked} 
                                  isCompleted={isCompleted} 
                                  nextAvailableAt={lesson.release_date}
                                />
                              </div>
                            </div>
                            {!isUnlocked ? (
                              <Lock size={16} className="text-slate-300 shrink-0" />
                            ) : isActive ? (
                              <CheckCircle2 size={16} className="shrink-0" />
                            ) : (
                              <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-600 shrink-0" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </ClinicalCard>
        </aside>
      </div>
    </ClinicalLayout>
  );
}
