import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 30 * 60 * 1000,   // 30 minutos em cache
      retry: (failureCount, error: any) => {
        // Não retentar erros de autenticação ou validação
        if (error?.status === 401 || error?.status === 400) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Evitar spam de requests em apps clínicos
    },
    dehydrate: {
      shouldDehydrateQuery: (query) => 
        defaultShouldDehydrateQuery(query) || 
        query.state.status === 'pending',
    },
  },
});
