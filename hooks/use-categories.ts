import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiCategory } from '@/types/api';

export function useCategories() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiCategory[]>('/api/categories');
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: isAuthenticated,
  });
}
