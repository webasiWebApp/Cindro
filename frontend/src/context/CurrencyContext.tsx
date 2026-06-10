"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { formatMoney } from "@/utils/currencyFormatter";

export type Currency = "GBP" | "AED";
export type CurrencyFormat = "SYMBOL" | "CODE";

interface CurrencyContextType {
  currency: Currency;
  format: CurrencyFormat;
  setCurrency: (c: Currency) => void;
  setFormat: (f: CurrencyFormat) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("GBP");
  const [format, setFormatState] = useState<CurrencyFormat>("SYMBOL");

  useEffect(() => {
    // Read from localStorage on mount
    const savedCurrency = localStorage.getItem("cindro_currency") as Currency;
    const savedFormat = localStorage.getItem("cindro_currency_format") as CurrencyFormat;
    
    if (savedCurrency) setCurrencyState(savedCurrency);
    if (savedFormat) setFormatState(savedFormat);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("cindro_currency", c);
  };

  const setFormat = (f: CurrencyFormat) => {
    setFormatState(f);
    localStorage.setItem("cindro_currency_format", f);
  };

  const formatAmount = (amount: number) => {
    return formatMoney(amount, currency, format);
  };

  return (
    <CurrencyContext.Provider value={{ currency, format, setCurrency, setFormat, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
