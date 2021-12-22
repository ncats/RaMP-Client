import { animationFrameScheduler } from 'rxjs';

export const environment = {
  production: animationFrameScheduler,
  baseHref: '/',
     apiBaseUrl: 'http://127.0.0.1:5762/api/',
 // apiBaseUrl: 'https://ramp-api-alpha.ncats.io/api/',
  rendererUrl: 'https://ncatsidg-dev.appspot.com/render',
  configFileLocation: null,
  googleAnalyticsId: null,
};
