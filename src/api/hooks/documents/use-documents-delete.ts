import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '@/api/hooks/request';

export default function useDocumentsDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) =>
      apiRequest<void>(`/api/documents/${fileId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}