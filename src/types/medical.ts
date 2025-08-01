/**
 * Medical data types for MedCanvas application
 */

export interface PatientData {
  age: number;
  sex: 'male' | 'female' | 'other';
  pregnancyStatus?: 'yes' | 'no' | 'possible';
  chiefComplaint: string;
  symptoms: string[];
  duration: string;
  severity: 1 | 2 | 3 | 4 | 5;
  medications: string[];
  allergies: string[];
}

export interface Prescription {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

export interface DiagnosisResult {
  probable_conditions: string[];
  recommended_tests: string[];
  rx: Prescription[];
  safety_flags: string;
  sources?: string[];
}

export interface TavilyResult {
  query: string;
  follow_up_questions: null;
  answer: string;
  images: string[];
  results: TavilySearchResult[];
  response_time: number;
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface QuestionnaireStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface FormState {
  currentStep: number;
  data: Partial<PatientData>;
  isSubmitting: boolean;
  result?: DiagnosisResult;
}