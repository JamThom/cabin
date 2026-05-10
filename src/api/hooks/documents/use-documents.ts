import { useQuery } from '@tanstack/react-query';
import apiRequest from '@/api/hooks/request';
import { DocumentFolder } from '@/store/types';

export default function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => apiRequest<DocumentFolder[]>('/api/documents')
  });
}
