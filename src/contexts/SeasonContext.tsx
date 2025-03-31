import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface SeasonContextType {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[]; // Keep available years consistent
}

const currentYear = new Date().getFullYear();
// Define available years centrally
const defaultAvailableYears = [currentYear, currentYear - 1, currentYear - 2]; // Example: current and previous 2 years

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export const SeasonProvider = ({ children }: { children: ReactNode }) => {
  const [selectedYear, setSelectedYear] = useState<number>(defaultAvailableYears[0]); // Default to the most recent year

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    selectedYear,
    setSelectedYear,
    availableYears: defaultAvailableYears
  }), [selectedYear]);

  return (
    <SeasonContext.Provider value={value}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = (): SeasonContextType => {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return context;
};
