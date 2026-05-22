import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '@/api/hooks/request';
import { DocumentFolder } from '@/store/types';

export default function useDocumentFoldersUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) =>
      apiRequest<DocumentFolder>(`/api/documents/folders/${folderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}
