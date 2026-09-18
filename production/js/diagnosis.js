export const diagnosisSteps = [
  'Business',
  'Goals',
  'Acquisition',
  'Conversion',
  'Systems',
];

export function initDiagnosis(root) {
  const mount = root.querySelector('[data-ovgo-diagnosis]');
  if (!mount) return;

  mount.innerHTML = '<p>Diagnosis module scaffold ready for the five-step audit workflow.</p>';
}
