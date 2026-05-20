import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

export default function usePhasesTaskDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phaseId, taskId }: { phaseId: string; taskId: string }) =>
      apiRequest(`/api/phases/${phaseId}/tasks/${taskId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['phases'] })
  });
}
