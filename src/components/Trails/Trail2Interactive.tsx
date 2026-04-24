"use client";

import { motion } from "framer-motion";
import { HeartHandshake, Crown, ShieldAlert, Frown } from "lucide-react";
import { MythCard } from "@/components/Cards/MythCard";

const mythsData = [
  { id: "popular", title: "O Popular", description: "O mito de que ser simpático trará aceitação.", truth: "Esconde um medo profundo de rejeição.", endGame: "Exaustão emocional.", icon: <HeartHandshake size={28} /> },
  { id: "tirano", title: "O Ditador", description: "O mito de ter o controle total sobre tudo.", truth: "Máscara para uma criança aterrorizada.", endGame: "Isolamento total.", icon: <Crown size={28} /> },
  { id: "conquistador", title: "O Conquistador", description: "O mito de ser irresistível e manipular.", truth: "Usa o outro apenas como espelho.", endGame: "Vazio profundo.", icon: <ShieldAlert size={28} /> },
  { id: "vitima", title: "O Auto piedoso", description: "O mito do 'pobre de mim'.", truth: "Foge da responsabilidade.", endGame: "Cansaço dos outros.", icon: <Frown size={28} /> }
];

export function Trail2Interactive({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-heading font-black text-white mb-4">Máscaras e Mitos</h2>
        <p className="text-gray-300">
          Explore as falsas personalidades que a Síndrome do Rei Bebê cria. Clique nos cards abaixo para revelar a verdade oculta por trás de cada mito.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {mythsData.map((myth, index) => (
          <MythCard key={myth.id} myth={myth} index={index} />
        ))}
      </div>

      <div className="flex justify-center mt-auto">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="bg-brand-cyan hover:bg-brand-cyan/80 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        >
          Concluir Estudo
        </motion.button>
      </div>
    </div>
  );
}
