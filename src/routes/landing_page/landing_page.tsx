import React from 'react';
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
  const pageHeader = (
    <PageHeader
      logo={<span className="logo-text">LodeStar</span>}
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














        <div className="jumbotron-container" style={{ height: '100vh' }}>
          <div className="video-container">
            <div className="aspect-ratio--16x9 homepage-video">
              <iframe
                className="aspect-ratio-object"
                id="kaltura_player"
                src="https://cdnapisec.kaltura.com/p/2300461/sp/230046100/embedIframeJs/uiconf_id/42569541/partner_id/2300461?iframeembed=true&playerId=kaltura_player&entry_id=1_e1kbegt0&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=1_aphcva5b"
                width="768"
                height="432"
                allowFullScreen
                allow="autoplay *; fullscreen *; encrypted-media *"
                sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
                frameBorder="0"
                title="Kaltura Player"
              ></iframe>
            </div>
            <div className="aspect-ratio--16x9 homepage-video">
              <iframe
                className="aspect-ratio-object"
                id="kaltura_player"
                src="https://cdnapisec.kaltura.com/p/2300461/sp/230046100/embedIframeJs/uiconf_id/42569541/partner_id/2300461?iframeembed=true&playerId=kaltura_player&entry_id=1_e1kbegt0&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=1_aphcva5b"
                width="768"
                height="432"
                allowFullScreen
                allow="autoplay *; fullscreen *; encrypted-media *"
                sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
                frameBorder="0"
                title="Kaltura Player"
              ></iframe>
            </div>
            <div className="aspect-ratio--16x9 homepage-video">
              <iframe
                className="aspect-ratio-object"
                id="kaltura_player"
                src="https://cdnapisec.kaltura.com/p/2300461/sp/230046100/embedIframeJs/uiconf_id/42569541/partner_id/2300461?iframeembed=true&playerId=kaltura_player&entry_id=1_e1kbegt0&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=1_aphcva5b"
                width="768"
                height="432"
                allowFullScreen
                allow="autoplay *; fullscreen *; encrypted-media *"
                sandbox="allow-forms allow-same-origin allow-scripts allow-top-navigation allow-pointer-lock allow-popups allow-modals allow-orientation-lock allow-popups-to-escape-sandbox allow-presentation allow-top-navigation-by-user-activation"
                frameBorder="0"
                title="Kaltura Player"
              ></iframe>
            </div>
          </div>
          </div>











          <div className="cta">
            <span>LodeStar</span>
            <Link to="/app">
              <Button data-cy={'get_started_button'}>Get Started</Button>
            </Link>
          </div>
          <div className="background-image" />
          <div className="background-image-overlay" />
      </Page>
    </div>
  );
};
