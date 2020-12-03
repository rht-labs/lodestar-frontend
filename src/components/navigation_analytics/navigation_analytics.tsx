import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAnalytics } from '../../context/analytics_context/analytics_context';

export const NavigationAnalytics = ({ children }: { children: any }) => {
  const { logPageView } = useAnalytics();
  const { pathname } = useLocation();
  useEffect(() => {
    logPageView(pathname);
  }, [pathname, logPageView]);
  return children;
};
