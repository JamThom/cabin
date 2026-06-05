import { useQuery } from '@tanstack/react-query';
import apiRequest from '../request';
import { ControlPlanItem } from '@/store/types';

export default function useControlPlan() {
  return useQuery({
    queryKey: ['control-plan'],
    queryFn: () => apiRequest<ControlPlanItem[]>('/api/control-plan'),
  });
}
