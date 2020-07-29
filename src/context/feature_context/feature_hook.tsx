import { useContext } from 'react';
import { FeatureToggleContext } from './feature_toggles';

export const useFeatures = () => useContext(FeatureToggleContext);
