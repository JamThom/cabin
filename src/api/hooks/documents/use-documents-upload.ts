import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '@/api/hooks/request';
import { DocumentFile } from '@/store/types';

interface UploadPayload {
  name: string;
  folderId: string;
  tags: string[];
  mimeType: string;
}

export default function useDocumentsUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadPayload) =>
      apiRequest<DocumentFile>('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] })
  });
}
