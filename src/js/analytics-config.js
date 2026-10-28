export const MEASUREMENT_ID = 'G-9XBD3QZ5BQ';
export const PREVIEW_HOST = 'optivue-packages-concept-oct26.rahmeldc.chatgpt.site';
export function analyticsEnvironment(hostname) {
  if (hostname === 'growth.optivuedigital.com') return 'production';
  return null;
}
