import React from 'react';
import {
  Page,
  PageHeader,
  Button,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { useConfig } from '../../context/config_context/config_hook';
import './landing_page.css';

export const LandingPage = () => {

  const { appConfig } = useConfig();
  

  return (
    <div className="landing-page">
      <Page
        header={
          <PageHeader logo={<span className="logo-text">LodeStar</span>} />
        }
      >
        <div className="jumbotron-container">
          <div className="cta">
            <span>LodeStar</span>
            <Link to="/app">
              <Button data-cy={'get_started_button'}>Get Started</Button>
            </Link>
          </div>
          <div className="video-container">
          {appConfig?.landingVideos?.map(video => {
            return (
              <div key={video.description} className="aspect-ratio--16x9 homepage-video">
                <iframe
                  className="aspect-ratio-object"
                  id="kaltura_player"
                  src={video.url}
                  width="768"
                  height="432"
                  allowFullScreen
                  allow="autoplay *; fullscreen *; encrypted-media *"
                  sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
                  frameBorder="0"
                  title="Kaltura Player"
                ></iframe>
              </div>
            );
          })}
          </div>
        </div>
        <div className="background-image" />
        <div className="background-image-overlay" />
      </Page>
    </div>
  );
};
