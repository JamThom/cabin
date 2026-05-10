import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

interface AddMaterialItemBody {
  categoryId: string;
}

export default function useMaterialCategoriesAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId }: AddMaterialItemBody) =>
      apiRequest(`/api/material-categories/${categoryId}/items`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['material-categories'] })
  });
}
