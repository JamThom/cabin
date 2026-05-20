import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

export default function useMaterialCategoriesUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, name }: { categoryId: string; name: string }) =>
      apiRequest(`/api/material-categories/${categoryId}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['material-categories'] })
  });
}
