import { useContext } from "react";
import { AnalyticsContext } from "./analytics_context";

export const useAnalytics = () => useContext(AnalyticsContext)