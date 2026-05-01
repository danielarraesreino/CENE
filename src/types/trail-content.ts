/**
 * Portal Renascer — Trail Content Schema
 * Engine data-driven para 200+ trilhas.
 * Cada trilha tem um "type" que determina qual Renderer usar,
 * e um "data" com o conteúdo específico.
 */

// ─── Tipos de Renderer ──────────────────────────────────────────────────────

export type TrailType =
  | 'narrative'     // História em estágios (ex: Gênese do Rei Bebê)
  | 'myth_reveal'   // Cards de mitos clicáveis (ex: Máscaras e Mitos)
  | 'resistance'    // Mecânica de quebrar resistência (ex: Rendição)
  | 'quiz'          // Perguntas de validação
  | 'video'         // Player de áudio/vídeo com reflexão
  | 'breathing'     // Guia de respiração Box Breathing
  | 'reflection'    // Pergunta aberta para reflexão escrita
  | 'interactive';  // Componente interativo avançado (delegado por ID de trilha)

// ─── Schema de Conteúdo por Tipo ────────────────────────────────────────────

export interface NarrativeStage {
  id: string;
  title: string;
  description: string;
  iconName?: string; // nome do ícone Lucide (ex: "Baby", "Zap")
  accentColor?: string; // ex: "brand-cyan", "brand-accent"
}

export interface NarrativeContent {
  stages: NarrativeStage[];
}

// ─────────────────────────────────────────────

export interface MythItem {
  id: string;
  title: string;
  description: string;
  truth: string;
  endGame: string;
  iconName?: string;
}

export interface MythRevealContent {
  myths: MythItem[];
  revealAll?: boolean; // se true, todos devem ser revelados para completar
}

// ─────────────────────────────────────────────

export interface ResistancePhase {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
}

export interface ResistanceContent {
  phases: ResistancePhase[];
  wallLabel?: string;        // ex: "Orgulho do Rei Bebê"
  wallHitSteps?: number;     // quantos cliques para quebrar (default: 4)
}

// ─────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string; // feedback após resposta
}

export interface QuizContent {
  questions: QuizQuestion[];
  passingScore?: number; // % mínimo para passar (default: 60)
}

// ─────────────────────────────────────────────

export interface VideoContent {
  audioUrl: string;        // URL do .mp3 ou .wav
  videoUrl?: string;       // URL do vídeo (opcional)
  label?: string;          // ex: "A_GENESE_DO_REI_BEBE.MP3"
  reflectionPrompt?: string; // pergunta após ouvir
}

// ─────────────────────────────────────────────

export interface ReflectionContent {
  prompt: string;          // ex: "O que você sente quando pensa em pedir ajuda?"
  minWords?: number;       // mínimo de palavras para liberar (default: 10)
}

// ─────────────────────────────────────────────

export interface BreathingContent {
  technique?: '4-7-8' | 'box' | '4-4-4'; // default: box (4-4-4-4)
  rounds?: number;
  message?: string; // mensagem motivacional exibida durante
}

// ─── Union Type Central ─────────────────────────────────────────────────────

export type TrailContentData =
  | NarrativeContent
  | MythRevealContent
  | ResistanceContent
  | QuizContent
  | VideoContent
  | ReflectionContent
  | BreathingContent;

// ─── Config completa de uma Trilha ──────────────────────────────────────────

export interface TrailConfig {
  id: number;
  title: string;
  category: string;   // ex: "Fundamentos", "Emoções", "Família", "Recaída"
  order: number;
  isPremium?: boolean;
  intro?: string;     // Breve introdução ou descrição da trilha
  audioUrl?: string;  // URL do áudio para a etapa "Ouvir"
  type: TrailType;
  content: TrailContentData;
  /** Quiz dedicado para a aba "Avaliar" — independente do conteúdo principal */
  quizContent?: QuizContent;
}

// ─── Type Guards ─────────────────────────────────────────────────────────────

export const isNarrative    = (d: TrailContentData): d is NarrativeContent   => 'stages'     in d;
export const isMythReveal   = (d: TrailContentData): d is MythRevealContent   => 'myths'      in d;
export const isResistance   = (d: TrailContentData): d is ResistanceContent   => 'phases'     in d;
export const isQuiz         = (d: TrailContentData): d is QuizContent         => 'questions'  in d;
export const isVideo        = (d: TrailContentData): d is VideoContent        => 'audioUrl'   in d;
export const isReflection   = (d: TrailContentData): d is ReflectionContent   => 'prompt'     in d;
export const isBreathing    = (d: TrailContentData): d is BreathingContent    => !('stages' in d) && !('myths' in d) && !('phases' in d) && !('questions' in d) && !('audioUrl' in d) && !('prompt' in d);
