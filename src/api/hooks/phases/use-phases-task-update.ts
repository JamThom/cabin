import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';
import { Status } from '@/store/types';

interface UpdateTaskBody {
  phaseId: string;
  taskId: string;
  name: string;
  status: Status;
  costEst: string;
  blockedBy: string;
  description: string;
  date: string;
}

export default function usePhasesTaskUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phaseId, taskId, name, status, costEst, blockedBy, description, date }: UpdateTaskBody) =>
      apiRequest(`/api/phases/${phaseId}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, status, costEst, blockedBy, description, date })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['phases'] })
  });
}
