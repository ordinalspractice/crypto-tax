import React from "react";
import { ProcessedTransaction, TaxCalculation } from "../types";

interface TransactionListProps {
  taxCalculation: TaxCalculation | null;
  isLoading: boolean;
  error: string | null;
}

export default function TransactionList({
  taxCalculation,
  isLoading,
  error,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="ml-3 text-gray-700">Pobieranie kursów walut...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!taxCalculation || taxCalculation.transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center py-8">
          Brak transakcji do wyświetlenia
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount);
  };

  // Sprawdzamy czy są daty z przyszłości
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const hasFutureDates = taxCalculation.transactions.some((transaction) => {
    const [day, month, year] = transaction.data.split("-");
    const transactionDate = new Date(`${year}-${month}-${day}`);
    return transactionDate > currentDate;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-indigo-800">
        Podsumowanie transakcji
      </h2>

      {hasFutureDates && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 text-sm">
          <p>
            <strong>Uwaga:</strong> Niektóre transakcje mają daty z przyszłości.
          </p>
          <p>Dla tych transakcji użyto aktualnych kursów walut z NBP.</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-indigo-50 text-indigo-800">
              <th className="py-2 px-4 text-left font-medium">Waluta</th>
              <th className="py-2 px-4 text-left font-medium">Kwota</th>
              <th className="py-2 px-4 text-left font-medium">Data</th>
              <th className="py-2 px-4 text-left font-medium">Kurs</th>
              <th className="py-2 px-4 text-left font-medium">Wartość PLN</th>
            </tr>
          </thead>
          <tbody>
            {taxCalculation.transactions.map(
              (transaction: ProcessedTransaction, index: number) => {
                // Sprawdzamy czy data jest z przyszłości
                const [day, month, year] = transaction.data.split("-");
                const transactionDate = new Date(`${year}-${month}-${day}`);
                const isFuture = transactionDate > currentDate;

                return (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-2 px-4 font-medium">
                      {transaction.currency}
                    </td>
                    <td className="py-2 px-4">
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td
                      className={`py-2 px-4 ${
                        isFuture ? "text-yellow-600" : ""
                      }`}
                    >
                      {transaction.data}
                      {isFuture && <span className="ml-1 text-xs">⚠️</span>}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {transaction.exchangeRate.toFixed(4)}
                    </td>
                    <td className="py-2 px-4 font-medium">
                      {transaction.amountPLN.toFixed(2)} PLN
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center py-2">
          <span className="font-medium text-gray-700">Suma w PLN:</span>
          <span className="font-medium">
            {formatCurrency(taxCalculation.totalAmountPLN)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="font-medium text-gray-700">Stawka podatku:</span>
          <span className="font-medium">
            {(taxCalculation.taxRate * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex justify-between items-center py-3 mt-2 bg-indigo-50 px-4 rounded-lg">
          <span className="font-bold text-indigo-900">Podatek do zapłaty:</span>
          <span className="font-bold text-indigo-900 text-xl">
            {formatCurrency(taxCalculation.taxAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
