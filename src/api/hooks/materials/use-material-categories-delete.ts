import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

export default function useMaterialCategoriesDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId }: { categoryId: string }) =>
      apiRequest(`/api/material-categories/${categoryId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['material-categories'] })
  });
}
