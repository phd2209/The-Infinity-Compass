import { useState, useCallback, useMemo } from 'react';
import { calculateNumerologyData, type NumerologyData } from '@/utils/numerology';

export interface UseNumerologyReturn {
  numerologyData: NumerologyData | null;
  loading: boolean;
  error: string | null;
  calculateReading: (name: string, birthDate: Date) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for managing numerology calculations and state
 */
export const useNumerology = (): UseNumerologyReturn => {
  const [numerologyData, setNumerologyData] = useState<NumerologyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateReading = useCallback(async (name: string, birthDate: Date) => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!birthDate) {
      setError('Birth date is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate async operation if needed
      await new Promise(resolve => setTimeout(resolve, 100));

      const data = calculateNumerologyData(name.trim(), birthDate);
      setNumerologyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setNumerologyData(null);
    setError(null);
    setLoading(false);
  }, []);

  // Memoized return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    numerologyData,
    loading,
    error,
    calculateReading,
    reset
  }), [numerologyData, loading, error, calculateReading, reset]);

  return returnValue;
};