"use client";

import React, { useState } from "react";
import TransactionInput from "./components/TransactionInput";
import BulkTransactionInput from "./components/BulkTransactionInput";
import TransactionList from "./components/TransactionList";
import { Transaction, TaxCalculation } from "./types";
import { calculateTax } from "./utils/taxCalculator";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const handleAddTransactions = (newTransactions: Transaction[]) => {
    setTransactions((prev) => [...prev, ...newTransactions]);
  };

  const handleCalculateTax = async () => {
    if (transactions.length === 0) {
      setError("Dodaj przynajmniej jedną transakcję");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await calculateTax(transactions);

      if (!result) {
        throw new Error("Nie udało się obliczyć podatku");
      }

      setTaxCalculation(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Wystąpił błąd podczas obliczania podatku"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setTransactions([]);
    setTaxCalculation(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">
            Kalkulator podatku od transakcji walutowych
          </h1>
          <p className="mt-2 text-gray-600">
            Oblicz podatek 19% od transakcji w walutach obcych na podstawie
            kursów NBP
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    activeTab === "single"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("single")}
                >
                  Pojedyncza transakcja
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium transition-colors ${
                    activeTab === "bulk"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("bulk")}
                >
                  Wiele transakcji
                </button>
              </div>

              {activeTab === "single" ? (
                <TransactionInput onAddTransaction={handleAddTransaction} />
              ) : (
                <BulkTransactionInput
                  onAddTransactions={handleAddTransactions}
                />
              )}
            </div>

            {transactions.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-indigo-800">
                  Transakcje ({transactions.length})
                </h2>
                <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded">
                  <ul className="divide-y divide-gray-200">
                    {transactions.map((t, index) => (
                      <li
                        key={index}
                        className="py-2 px-3 flex justify-between hover:bg-gray-50"
                      >
                        <span className="font-medium">
                          {t.amount.toFixed(2)} {t.currency}
                        </span>
                        <span className="text-gray-500">{t.data}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={handleCalculateTax}
                    disabled={isLoading}
                  >
                    {isLoading ? "Obliczanie..." : "Oblicz podatek"}
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-medium transition-colors"
                    onClick={handleClearAll}
                  >
                    Wyczyść
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <TransactionList
              taxCalculation={taxCalculation}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-12">
          <p>
            Dane kursów walut pobierane z oficjalnego API Narodowego Banku
            Polskiego.
          </p>
          <p className="mt-1">
            Aplikacja służy jedynie do celów informacyjnych i nie stanowi porady
            podatkowej.
          </p>
        </footer>
      </div>
    </main>
  );
}
