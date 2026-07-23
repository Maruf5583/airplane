
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSettings, updateGeneralSettings, updateMailSettings,
  testMailSettings, uploadLogo, uploadFavicon,
} from '../api/settings';

export const useSettings = () =>
  useQuery({ queryKey: ['settings'], queryFn: getSettings, staleTime: 5 * 60 * 1000 });

export const useUpdateGeneralSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateGeneralSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
};

export const useUpdateMailSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateMailSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
};

export const useTestMail = () => useMutation({ mutationFn: testMailSettings });

export const useUploadLogo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadLogo,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
};

export const useUploadFavicon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadFavicon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
};

import { updateStripeSettings } from '../api/settings';   // top import-এ যোগ করুন

export const useUpdateStripeSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateStripeSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
};