import { Lock, CheckCircle, Clock } from 'lucide-react';

interface LessonStatusBadgeProps {
  isUnlocked: boolean;
  isCompleted: boolean;
  nextAvailableAt?: string;
  message?: string;
}

export function LessonStatusBadge({ isUnlocked, isCompleted, nextAvailableAt, message }: LessonStatusBadgeProps) {
  if (isCompleted) {
    return (
      <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
        <CheckCircle className="w-3 h-3" /> Concluída
      </span>
    );
  }
  
  if (!isUnlocked) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
        <Lock className="w-3 h-3" />
        <span className="truncate">{message || 'Bloqueada'}</span>
      </div>
    );
  }

  if (nextAvailableAt) {
    return (
      <span className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg">
        <Clock className="w-3 h-3" /> {new Date(nextAvailableAt).toLocaleDateString()}
      </span>
    );
  }

  return null;
}
