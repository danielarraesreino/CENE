"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  Users, 
  Trophy,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ href, icon, label, active }: SidebarItemProps) {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group",
        active 
          ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20 shadow-lg shadow-brand-accent/5" 
          : "text-slate-500 hover:bg-white/5 hover:text-white"
      )}>
        <div className={cn(
          "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
          active ? "text-brand-accent" : "text-slate-600"
        )}>
          {icon}
        </div>
        <span className="font-bold text-sm uppercase tracking-widest">{label}</span>
        {active && (
          <motion.div 
            layoutId="sidebar-active"
            className="ml-auto w-1.5 h-6 bg-brand-accent rounded-full"
          />
        )}
      </div>
    </Link>
  );
}

export function EducationalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/escola/aluno", icon: <LayoutDashboard size={20} />, label: "Painel" },
    { href: "/cursos", icon: <BookOpen size={20} />, label: "Cursos" },
    { href: "/caminhos-game", icon: <Gamepad2 size={20} />, label: "Simulador" },
    { href: "/comunidade", icon: <Users size={20} />, label: "Comunidade" },
    { href: "/certificados", icon: <Trophy size={20} />, label: "Conquistas" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col border-r border-slate-900 bg-slate-950/50 backdrop-blur-xl p-8 z-50">
        <div className="flex items-center gap-4 mb-16 px-4">
          <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-black shadow-lg shadow-brand-accent/20">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter">Portal <span className="text-brand-accent">CENE</span></h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">EdTech Hub</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <SidebarItem href="/profile" icon={<Settings size={20} />} label="Configurações" active={pathname === "/profile"} />
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />
        {children}
      </main>
    </div>
  );
}
