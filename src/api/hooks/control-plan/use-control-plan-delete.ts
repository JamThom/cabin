import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

export default function useControlPlanDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest(`/api/control-plan/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['control-plan'] }),
  });
}
