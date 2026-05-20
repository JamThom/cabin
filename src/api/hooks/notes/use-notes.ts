import { useQuery } from '@tanstack/react-query';
import apiRequest from '../request';

export interface Note {
  id: string;
  title: string;
  content: string;
  dateModified: string;
}

export default function useNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: () => apiRequest<Note[]>('/api/notes')
  });
}
