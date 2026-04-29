/**
 * Tipos compartilhados para o ecossistema clínico Reibb.
 */

export interface ClinicalBaseItem {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodLog extends ClinicalBaseItem {
  mood_score: number;
  notes?: string;
}

export interface Goal extends ClinicalBaseItem {
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  dueDate?: string;
}

export interface Trigger extends ClinicalBaseItem {
  description: string;
  intensity: number;
  strategy?: string;
}

export interface SafetyPlan extends ClinicalBaseItem {
  warning_signs: string[];
  coping_strategies: string[];
  support_network: string[];
  professional_help: string[];
  reasons_to_live: string[];
  safe_places?: string[];
}

export interface RPDRecord extends ClinicalBaseItem {
  situation: string;
  automatic_thoughts: string;
  emotions: string;
  rational_response: string;
  outcome: string;
}

export interface JournalEntry extends ClinicalBaseItem {
  title?: string;
  content: string;
  mood?: number;
}
