export type Theme = 'light' | 'dark';

export interface HealthMetric {
  date: string;
  value: number;
  category: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  condition: string;
  symptoms: string[];
  medications: string[];
  notes: string;
}

export interface DrugRecommendation {
  name: string;
  effectivenessScore: number;
  description: string;
  sideEffects: string[];
  alternatives: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}