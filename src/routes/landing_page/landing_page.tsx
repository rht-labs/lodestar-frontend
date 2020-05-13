import React, { useEffect, useContext } from 'react';
import { FeedbackContext } from '../../context/feedback_context';
import { Page, PageHeader, Brand } from '@patternfly/react-core';
export const LandingPage = () => {
  const feedbackContext = useContext(FeedbackContext);
  useEffect(() => feedbackContext.hideLoader(), [feedbackContext]);
  const pageHeader = (
    <PageHeader
      logo={<Brand alt="Patternfly Logo" />}
      // toolbar={PageToolbar}
      // avatar={<Avatar src={imgAvatar} alt="Avatar image" />}
      // topNav={PageNav}
    />
  );
  return (
    <>
      <Page header={pageHeader}></Page>
    </>
  );
};
