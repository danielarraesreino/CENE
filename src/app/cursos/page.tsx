'use client';

import { useQuery } from '@tanstack/react-query';
import { courseKeys } from '@/lib/api/keys';
import { toast } from 'sonner';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useSession } from 'next-auth/react';
import { ClinicalLayout } from '@/components/layout/ClinicalLayout';
import { ClinicalHeader } from '@/components/clinical/ui/ClinicalHeader';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function CoursesPage() {
  const { data: session } = useSession();
  const enabled = isFeatureEnabled('LMS_EAD_ACCESS', { userId: session?.user?.id });
  
  const { data, isLoading, error } = useQuery({
    queryKey: courseKeys.list({}),
    queryFn: async () => {
      const res = await fetch('/api/content/courses/');
      if (!res.ok) throw new Error('Falha ao carregar cursos');
      return res.json();
    },
    enabled: !!enabled && !!session?.accessToken,
  });

  if (!enabled) {
    return (
      <ClinicalLayout>
        <div className="p-20 text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
            <BookOpen size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Acesso Restrito</h1>
          <p className="text-slate-500 max-w-sm font-medium">
            🔒 O acesso ao EAD está sendo liberado gradualmente. Fique atento às notificações no seu portal.
          </p>
        </div>
      </ClinicalLayout>
    );
  }

  return (
    <ClinicalLayout containerClassName="max-w-7xl">
      <ClinicalHeader 
        title="Meus Cursos"
        subtitle="Expanda seu conhecimento com nossa trilha de especialização Reibb."
        icon={<GraduationCap size={20} />}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-[3rem] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-20 text-center text-red-500 font-bold bg-red-50 rounded-[3rem] border border-red-100">
          Erro ao carregar cursos. Verifique sua conexão.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.results?.map((course: any) => (
            <Link key={course.id} href={`/cursos/${course.slug}`} className="group block h-full">
              <div className="bg-white rounded-[3rem] p-4 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 h-full flex flex-col overflow-hidden">
                {course.cover_image ? (
                  <img src={course.cover_image} alt={course.title} className="w-full h-56 object-cover rounded-[2.5rem]" />
                ) : (
                  <div className="w-full h-56 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                    <BookOpen size={64} />
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors leading-tight">
                    {course.title}
                  </h2>
                  <p className="text-slate-500 text-base line-clamp-3 mb-8 font-medium">
                    {course.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {course.modules_count} {course.modules_count === 1 ? 'Módulo' : 'Módulos'}
                    </span>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </ClinicalLayout>
  );
}

import { ChevronRight } from 'lucide-react';
