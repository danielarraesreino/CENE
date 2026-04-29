'use client';

import { CaminhosGame } from '@/components/features/interactive/CaminhosGame/CaminhosGame';
import { useProgressStore } from '@/store/useProgressStore';
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
