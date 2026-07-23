import { useEffect } from 'react';

export const useFavicon = (faviconUrl) => {
  useEffect(() => {
    if (!faviconUrl) return;

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);
};