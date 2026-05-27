import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

interface UpdateMaterialItemBody {
  categoryId: string;
  itemId: string;
  name: string;
  productName: string;
  url: string;
  cost: number;
  unit: string;
  quantity: number;
  targetCategoryId?: string;
}

export default function useMaterialCategoriesItemUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, itemId, ...body }: UpdateMaterialItemBody) =>
      apiRequest(`/api/material-categories/${categoryId}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['material-categories'] })
  });
}
