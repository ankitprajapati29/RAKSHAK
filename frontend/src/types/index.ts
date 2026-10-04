export interface AnalysisInput {
  text: string;
  inputType: 'text' | 'voice' | 'image';
  language: 'en' | 'hi';
  timestamp: number;
}

export interface DetectedRedFlag {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: {
    en: string;
    hi: string;
  };
  evidence: string;
}

export interface RecognizedEntity {
  id: string
  name: string
  category: 'regulator' | 'exchange' | 'platform' | 'financial-institution'
  description: {
    en: string
    hi: string
  }
}

export interface AnalysisResult {
  riskIndicator: 'low-concern' | 'suspicious' | 'high-risk-indicators';
  redFlags: DetectedRedFlag[];
  explanation: {
    en: string;
    hi: string;
  };
  safeNextSteps: {
    en: string[];
    hi: string[];
  };
  entitiesRecognized?: RecognizedEntity[];
  urlWarnings?: string[];
}

export interface AppError {
  code: string;
  message: {
    en: string;
    hi: string;
  };
  details?: string;
}

export type Language = 'en' | 'hi';
