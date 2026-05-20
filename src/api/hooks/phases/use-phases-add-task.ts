import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';
import { Task } from '@/store/types';

export default function usePhasesAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phaseId }: { phaseId: string }) =>
      apiRequest<Task>(`/api/phases/${phaseId}/tasks`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['phases'] })
  });
}
