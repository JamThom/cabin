import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';
import { ControlPlanItem } from '@/store/types';

type UpdateBody = Partial<Omit<ControlPlanItem, 'id'>>;

export default function useControlPlanUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateBody & { id: string }) =>
      apiRequest<ControlPlanItem>(`/api/control-plan/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['control-plan'] }),
  });
}
