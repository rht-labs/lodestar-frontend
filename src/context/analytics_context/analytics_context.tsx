import React from 'react';
import { AnalyticsService } from '../../services/analytics_service/analytics_service';
import { AnalyticsEvent } from '../../schemas/analytics';

export interface AnalyticsContext {
  logEvent(event: AnalyticsEvent): void;
  logPageView(path: string): void;
}

export const AnalyticsContext = React.createContext<AnalyticsContext>(null);

export const AnalyticsProvider = ({
  children,
  analyticsService,
}: {
  children: any;
  analyticsService: AnalyticsService;
}) => {
  return (
    <AnalyticsContext.Provider value={analyticsService}>
      {children}
    </AnalyticsContext.Provider>
  );
};
