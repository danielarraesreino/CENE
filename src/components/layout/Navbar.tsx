"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { 
  ChevronDown,
  GraduationCap,
  ShieldCheck,
  Brain,
  Activity,
  Target,
  Calendar,
  ShieldAlert,
  BookHeart,
  Home,
  LayoutDashboard,
  PieChart,
  UserIcon,
  LogOut,
  X,
  Menu
} from "lucide-react";

import ThemeToggle from "@/components/ui/ThemeToggle";

const clinicalTools = [
  { name: "Registro (RPD)", path: "/portal/paciente/clinical/rpd", icon: Brain },
  { name: "Humor", path: "/portal/paciente/clinical/mood", icon: Activity },
  { name: "Metas", path: "/portal/paciente/clinical/goals", icon: Target },
  { name: "Gatilhos", path: "/portal/paciente/clinical/triggers", icon: Calendar },
  { name: "Segurança", path: "/portal/paciente/clinical/safety-plan", icon: ShieldAlert },
  { name: "Diário", path: "/portal/paciente/clinical/journal", icon: BookHeart },
];

const mainNavItems = [
  { name: "Início", path: "/", icon: Home },
  { name: "Hub", path: "/hub", icon: LayoutDashboard },
  { name: "Escola", path: "/escola/aluno", icon: GraduationCap },
  { name: "Progresso", path: "/progresso", icon: PieChart },
];

const instructorNavItems = [
  { name: "Estúdio CMS", path: "/instrutor/cms", icon: BookHeart },
  { name: "Minha Equipe", path: "/instrutor/users", icon: UserIcon },
  { name: "Pacientes", path: "/instrutor/pacientes", icon: GraduationCap },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  }

  if (pathname === "/" || pathname === "/login" || pathname === "/register") return null;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 py-4 ${
        isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/cene-logo.jpeg" alt="CENE Logo" className="w-10 h-10 rounded-lg object-cover shadow-[0_0_15px_rgba(5,150,105,0.2)] group-hover:scale-105 transition-transform" />
          <div className="hidden sm:block">
            <span className="text-emerald-900 dark:text-emerald-400 font-heading font-black text-xl tracking-tight leading-none block">
              CENE
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
              Especialização e Desenvolvimento
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-white/70 dark:bg-slate-800/70 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md shadow-sm">
          {/* Main Items Before Dropdown */}
          {mainNavItems.slice(0, 2).map((item) => (
            <NavItem key={item.path} item={item} isActive={pathname === item.path} />
          ))}

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                pathname.startsWith("/portal/paciente/clinical") ? "text-emerald-900 dark:text-emerald-100" : "text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400"
              }`}
            >
              {pathname.startsWith("/portal/paciente/clinical") && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-full"
                />
              )}
              <Activity size={16} className={`relative z-10 ${pathname.startsWith("/portal/paciente/clinical") ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
              <span className="relative z-10">Ferramentas</span>
              <ChevronDown size={14} className={`relative z-10 transition-transform ${toolsDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {toolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 rounded-3xl p-3 shadow-2xl overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-1">
                    <Link href="/portal/paciente/clinical" className="p-3 mb-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Ver Todas</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Hub Central de Ferramentas</span>
                    </Link>
                    {clinicalTools.map((tool) => (
                      <Link 
                        key={tool.path}
                        href={tool.path}
                        className="flex items-center gap-3 p-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                      >
                        <tool.icon size={18} className="text-emerald-500" />
                        <span className="text-sm font-bold">{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Items After Dropdown */}
          {mainNavItems.slice(2).map((item) => (
            <NavItem key={item.path} item={item} isActive={pathname === item.path} />
          ))}

          {/* Instructor Items */}
          {(session?.user as any)?.role === 'admin' || (session?.user as any)?.role === 'supervisor' ? (
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 ml-2 pl-2">
              {instructorNavItems.map((item) => (
                <NavItem key={item.path} item={item} isActive={pathname === item.path} />
              ))}
            </div>
          ) : null}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* SOS Button - Desktop */}
          <Link href="/portal/paciente/sos" className="hidden lg:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2 rounded-full border border-red-500/20 transition-all font-black text-xs uppercase tracking-widest animate-pulse hover:animate-none"
            >
              <ShieldAlert size={16} />
              S.O.S
            </motion.button>
          </Link>

          {/* Switch Mode Button for Admin/Supervisor */}
          {((session?.user as any)?.role === 'admin' || (session?.user as any)?.role === 'supervisor') && (
            <Link href={pathname.startsWith('/instrutor') ? '/portal/paciente' : '/instrutor'} className="hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-full shadow-lg shadow-emerald-200 transition-all font-black text-xs uppercase tracking-widest"
              >
                {pathname.startsWith('/instrutor') ? (
                  <>
                    <LayoutDashboard size={16} />
                    Visão de Aluno
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Modo Gestor
                  </>
                )}
              </motion.button>
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{session.user?.name}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">Online</span>
              </div>
              <Link href="/profile">
                <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                  <UserIcon size={20} />
                </button>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)]">
                Entrar
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 rounded-full shadow-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 top-[72px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl z-[90] p-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-8">
              {/* Main Nav */}
              <div className="grid grid-cols-1 gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-4">Navegação</span>
                {mainNavItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex items-center gap-4 p-4 rounded-3xl ${
                      pathname === item.path ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800" : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-bold text-lg">{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Instructor Nav (Mobile) */}
              {((session?.user as any)?.role === 'admin' || (session?.user as any)?.role === 'supervisor') && (
                <div className="grid grid-cols-1 gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-2 ml-4">Gestão & Estúdio</span>
                  {instructorNavItems.map((item) => (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      className={`flex items-center gap-4 p-4 rounded-3xl ${
                        pathname === item.path ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800" : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-bold text-lg">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Clinical Tools */}
              <div className="grid grid-cols-1 gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-4">Ferramentas Clínicas</span>
                <div className="grid grid-cols-2 gap-2">
                  {clinicalTools.map((tool) => (
                    <Link 
                      key={tool.path}
                      href={tool.path}
                      className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl aspect-square ${
                        pathname === tool.path ? "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800" : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800"
                      }`}
                    >
                      <tool.icon size={24} className="text-emerald-500" />
                      <span className="font-bold text-xs text-center">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

function NavItem({ item, isActive }: { item: NavigationItem, isActive: boolean }) {
  return (
    <Link 
      href={item.path}
      className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
        isActive ? "text-emerald-900" : "text-slate-500 hover:text-emerald-700"
      }`}
    >
      {isActive && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-emerald-100 border border-emerald-200 rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <item.icon size={16} className={isActive ? "text-emerald-600 z-10" : "z-10"} />
      <span className="z-10">{item.name}</span>
    </Link>
  );
}
