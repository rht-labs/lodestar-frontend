import { useCallback } from 'react';

export const useFeatures = (features: string[] = []) => {
  const hasFeature = useCallback(
    (name: string) => {
      return name && features.includes(name);
    },
    [features]
  );

  return {
    features,
    hasFeature,
  };
};
