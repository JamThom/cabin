import { useQuery } from '@tanstack/react-query';
import apiRequest from '../request';
import { Phase } from '@/store/types';

export default function usePhases() {
  return useQuery({
    queryKey: ['phases'],
    queryFn: () => apiRequest<Phase[]>('/api/phases')
  });
}
