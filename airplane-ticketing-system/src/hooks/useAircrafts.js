import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

export const useAircraftsList = () =>
  useQuery({
    queryKey: ['aircrafts'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/api/v1/aircrafts');
      return data;
    },
  });