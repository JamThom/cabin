import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

interface UpdatePhaseBody {
  phaseId: string;
  name: string;
}

export default function usePhasesUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phaseId, name }: UpdatePhaseBody) =>
      apiRequest(`/api/phases/${phaseId}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['phases'] })
  });
}
