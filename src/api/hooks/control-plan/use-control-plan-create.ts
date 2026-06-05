import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';
import { ControlPlanItem } from '@/store/types';

export default function useControlPlanCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest<ControlPlanItem>('/api/control-plan', { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['control-plan'] }),
  });
}
