'use client';

import dynamic from 'next/dynamic';
import { useProgressStore } from '@/store/useProgressStore';

const CaminhosGame = dynamic(
  () => import('@/components/features/interactive/CaminhosGame/CaminhosGame').then(mod => mod.CaminhosGame),
  { ssr: false, loading: () => (
    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin" />
      <p className="text-brand-cyan font-bold animate-pulse">Inicializando Simulador de Resiliência...</p>
    </div>
  )}
);
import { useRouter } from 'next/navigation';

interface InventoryItem {
  icon: string;
  name: string;
  desc: string;
}

interface GameStats {
  resilience: number;
  social: number;
  achievements: InventoryItem[];
}

export default function CaminhosGamePage() {
  const setCaminhosStats = useProgressStore((s) => s.setCaminhosStats);
  const router = useRouter();

  const handleComplete = (stats: GameStats) => {
    setCaminhosStats({
      resilience: stats.resilience,
      social: stats.social,
      achievements: stats.achievements
    });
    // Opcional: Redirecionar de volta para o dashboard ou trilha após alguns segundos
    setTimeout(() => {
      router.push('/dashboard');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
      
      <div className="z-10 w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-accent tracking-tight">
            Caminhos da Superação
          </h1>
          <p className="text-zinc-400 mt-2">
            Simulador de resiliência e reconexão social.
          </p>
        </div>

        <CaminhosGame onComplete={handleComplete} />
      </div>
    </div>
  );
}
