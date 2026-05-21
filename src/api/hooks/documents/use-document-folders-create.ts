import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '@/api/hooks/request';
import { DocumentFolder } from '@/store/types';

interface CreateFolderPayload {
  name: string;
  parentDirectoryId?: string | null;
}

export default function useDocumentFoldersCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFolderPayload) =>
      apiRequest<DocumentFolder>('/api/documents/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] })
  });
}
