'use client';

import { useState, useEffect, useRef } from 'react';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useOfflineDownload } from '@/hooks/useOfflineDownload';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { toast } from 'sonner';
import { Download, Check, Wifi, WifiOff, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content_type: 'video' | 'text' | 'pdf' | 'quiz';
  content_html?: string;
  video_url?: string;
  pdf_file?: string;
  duration_minutes: number;
}

interface MobileLessonPlayerProps {
  lesson: Lesson;
  courseSlug: string;
  lessons: Lesson[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

export function MobileLessonPlayer({
  lesson,
  courseSlug,
  lessons,
  currentIndex,
  onNext,
  onPrev,
  onComplete,
}: MobileLessonPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { markComplete } = useLessonProgress({ courseSlug });
  const { download, downloaded, downloading, getOfflineMaterial } = useOfflineDownload(courseSlug);

  // Gestos de swipe para navegar entre aulas
  const swipeBind = useSwipeNavigation({
    onSwipeLeft: () => currentIndex < lessons.length - 1 && onNext(),
    onSwipeRight: () => currentIndex > 0 && onPrev(),
    threshold: 70,
  });

  // Auto-hide controls para vídeo imersivo
  useEffect(() => {
    if (lesson.content_type !== 'video') return;
    
    let timeout: NodeJS.Timeout;
    const hideControls = () => {
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    
    const showControlsTemp = () => {
      setShowControls(true);
      clearTimeout(timeout);
      hideControls();
    };

    videoRef.current?.addEventListener('mousemove', showControlsTemp);
    videoRef.current?.addEventListener('touchstart', showControlsTemp);
    
    hideControls();
    return () => {
      clearTimeout(timeout);
      videoRef.current?.removeEventListener('mousemove', showControlsTemp);
      videoRef.current?.removeEventListener('touchstart', showControlsTemp);
    };
  }, [lesson.content_type]);

  // Marcar como concluída ao finalizar vídeo
  const handleVideoEnd = async () => {
    if (!isCompleted) {
      await markComplete(lesson.id, lesson.duration_minutes * 60);
      setIsCompleted(true);
      toast.success('Aula concluída! 🎉');
      onComplete();
    }
  };

  // Download de PDF com fallback offline
  const handleDownloadPDF = async () => {
    if (!lesson.pdf_file) return;
    
    try {
      // Tenta carregar versão offline primeiro
      const offlineBlob = await getOfflineMaterial(lesson.id);
      if (offlineBlob) {
        toast.info('Abrindo versão offline do material 📄');
        const url = URL.createObjectURL(offlineBlob);
        window.open(url, '_blank');
        return;
      }
      
      // Se não tem offline, baixa agora
      await download({
        id: lesson.id,
        lessonId: lesson.id,
        courseSlug,
        title: lesson.title,
        url: lesson.pdf_file,
        type: 'pdf',
      });
    } catch {
      // Erro já tratado pelo hook
    }
  };

  // Renderiza conteúdo por tipo
  const renderContent = () => {
    switch (lesson.content_type) {
      case 'video':
        return (
          <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
            {lesson.video_url?.includes('youtube.com') || lesson.video_url?.includes('youtu.be') ? (
              <iframe 
                src={lesson.video_url.replace('watch?v=', 'embed/')} 
                className="w-full h-full" 
                allowFullScreen 
              />
            ) : (
              <video
                ref={videoRef}
                src={lesson.video_url}
                className="w-full h-full"
                controls
                playsInline
                onEnded={handleVideoEnd}
                onWaiting={() => toast.warning('Carregando vídeo... Conexão lenta detectada')}
              />
            )}
            {!showControls && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-white/70 text-sm">Toque para mostrar controles</p>
              </div>
            )}
          </div>
        );
      
      case 'pdf':
        return (
          <div className="bg-gray-50 p-6 rounded-[2rem] border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Material da Aula</h3>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading[lesson.id]}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  downloaded[lesson.id]
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-900 text-white hover:bg-emerald-600'
                }`}
              >
                {downloading[lesson.id] ? (
                  <span className="animate-pulse">⏳ Baixando</span>
                ) : downloaded[lesson.id] ? (
                  <>
                    <Check size={14} /> Offline
                  </>
                ) : (
                  <>
                    <Download size={14} /> Baixar PDF
                  </>
                )}
              </button>
            </div>
            
            {downloaded[lesson.id] ? (
              <button
                onClick={handleDownloadPDF}
                className="w-full py-12 border-2 border-dashed border-emerald-100 rounded-[1.5rem] text-emerald-600 font-bold hover:bg-emerald-50 transition"
              >
                📄 Abrir material offline
              </button>
            ) : (
              <div className="text-center py-12 bg-white rounded-[1.5rem] border border-slate-100">
                <p className="text-slate-500 font-medium mb-4">Baixe o material para ler sem internet</p>
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                  <PlayCircle size={24} />
                </div>
              </div>
            )}
          </div>
        );
      
      case 'text':
      default:
        return (
          <div 
            className="prose prose-sm max-w-none text-slate-600 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: lesson.content_html || '' }}
          />
        );
    }
  };

  return (
    <div 
      {...swipeBind()} 
      className="flex flex-col h-full bg-white relative"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Header com navegação */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full hover:bg-slate-50 disabled:opacity-30 transition-all"
          aria-label="Aula anterior"
        >
          <ChevronLeft className="text-slate-600" size={20} />
        </button>
        
        <div className="text-center flex-1 px-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">
            Aula {currentIndex + 1} de {lessons.length}
          </p>
          <p className="font-black text-slate-900 text-sm line-clamp-1 tracking-tight">
            {lesson.title}
          </p>
        </div>
        
        <button 
          onClick={onNext}
          disabled={currentIndex === lessons.length - 1}
          className="p-3 rounded-full hover:bg-slate-50 disabled:opacity-30 transition-all"
          aria-label="Próxima aula"
        >
          <ChevronRight className="text-slate-600" size={20} />
        </button>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto p-6 pb-32">
        {renderContent()}
      </main>

      {/* Footer com ações */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-100 px-6 py-4 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        {/* Botão de conclusão */}
        <button
          onClick={async () => {
            await markComplete(lesson.id, lesson.duration_minutes * 60);
            setIsCompleted(true);
            toast.success('Aula concluída! 🎉');
            onComplete();
          }}
          disabled={isCompleted}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-xl ${
            isCompleted
              ? 'bg-emerald-50 text-emerald-700 shadow-emerald-50 cursor-default'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-emerald-100'
          }`}
        >
          {isCompleted ? (
            <>
              <Check size={18} /> Concluída
            </>
          ) : (
            'Marcar como concluída'
          )}
        </button>

        {/* Navegação por swipe hint */}
        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          ← Deslize para navegar →
        </p>
      </footer>
    </div>
  );
}
