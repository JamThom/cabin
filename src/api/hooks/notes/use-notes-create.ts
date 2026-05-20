import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';
import { Note } from './use-notes';

export default function useNotesCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest<Note>('/api/notes', { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] })
  });
}
