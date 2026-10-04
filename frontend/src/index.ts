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
  entitiesRecognized?: string[];
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