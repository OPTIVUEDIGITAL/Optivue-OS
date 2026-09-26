/**
 * Public runtime configuration.
 *
 * Do not put private API keys or a raw Make webhook URL in this file.
 * Point leadEndpoint at a server-side relay when the intake backend is live.
 */
export const RUNTIME_CONFIG = {
  // Owner approval required before enabling either pricing policy.
  diagnosticCreditEnabled: false,
  diagnosticGuaranteeEnabled: false,
  leadEndpoint: '',
  leadSubmissionEnabled: false,
};
