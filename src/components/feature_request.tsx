import React from 'react';
import { useHistory } from 'react-router';
export function FeatureRequest() {
  window.open('https://red.ht/ompenhancements');
  const history = useHistory();
  history.goBack();
  return <div />;
}
