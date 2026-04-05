import React, { createContext, useContext, useState, useCallback } from "react";

const THRESHOLD_USD = 150;

const CURRENCY_RATES: Record<string, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1, symbol: "$", name: "US Dollar" },
  BDT: { rate: 122.43, symbol: "৳", name: "Bangladeshi Taka" },
  EUR: { rate: 0.92, symbol: "€", name: "Euro" },
  GBP: { rate: 0.79, symbol: "£", name: "British Pound" },
  INR: { rate: 83.5, symbol: "₹", name: "Indian Rupee" },
};

interface CasinoContextType {
  balance: number;
  currency: string;
  currencySymbol: string;
  currencies: typeof CURRENCY_RATES;
  setCurrency: (c: string) => void;
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => void;
  resolveOutcome: () => boolean; // true = win
  threshold: number;
  isAboveThreshold: boolean;
  formatBalance: (amount: number) => string;
}

const CasinoContext = createContext<CasinoContextType | null>(null);

export const useCasino = () => {
  const ctx = useContext(CasinoContext);
  if (!ctx) throw new Error("useCasino must be inside CasinoProvider");
  return ctx;
};

export const CasinoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(1000); // starting balance in current currency
  const [currency, setCurrencyState] = useState("USD");

  const rate = CURRENCY_RATES[currency]?.rate ?? 1;
  const threshold = THRESHOLD_USD * rate;
  const isAboveThreshold = balance >= threshold;

  const setCurrency = (c: string) => {
    const oldRate = CURRENCY_RATES[currency]?.rate ?? 1;
    const newRate = CURRENCY_RATES[c]?.rate ?? 1;
    setBalance((prev) => Math.round((prev / oldRate) * newRate * 100) / 100);
    setCurrencyState(c);
  };

  const addBalance = useCallback((amount: number) => {
    setBalance((prev) => Math.round((prev + amount) * 100) / 100);
  }, []);

  const subtractBalance = useCallback((amount: number) => {
    setBalance((prev) => Math.round((prev - amount) * 100) / 100);
  }, []);

  const resolveOutcome = useCallback((): boolean => {
    if (isAboveThreshold) return false; // always lose
    return Math.random() < 0.5; // 50/50
  }, [isAboveThreshold]);

  const formatBalance = (amount: number) => {
    const sym = CURRENCY_RATES[currency]?.symbol ?? "$";
    return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CasinoContext.Provider
      value={{
        balance,
        currency,
        currencySymbol: CURRENCY_RATES[currency]?.symbol ?? "$",
        currencies: CURRENCY_RATES,
        setCurrency,
        addBalance,
        subtractBalance,
        resolveOutcome,
        threshold,
        isAboveThreshold,
        formatBalance,
      }}
    >
      {children}
    </CasinoContext.Provider>
  );
};
