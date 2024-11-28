import { useState } from 'react';
import { EzeeAPI } from '../services/EzeeAPI';
import { MappedRoom } from '../types/room';

export function useEzeeAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const api = new EzeeAPI();

  const getAvailabilityAndRates = async (fromDate: string, toDate: string): Promise<MappedRoom[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const rooms = await api.getRoomInventoryWithDetails(fromDate, toDate);
      setLoading(false);
      return rooms;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setLoading(false);
      throw err;
    }
  };

  return {
    getAvailabilityAndRates,
    loading,
    error
  };
} 