import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

export default function usePhasesDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phaseId }: { phaseId: string }) =>
      apiRequest(`/api/phases/${phaseId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['phases'] })
  });
}
