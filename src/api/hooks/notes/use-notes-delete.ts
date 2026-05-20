import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

export default function useNotesDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId }: { noteId: string }) =>
      apiRequest(`/api/notes/${noteId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] })
  });
}
