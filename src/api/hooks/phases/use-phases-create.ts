import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../request';

interface CreatePhaseBody {
  name: string;
}

export default function usePhasesCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreatePhaseBody) => apiRequest('/api/phases', { method: 'POST', body: JSON.stringify(body) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['phases'] })
  });
}
