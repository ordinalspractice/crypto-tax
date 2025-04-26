import React, { useState } from "react";
import { Transaction } from "../types";

interface BulkTransactionInputProps {
  onAddTransactions: (transactions: Transaction[]) => void;
}

export default function BulkTransactionInput({
  onAddTransactions,
}: BulkTransactionInputProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Próbujemy naprawić format JSON, dodając cudzysłowy do kluczów
      let fixedInput = jsonInput.replace(/([{,]\s*)(\w+):/g, '$1"$2":');

      // Próbujemy naprawić wartości tekstowe, które nie mają cudzysłowów
      fixedInput = fixedInput.replace(/'([^']+)'/g, '"$1"');

      // Parse JSON input
      const parsedTransactions = JSON.parse(fixedInput);

      // Validate that it's an array
      if (!Array.isArray(parsedTransactions)) {
        setError("Dane muszą być tablicą transakcji");
        return;
      }

      // Validate each transaction
      const validatedTransactions: Transaction[] = [];

      for (let i = 0; i < parsedTransactions.length; i++) {
        const transaction = parsedTransactions[i];

        // Check if transaction has required fields
        if (!transaction.currency || !transaction.amount || !transaction.data) {
          setError(
            `Transakcja #${
              i + 1
            } nie zawiera wszystkich wymaganych pól (currency, amount, data)`
          );
          return;
        }

        // Validate amount
        if (typeof transaction.amount !== "number" || transaction.amount <= 0) {
          setError(`Transakcja #${i + 1} ma nieprawidłową kwotę`);
          return;
        }

        // Validate date format (DD-MM-YYYY)
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
        if (
          typeof transaction.data !== "string" ||
          !dateRegex.test(transaction.data)
        ) {
          setError(
            `Transakcja #${
              i + 1
            } ma nieprawidłowy format daty (wymagany DD-MM-RRRR)`
          );
          return;
        }

        validatedTransactions.push({
          currency: transaction.currency.toUpperCase(),
          amount: transaction.amount,
          data: transaction.data,
        });
      }

      if (validatedTransactions.length === 0) {
        setError("Brak transakcji do dodania");
        return;
      }

      onAddTransactions(validatedTransactions);
      setJsonInput("");
    } catch (error) {
      setError("Nieprawidłowy format danych. Sprawdź składnię JSON.");
      console.error("Błąd parsowania JSON:", error);
    }
  };

  const exampleJson = `[
{currency: 'USD', amount: 2160.72, data: '04-03-2023'},
{currency: 'USD', amount: 9332.46, data: '13-04-2023'},
{currency: 'USD', amount: 5324.17, data: '12-05-2023'}]`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-indigo-800">
        Dodaj wiele transakcji
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Wklej listę transakcji
            <button
              type="button"
              className="ml-2 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 py-0.5 rounded-full"
              onClick={() => {
                navigator.clipboard.writeText(exampleJson);
              }}
            >
              Kopiuj przykład
            </button>
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
            rows={10}
            placeholder={exampleJson}
          />
          <p className="text-xs text-gray-500 mt-1">
            Możesz wkleić dane w formacie jak w przykładzie powyżej
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded font-medium transition-colors"
        >
          Dodaj transakcje
        </button>
      </form>
    </div>
  );
}
