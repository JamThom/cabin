import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';
import { MaterialItem } from './use-material-categories';

type BulkUpdateItem = MaterialItem;

export default function useMaterialCategoriesItemsBulkUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, items }: { categoryId: string; items: BulkUpdateItem[] }) =>
      apiRequest(`/api/material-categories/${categoryId}/items`, {
        method: 'PATCH',
        body: JSON.stringify(items),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['material-categories'] }),
  });
}
