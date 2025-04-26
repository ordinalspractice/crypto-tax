import { NBPExchangeRateResponse } from '../types';

/**
 * Checks if a date is in the future
 * @param dateString Date in YYYY-MM-DD format
 * @returns Boolean indicating if the date is in the future
 */
function isFutureDate(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part
  const inputDate = new Date(dateString);
  return inputDate > today;
}

/**
 * Gets a valid past date for API requests
 * If the date is in the future, returns yesterday's date
 * @param formattedDate Date in YYYY-MM-DD format
 * @returns A valid date string in YYYY-MM-DD format
 */
function getValidDate(formattedDate: string): string {
  if (isFutureDate(formattedDate)) {
    // Use yesterday's date instead of a future date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }
  return formattedDate;
}

/**
 * Attempts to get an exchange rate by trying previous dates
 * @param currencyCode The currency code
 * @param dateString The original date in YYYY-MM-DD format
 * @param maxAttempts Maximum number of previous days to try
 * @returns The exchange rate or null if not found
 */
async function getClosestPreviousRate(
  currencyCode: string, 
  dateString: string,
  maxAttempts: number = 5
): Promise<number | null> {
  const originalDate = new Date(dateString);
  
  for (let i = 1; i <= maxAttempts; i++) {
    // Try a day before
    const prevDate = new Date(originalDate);
    prevDate.setDate(prevDate.getDate() - i);
    const prevDateString = prevDate.toISOString().split('T')[0];
    
    const url = `https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/${prevDateString}/?format=json`;
    
    try {
      const response = await fetch(url);
      
      if (response.ok) {
        const data: NBPExchangeRateResponse = await response.json();
        console.log(`Found rate for ${currencyCode} from ${prevDateString} (${i} day(s) before requested date)`);
        return data.rates[0].mid;
      }
    } catch {
      // Continue to try the next date
    }
  }
  
  // If we couldn't find a rate in the previous days, use the latest available
  console.log(`Could not find a rate for ${currencyCode} within ${maxAttempts} days before ${dateString}. Using latest available.`);
  return await getLatestExchangeRate(currencyCode);
}

/**
 * Fetches the exchange rate for a specific currency on a given date
 * @param currency The currency code (e.g., 'EUR', 'USD')
 * @param date Date in DD-MM-YYYY format
 * @returns The exchange rate or null if not found
 */
export async function getExchangeRate(currency: string, date: string): Promise<number | null> {
  try {
    // Format date from DD-MM-YYYY to YYYY-MM-DD for the API
    const [day, month, year] = date.split('-');
    let formattedDate = `${year}-${month}-${day}`;
    
    // NBP API requires uppercase currency codes
    const currencyCode = currency.toUpperCase();
    
    // For PLN, the exchange rate is always 1
    if (currencyCode === 'PLN') {
      return 1;
    }
    
    // Use a valid date for API requests
    formattedDate = getValidDate(formattedDate);
    
    if (formattedDate !== `${year}-${month}-${day}`) {
      console.log(`Date ${year}-${month}-${day} appears to be in the future. Using ${formattedDate} instead.`);
    }
    
    // NBP API endpoint for a specific date
    const url = `https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/${formattedDate}/?format=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`Could not get rate for ${currencyCode} on ${formattedDate}. Using nearest available rate.`);
      // If the exact date is not available, try to get the closest available date
      return await getClosestPreviousRate(currencyCode, formattedDate);
    }
    
    const data: NBPExchangeRateResponse = await response.json();
    return data.rates[0].mid;
  } catch (error) {
    console.error(`Error fetching exchange rate: ${error}`);
    return null;
  }
}

/**
 * Gets the latest available exchange rate for a currency
 * @param currencyCode The currency code
 * @returns The exchange rate or null if not found
 */
async function getLatestExchangeRate(currencyCode: string): Promise<number | null> {
  try {
    // Try to get the last available rates
    const url = `https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/last/1/?format=json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate for ${currencyCode}`);
    }
    
    const data: NBPExchangeRateResponse = await response.json();
    
    const effectiveDate = data.rates[0].effectiveDate;
    console.log(`Using latest rate for ${currencyCode}: ${data.rates[0].mid} from ${effectiveDate}`);
    
    return data.rates[0].mid;
  } catch (error) {
    console.error(`Error fetching latest exchange rate: ${error}`);
    return null;
  }
} 