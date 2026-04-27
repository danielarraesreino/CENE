"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useErrorStore } from "@/store/useErrorStore";

export function GlobalErrorToast() {
  const { isError, errorMessage, clearError } = useErrorStore();

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isError, clearError]);

  return (
    <AnimatePresence>
      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(220,38,38,0.4)] min-w-[300px] max-w-md"
        >
          <AlertCircle size={24} className="shrink-0" />
          <p className="flex-1 text-sm font-medium leading-tight">
            {errorMessage}
          </p>
          <button
            onClick={clearError}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
