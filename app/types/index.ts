export interface Transaction {
  currency: string;
  amount: number;
  data: string; // In DD-MM-YYYY format
}

export interface ProcessedTransaction extends Transaction {
  exchangeRate: number;
  amountPLN: number;
}

export interface TaxCalculation {
  totalAmountPLN: number;
  taxAmount: number;
  taxRate: number;
  transactions: ProcessedTransaction[];
}

export interface NBPExchangeRateResponse {
  table: string;
  currency: string;
  code: string;
  rates: {
    no: string;
    effectiveDate: string;
    mid: number;
  }[];
} 