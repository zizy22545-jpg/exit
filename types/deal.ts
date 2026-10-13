export type RiskLevel = 'low' | 'medium' | 'high';
export type YesNo = 'yes' | 'no';
export type DealDirection = 'export' | 'import';
export type RequirementStatus = 'confirmed' | 'potential' | 'additional-review';

export interface DealData {
  direction: DealDirection;
  partnerCountry: string;
  originCountry: string;
  counterpartyCountry: string;
  counterpartyName: string;
  registrationNumber: string;
  counterpartyChecked: boolean;
  productCategory: string;
  productName: string;
  hsCode: string;
  value: string;
  currency: string;
  paymentMethod: string;
  paymentCurrency: string;
  payerBank: string;
  recipientBank: string;
  incoterms: string;
  intermediaryBank: boolean;
  intermediaryBankName: string;
  transit: YesNo;
  transitCountry: string;
  endUserKnown: YesNo;
  endUser: string;
  civilianUse: 'yes' | 'no' | 'unsure';
  additionalInfo: string;
}

export interface RiskCategory {
  key: string;
  label: string;
  score: number;
  level: RiskLevel;
  icon: string;
  note: string;
}

export interface Finding {
  status: 'warning' | 'success' | 'critical';
  title: string;
  description: string;
  recommendation: string;
}

export interface RequirementItem {
  id: string;
  area: string;
  status: RequirementStatus;
  requirement: string;
  action: string;
  documents: string[];
  authority?: string;
}

export interface LegalSource {
  title: string;
  url: string;
  note: string;
}

export interface AnalysisResult {
  id: string;
  date: string;
  totalScore: number;
  level: RiskLevel;
  categories: RiskCategory[];
  findings: Finding[];
  requirements: RequirementItem[];
  documents: string[];
  recommendations: string[];
  legalSources: LegalSource[];
}

/** Boundary for the future Google Sheets legal-rules adapter. */
export interface DealAnalyzer {
  analyze(deal: DealData): AnalysisResult | Promise<AnalysisResult>;
}
