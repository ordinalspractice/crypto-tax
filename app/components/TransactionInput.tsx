import React, { useState } from "react";
import { Transaction } from "../types";

interface TransactionInputProps {
  onAddTransaction: (transaction: Transaction) => void;
}

export default function TransactionInput({
  onAddTransaction,
}: TransactionInputProps) {
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const commonCurrencies = ["EUR", "USD", "GBP", "CHF", "JPY", "CAD", "AUD"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!currency.trim()) {
      setError("Waluta jest wymagana");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Kwota musi być liczbą większą od zera");
      return;
    }

    // Validate date format (DD-MM-YYYY)
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(date)) {
      setError("Data musi być w formacie DD-MM-RRRR");
      return;
    }

    const transaction: Transaction = {
      currency: currency.toUpperCase(),
      amount: parsedAmount,
      data: date,
    };

    onAddTransaction(transaction);

    // Reset form
    setCurrency("");
    setAmount("");
    setDate("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-indigo-800">
        Dodaj transakcję
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Waluta</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {commonCurrencies.map((curr) => (
              <button
                key={curr}
                type="button"
                className={`px-3 py-1 rounded text-sm ${
                  currency === curr
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 transition-colors"
                }`}
                onClick={() => setCurrency(curr)}
              >
                {curr}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
            placeholder="EUR, USD, etc."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Kwota</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
            placeholder="0.00"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Data (DD-MM-RRRR)
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
            placeholder="np. 15-03-2023"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded font-medium transition-colors"
        >
          Dodaj transakcję
        </button>
      </form>
    </div>
  );
}
