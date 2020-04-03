import React from 'react';
import { useHistory } from 'react-router';
export function FeatureRequest() {
  window.open(
    'https://docs.google.com/forms/d/e/1FAIpQLSfcKY5eKwDYSxIF9oYeDDVyYCqwcq_AD0eqhY4uLtpcCgfWwA/viewform'
  );
  const history = useHistory();
  history.goBack();
  return <div />;
}
