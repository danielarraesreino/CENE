"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckInStore } from "@/store/useCheckInStore";

const areasConfig = [
  { id: "fisica",       label: "Física",       icon: "💪", color: "#f43f5e", desc: "Saúde corporal, nutrição, sono e vitalidade." },
  { id: "espiritual",   label: "Espiritual",   icon: "✨", color: "#f59e0b", desc: "Propósito, valores, sentido da vida e conexão." },
  { id: "intelectual",  label: "Intelectual",  icon: "📚", color: "#8b5cf6", desc: "Aprendizagem, leitura e desenvolvimento cognitivo." },
  { id: "familiar",     label: "Familiar",     icon: "👨‍👩‍👧", color: "#06b6d4", desc: "Vínculos afetivos, perdão e papéis familiares." },
  { id: "social",       label: "Social",       icon: "🤝", color: "#10b981", desc: "Rede de apoio, amizades e convivência social." },
  { id: "financeira",   label: "Financeira",   icon: "💰", color: "#fbbf24", desc: "Gestão, independência e responsabilidade financeira." },
  { id: "profissional", label: "Profissional", icon: "🎯", color: "#ec4899", desc: "Carreira, talentos e contribuição para a sociedade." },
] as const;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

/**
 * SevenAreasWheel — portado do matheusweb.
 * Agora utiliza o `useCheckInStore` para pegar os valores reais (progress).
 */
export default function SevenAreasWheel() {
  const [selected, setSelected] = useState<string | null>(null);
  const currentAreas = useCheckInStore((s) => s.currentAreas);
  const updateAreas = useCheckInStore((s) => s.updateAreas);
  
  const cx = 200;
  const cy = 200;
  const outerR = 160;
  const innerR = 60;
  const sliceAngle = 360 / 7;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
      {/* SVG Wheel */}
      <div className="relative">
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          aria-label="Roda das 7 Áreas da Saúde"
          className="max-w-full overflow-visible"
        >
          {areasConfig.map((area, index) => {
            const angle = index * sliceAngle;
            const startAngle = angle;
            const endAngle = angle + sliceAngle - 2;
            const midAngle = angle + sliceAngle / 2;
            const isSelected = selected === area.id;

            return (
              <g key={area.id}>
                {/* Slice */}
                <motion.path
                  d={`${describeArc(cx, cy, innerR, startAngle, endAngle)} L ${polarToCartesian(cx, cy, outerR, endAngle).x} ${polarToCartesian(cx, cy, outerR, endAngle).y} ${describeArc(cx, cy, outerR, endAngle, startAngle).replace("M", "A").replace(/^.*?A/, "A")} Z`}
                  fill={area.color}
                  fillOpacity={isSelected ? 0.85 : 0.35}
                  stroke={area.color}
                  strokeWidth={isSelected ? 2 : 0.5}
                  strokeOpacity={0.6}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.04, originX: cx / 400, originY: cy / 400 }}
                  onClick={() => setSelected(selected === area.id ? null : area.id)}
                  aria-label={area.label}
                />
                {/* Icon */}
                <text
                  x={polarToCartesian(cx, cy, (innerR + outerR) / 2, midAngle).x}
                  y={polarToCartesian(cx, cy, (innerR + outerR) / 2, midAngle).y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="18"
                  className="pointer-events-none select-none"
                >
                  {area.icon}
                </text>
              </g>
            );
          })}
          {/* Center circle */}
          <circle cx={cx} cy={cy} r={innerR - 4} fill="white" stroke="rgba(0,0,0,0.05)" />
          <text x={cx} y={cy - 10} textAnchor="middle" fill="#64748b" fontSize="10" className="font-sans">
            Projeto
          </text>
          <text x={cx} y={cy + 6} textAnchor="middle" fill="#059669" fontSize="13" fontWeight="700" className="font-heading">
            de Vida
          </text>
        </svg>
      </div>

      {/* Area cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {areasConfig.map((area) => {
          const isSelected = selected === area.id;
          const progress = currentAreas[area.id as keyof typeof currentAreas];

          return (
            <motion.div
              key={area.id}
              className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all ${
                isSelected ? "shadow-lg bg-white" : "bg-slate-50/50"
              }`}
              style={{ border: isSelected ? `1px solid ${area.color}` : "1px solid rgba(0,0,0,0.05)" }}
              whileHover={{ y: -3 }}
              onClick={() => setSelected(selected === area.id ? null : area.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{area.icon}</span>
                <span className="font-bold text-slate-900">{area.label}</span>
              </div>

              {/* Controles de progresso iterativos */}
              {isSelected ? (
                <div className="mb-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => updateAreas({ [area.id]: parseInt(e.target.value) })}
                    className="w-full accent-brand-cyan"
                    style={{ accentColor: area.color }}
                  />
                </div>
              ) : (
                <div className="h-1.5 bg-slate-200 rounded-full mb-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: area.color }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500">Autoavaliação</span>
                <span className="text-sm font-bold" style={{ color: area.color }}>
                  {progress}%
                </span>
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-slate-500 text-xs leading-relaxed mt-3 pt-3 border-t border-slate-100"
                  >
                    {area.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
