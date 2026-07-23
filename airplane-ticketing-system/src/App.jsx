import './App.css'
import AppRoutes from './routes/AppRoutes';
import { useSettings } from './hooks/useSettings';
import { useFavicon } from './hooks/useFavicon';
import { getFileUrl } from './utils/getFileUrl';

export default function App() {
  const { data: settings } = useSettings();
  useFavicon(getFileUrl(settings?.faviconUrl));

  return <AppRoutes />;
}