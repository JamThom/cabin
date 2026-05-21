import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '@/api/hooks/request';
import { DocumentFile } from '@/store/types';

interface UploadPayload {
  file: File;
  folderId: string;
  tags: string[];
}

export default function useDocumentsUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadPayload) => {
      const body = new FormData();
      body.append('file', payload.file, payload.file.name);
      body.append('folderId', payload.folderId);
      body.append('tags', JSON.stringify(payload.tags));
      body.append('name', payload.file.name);
      body.append('mimeType', payload.file.type || 'application/octet-stream');
      return apiRequest<DocumentFile>('/api/documents/upload', {
        method: 'POST',
        body
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] })
  });
}
