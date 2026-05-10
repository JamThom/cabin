import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

interface CreateMaterialCategoryBody {
  name: string;
}

export default function useMaterialCategoriesCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateMaterialCategoryBody) =>
      apiRequest('/api/material-categories', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['material-categories'] })
  });
}
