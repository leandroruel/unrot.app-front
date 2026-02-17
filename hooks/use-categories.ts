import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { ApiCategory } from '@/types/api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiCategory[]>('/api/categories');
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
