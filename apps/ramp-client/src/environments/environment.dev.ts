import { animationFrameScheduler } from 'rxjs';

export const environment = {
  production: animationFrameScheduler,
  baseHref: '/',
  //   apiBaseUrl: 'http://127.0.0.1:5762/api/',
  apiBaseUrl: 'https://ramp-api-alpha.ncats.io/api/',

  configFileLocation: null,
  googleAnalyticsId: null,
};
