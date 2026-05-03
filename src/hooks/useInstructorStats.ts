'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ApiError } from '@/lib/api/ApiError';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface InstructorStats {
  total_patients: number;
  active_trails: number;
  created_lessons: number;
  today_logs: number;
  generated_at: string;
}

export function useInstructorStats() {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery<InstructorStats, ApiError>({
    queryKey: ['instructor', 'stats'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/instructor/stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new ApiError(
          'FETCH_STATS_FAILED',
          'Não foi possível carregar as estatísticas',
          response.status
        );
      }

      return response.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5 // Cache por 5 minutos para performance
  });
}
