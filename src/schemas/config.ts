import { AppFeature } from '../common/app_features';
import { LogVerbosity } from '../utilities/logger/logger';

export interface BannerMessage {
  message: string;
  backgroundcolor: string;
}

export interface LandingVideos {
  url: string;
  description: string;
}
export interface Config {
  analyticsTrackingCode: string;
  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;
  disableLaunch: boolean;
  loggerType?: string;
  logLevel?: LogVerbosity;
  supportEmailAddress: string;
  bannerMessages?: BannerMessage[];
  landingVideos?: LandingVideos[];
  allowVersionOverride?: boolean;
  roles: { [key: string]: AppFeature[] };
}

export abstract class Config {
  public static fromFake(): Config {
    return {
      analyticsTrackingCode: 'UA-FAKED',
      baseUrl: 'http://localhost:3000',
      clientId: 'lodestar',
      authBaseUrl:
        'https://sso.example.com/auth/realms/lodestar/protocol/openid-connect',
      backendUrl: 'https://lodestar-backend.example.com',
      disableLaunch: false,
      supportEmailAddress: 'redhatsupport@redhat.com',
      roles: {
        reader: ['reader'],
        writer: ['writer'],
      },
      bannerMessages: [
        {
          message: 'Hello message 1',
          backgroundcolor: '#FF0000',
        },
      ],
      landingVideos: [
        {
          url: "https://cdnapisec.kaltura.com/p/2300461/sp/230046100/embedIframeJs/uiconf_id/42569541/partner_id/2300461?iframeembed=true&playerId=kaltura_player&entry_id=1_e1kbegt0&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=1_aphcva5b",
          description: "this is a video"
        },
        {
          url: "https://cdnapisec.kaltura.com/p/2300461/sp/230046100/embedIframeJs/uiconf_id/42569541/partner_id/2300461?iframeembed=true&playerId=kaltura_player&entry_id=1_e1kbegt0&flashvars[streamerType]=auto&amp;flashvars[localizationCode]=en&amp;flashvars[leadWithHTML5]=true&amp;flashvars[sideBarContainer.plugin]=true&amp;flashvars[sideBarContainer.position]=left&amp;flashvars[sideBarContainer.clickToClose]=true&amp;flashvars[chapters.plugin]=true&amp;flashvars[chapters.layout]=vertical&amp;flashvars[chapters.thumbnailRotator]=false&amp;flashvars[streamSelector.plugin]=true&amp;flashvars[EmbedPlayer.SpinnerTarget]=videoHolder&amp;flashvars[dualScreen.plugin]=true&amp;flashvars[hotspots.plugin]=1&amp;flashvars[Kaltura.addCrossoriginToIframe]=true&amp;&wid=1_aphcva5b",
          description: "ls video 2"
        }
      ],
      allowVersionOverride: true,
    };
  }
}
