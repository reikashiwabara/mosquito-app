import { useState, useEffect } from 'react';
import type { UserRanking } from '../types';

export const useRanking = () => {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Docker環境ではサーバーコンテナに直接アクセス
      const response = await fetch('http://localhost:3001/api/ranking');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRanking(data);
    } catch (err) {
      console.error('Failed to fetch ranking:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch ranking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  return {
    ranking,
    loading,
    error,
    refetch: fetchRanking,
  };
};
