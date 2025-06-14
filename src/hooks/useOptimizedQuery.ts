
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useOptimizedQuery = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback((queryKeys: string[]) => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [queryClient]);

  const optimisticUpdate = useCallback((queryKey: string[], updater: (oldData: any) => any) => {
    queryClient.setQueryData(queryKey, updater);
  }, [queryClient]);

  const prefetchQuery = useCallback((queryKey: string[], queryFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

  return {
    invalidateQueries,
    optimisticUpdate,
    prefetchQuery
  };
};
