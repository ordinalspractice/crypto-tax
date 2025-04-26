import { Transaction, ProcessedTransaction, TaxCalculation } from '../types';
import { getExchangeRate } from '../services/nbpService';

const TAX_RATE = 0.19; // 19% tax rate

/**
 * Processes a list of transactions, converting amounts to PLN and calculating tax
 * @param transactions List of transactions to process
 * @returns Object with tax calculation details or null if processing failed
 */
export async function calculateTax(transactions: Transaction[]): Promise<TaxCalculation | null> {
  try {
    const processedTransactions: ProcessedTransaction[] = [];
    
    // Process each transaction
    for (const transaction of transactions) {
      const exchangeRate = await getExchangeRate(transaction.currency, transaction.data);
      
      if (exchangeRate === null) {
        throw new Error(`Could not get exchange rate for ${transaction.currency} on ${transaction.data}`);
      }
      
      const amountPLN = transaction.amount * exchangeRate;
      
      processedTransactions.push({
        ...transaction,
        exchangeRate,
        amountPLN
      });
    }
    
    // Calculate total amount in PLN
    const totalAmountPLN = processedTransactions.reduce(
      (sum, transaction) => sum + transaction.amountPLN, 
      0
    );
    
    // Calculate tax amount
    const taxAmount = totalAmountPLN * TAX_RATE;
    
    return {
      totalAmountPLN,
      taxAmount,
      taxRate: TAX_RATE,
      transactions: processedTransactions
    };
  } catch (error) {
    console.error('Error calculating tax:', error);
    return null;
  }
} 