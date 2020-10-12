import React from 'react';
import { AnalyticsService } from '../../services/analytics_service/analytics_service';

export interface AnalyticsContext {
  logEvent(): void;
  logPageView(path: string): void;
}

export const AnalyticsContext = React.createContext<AnalyticsContext>(null);

export const AnalyticsProvider = ({
  children,
  analyticsService: analyticsRepository,
}: {
  children: any;
  analyticsService: AnalyticsService;
}) => {
  return (
    <AnalyticsContext.Provider value={analyticsRepository}>
      {children}
    </AnalyticsContext.Provider>
  );
};
