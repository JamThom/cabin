import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

export default function useMaterialCategoriesItemDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, itemId }: { categoryId: string; itemId: string }) =>
      apiRequest(`/api/material-categories/${categoryId}/items/${itemId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['material-categories'] })
  });
}
