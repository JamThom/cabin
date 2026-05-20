import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

interface UpdateNoteBody {
  noteId: string;
  title: string;
  content: string;
}

export default function useNotesUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, title, content }: UpdateNoteBody) =>
      apiRequest(`/api/notes/${noteId}`, { method: 'PATCH', body: JSON.stringify({ title, content }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] })
  });
}
