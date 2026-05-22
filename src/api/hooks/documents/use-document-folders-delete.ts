import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '@/api/hooks/request';

export default function useDocumentFoldersDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) =>
      apiRequest<void>(`/api/documents/folders/${folderId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}
