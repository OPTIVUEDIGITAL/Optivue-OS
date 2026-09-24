/**
 * Public runtime configuration.
 *
 * Do not put private API keys or a raw Make webhook URL in this file.
 * Point leadEndpoint at a server-side relay when the intake backend is live.
 */
export const RUNTIME_CONFIG = {
  leadEndpoint: '',
  leadSubmissionEnabled: false,
  foundingClinicEnabled: false,
  foundingClinicSpots: '[CONFIRM: 2]',
  foundingClinicTerms: '[CONFIRM: Diagnostic fee fully credited toward the Foundation Build]',
};
