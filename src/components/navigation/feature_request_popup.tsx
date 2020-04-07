import React, { useState, useEffect } from 'react';
import { Popover, Button } from '@patternfly/react-core';

export const FeatureRequestPopup = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const featureRequestPopupKey = 'hasShownFeatureRequestPopup';

  const [
    hasShownFeatureRequestPopup,
    setHasShownFeatureRequestPopup,
  ] = useState<boolean>(true);

  useEffect(() => {
    const hasBeenShownStoredState =
      localStorage.getItem(featureRequestPopupKey) === 'true';
    if (hasShownFeatureRequestPopup !== hasBeenShownStoredState) {
      setHasShownFeatureRequestPopup(hasBeenShownStoredState);
    }
    if (!hasBeenShownStoredState) {
      setTimeout(() => {
        setHasShownFeatureRequestPopup(true);
      }, 5000);
    }
  }, [hasShownFeatureRequestPopup]);
  const onDismissed = () => {
    setHasShownFeatureRequestPopup(true);
    localStorage.setItem(featureRequestPopupKey, 'true');
  };
  return (
    <Popover
      isVisible={!hasShownFeatureRequestPopup}
      headerContent={<span>We're trying to improve</span>}
      shouldClose={onDismissed}
      distance={0}
      bodyContent={
        <div>
          <div>
            Tell us about a feature you would like to see included in Open
            Management Portal.
          </div>
          <Button onClick={onDismissed}>Ok, got it</Button>
        </div>
      }
    >
      {children as any}
    </Popover>
  );
};
