"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { QuizContent } from "@/types/trail-content";

export function QuizRenderer({
  data,
  onComplete,
}: {
  data: QuizContent;
  onComplete: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = data.questions[current];
  const passing = data.passingScore ?? 70;
  const passed = (score / data.questions.length) * 100 >= passing;

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === question.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= data.questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center border border-slate-200"
      >
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
            passed ? "bg-emerald-100" : "bg-red-50"
          }`}
        >
          {passed ? (
            <CheckCircle2 size={56} className="text-emerald-600" />
          ) : (
            <XCircle size={56} className="text-red-500" />
          )}
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">
          {passed ? "Aprovado! 🎉" : "Tente novamente"}
        </h2>
        <p className="text-slate-500 mb-3 text-lg">
          Você acertou {score} de {data.questions.length} questões.
        </p>
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-10 ${
            passed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {passed
            ? `${Math.round((score / data.questions.length) * 100)}% de acerto — aprovado!`
            : `${Math.round((score / data.questions.length) * 100)}% de acerto — mínimo: ${passing}%`}
        </div>

        {passed ? (
          <button
            onClick={onComplete}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-14 py-4 rounded-full font-black text-lg shadow-[0_8px_30px_rgba(5,150,105,0.3)] transition-all active:scale-95"
          >
            Concluir Avaliação ✅
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrent(0);
              setSelected(null);
              setScore(0);
              setFinished(false);
            }}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-4 rounded-full font-bold transition-all"
          >
            <RotateCcw size={18} />
            Refazer Quiz
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center py-6">
      {/* Progresso */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between text-xs text-slate-500 font-medium mb-2">
          <span>
            Questão {current + 1} de {data.questions.length}
          </span>
          <span>{score} corretas</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(current / data.questions.length) * 100}%` }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="glass-panel rounded-3xl p-8 w-full max-w-2xl border border-slate-200"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
            {question.text}
          </h3>

          <div className="flex flex-col gap-3">
            {question.options.map((opt, i) => {
              const isCorrect = i === question.correctIndex;
              const isSelected = selected === i;
              const showResult = selected !== null;

              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={selected !== null}
                  className={`w-full text-left p-4 rounded-2xl border transition-all font-medium text-sm ${
                    !showResult
                      ? "border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700"
                      : isCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : isSelected
                      ? "border-red-400 bg-red-50 text-red-700"
                      : "border-slate-100 bg-slate-50 text-slate-400"
                  }`}
                >
                  <span className="font-black mr-3 text-slate-400">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                  {showResult && isCorrect && (
                    <CheckCircle2
                      size={16}
                      className="inline ml-2 text-emerald-600"
                    />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle size={16} className="inline ml-2 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {question.explanation && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-4">
                  <p className="text-emerald-800 text-sm leading-relaxed">
                    💡 {question.explanation}
                  </p>
                </div>
              )}
              <button
                onClick={next}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-bold transition-all"
              >
                {current + 1 >= data.questions.length
                  ? "Ver Resultado"
                  : "Próxima Questão"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
