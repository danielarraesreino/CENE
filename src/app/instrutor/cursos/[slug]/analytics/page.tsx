'use client';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { Users, Clock, TrendingUp, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  course: string; 
  slug: string; 
  total_students: number;
  completion_rate: number; 
  avg_time_minutes: number;
  recent_logins: number; 
  drop_off_points: Array<{ lesson__title: string; count: number }>;
  generated_at: string;
}

export default function AnalyticsPage({ params }: { params: { slug: string } }) {
  // Nota: Idealmente usaríamos useSession aqui se estivéssemos usando next-auth
  // Para este exemplo, assumimos que as feature flags lidam com o rollout
  const enabled = isFeatureEnabled('INSTRUCTOR_ANALYTICS');

  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['course-analytics', params.slug],
    queryFn: async () => {
      const res = await fetch(`/api/instructor/courses/${params.slug}/analytics/`);
      if (!res.ok) throw new Error('Falha ao carregar analytics');
      return res.json();
    },
    enabled: !!enabled && !!params.slug,
    staleTime: 1000 * 60 * 10,
  });

  if (!enabled) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">🔒</div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analytics em rollout gradual.</p>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState />;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-100 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Link 
                href={`/cursos/${params.slug}`} 
                className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors text-xs font-black uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Voltar ao Curso
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                Engajamento: <span className="text-emerald-600">{data.course}</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Atualizado {new Date(data.generated_at).toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard icon={<Users />} label="Alunos Ativos" value={data.total_students} color="text-blue-600" bg="bg-blue-50" />
          <MetricCard icon={<TrendingUp />} label="Taxa de Conclusão" value={`${data.completion_rate}%`} color="text-emerald-600" bg="bg-emerald-50" trend={data.completion_rate > 50 ? 'up' : 'neutral'} />
          <MetricCard icon={<Clock />} label="Tempo Médio/Aula" value={`${data.avg_time_minutes} min`} color="text-amber-600" bg="bg-amber-50" />
          <MetricCard icon={<AlertTriangle />} label="Atividade (7d)" value={data.recent_logins} color="text-purple-600" bg="bg-purple-50" />
        </div>

        <section className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Pontos de Abandono (Top 5)</h2>
          {data.drop_off_points.length === 0 ? (
            <p className="text-slate-400 text-sm font-medium py-10">Nenhum ponto crítico detectado. Excelente retenção! 🎉</p>
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.drop_off_points} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                  <XAxis dataKey="lesson__title" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} interval={0} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-0">
                            <p className="font-bold">{payload[0].value} alunos pararam aqui</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {data.drop_off_points.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({ icon, label, value, trend, color, bg }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex items-start gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
      <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
        {trend === 'up' && <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1 block">↑ Alta</span>}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 p-8 space-y-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-12 w-96 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-white rounded-[2.5rem] border border-slate-100" />)}
        </div>
        <div className="h-96 bg-white rounded-[3rem] border border-slate-100" />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-center">
      <div className="space-y-6">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Erro ao carregar métricas</h2>
        <p className="text-slate-500 font-medium">Verifique sua conexão ou permissões.</p>
        <Link href="/cursos" className="inline-flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>
    </div>
  );
}
