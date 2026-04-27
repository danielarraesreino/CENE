// Tipos compartilhados para os módulos clínicos
// Centralizar as interfaces aqui evita dependências circulares (Circular Dependencies) no Turbopack.

export interface Goal {
  id: string;
  title: string;
  category: string;
  status: string;
  current_value: number;
  target_value: number;
  unit: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood_score?: number;
  entry_type: "reflection" | "prompt";
  date: string;
}

export interface RPDData {
  situacao: string;
  pensamento_automatico: string;
  emocoes_iniciais: { emocao: string; intensidade: number }[];
  distorcoes_cognitivas: string[];
  resposta_alternativa: string;
  emocoes_finais: { emocao: string; intensidade: number }[];
  grau_crenca_inicial: number;
  grau_crenca_final: number;
}
