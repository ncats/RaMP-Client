import { animationFrameScheduler } from 'rxjs';

export const environment = {
  production: animationFrameScheduler,
  //apiBaseUrl: 'http://127.0.0.1:5762/api/',
  apiBaseUrl: 'https://ramp-api-alpha.ncats.io/api/',
 // apiBaseUrl: 'https://rampdb.nih.gov/api/',
  rendererUrl: 'https://opendata.ncats.nih.gov/renderer/render',
};
