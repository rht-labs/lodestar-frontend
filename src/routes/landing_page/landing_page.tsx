import React, { useEffect, useContext } from 'react';
import { FeedbackContext } from '../../context/feedback_context';
export const LandingPage = () => {
  const feedbackContext = useContext(FeedbackContext);
  useEffect(() => feedbackContext.hideLoader(), [feedbackContext]);
  return <div />;
};
