import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '@/api/hooks/request';
import { DocumentFolder } from '@/store/types';

export default function useDocumentFoldersCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      apiRequest<DocumentFolder>('/api/documents/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] })
  });
}
