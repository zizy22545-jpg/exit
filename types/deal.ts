export type RiskLevel = 'low' | 'medium' | 'high';
export type YesNo = 'yes' | 'no';

export interface DealData {
  destinationCountry: string;
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
  intermediaryBank: boolean;
  intermediaryBankName: string;
  transit: YesNo;
  transitCountry: string;
  endUserKnown: YesNo;
  endUser: string;
  civilianUse: 'yes' | 'no' | 'unsure';
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

export interface AnalysisResult {
  id: string;
  date: string;
  totalScore: number;
  level: RiskLevel;
  categories: RiskCategory[];
  findings: Finding[];
  documents: string[];
  recommendations: string[];
  regulations: string[];
}
