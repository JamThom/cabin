import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

interface AddTaskBody {
  phaseId: string;
}

export default function usePhasesAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phaseId }: AddTaskBody) => apiRequest(`/api/phases/${phaseId}/tasks`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['phases'] })
  });
}
