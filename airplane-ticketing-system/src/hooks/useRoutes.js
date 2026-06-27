import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

export const useRoutesList = () =>
  useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/api/v1/routes');
      return data;
    },
  });