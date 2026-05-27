import { useQuery } from '@tanstack/react-query';
import apiRequest from '../request';

export interface MaterialItem {
  id: string;
  name: string;
  productName: string;
  url: string;
  cost: number;
  unit: string;
  quantity: number;
}

export interface MaterialCategory {
  id: string;
  name: string;
  items: MaterialItem[];
}

export default function useMaterialCategories() {
  return useQuery({
    queryKey: ['material-categories'],
    queryFn: () => apiRequest<MaterialCategory[]>('/api/material-categories')
  });
}
