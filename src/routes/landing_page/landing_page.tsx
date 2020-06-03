import React, { useEffect } from 'react';
import { useFeedback } from '../../context/feedback_context';
import {
  Page,
  PageHeader,
  Toolbar,
  Button,
  PageSection,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import './landing_page.css';
export const LandingPage = () => {
  const feedbackContext = useFeedback();
  useEffect(() => feedbackContext.hideLoader(), [feedbackContext]);
  const pageHeader = (
    <PageHeader
      logo={<span className="logo-text">Open Management Portal</span>}
      toolbar={
        <Toolbar>
          <Link to="/app">
            <Button>Log In</Button>
          </Link>
        </Toolbar>
      }
    />
  );
  return (
    <div className="landing-page">
      <Page header={pageHeader}>
        <PageSection style={{ padding: 0 }}>
          <div style={{ height: 25 }}></div>
        </PageSection>
        <div className="jumbotron-container">
          <div className="cta">
            <span>Open Management Portal</span>
            <Link to="/app">
              <Button>Get Started</Button>
            </Link>
          </div>
          <div className="background-image" />
          <div className="background-image-overlay" />
        </div>
        <PageSection></PageSection>
      </Page>
    </div>
  );
};
