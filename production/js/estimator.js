export const estimatorGroups = [
  'Primary Need',
  'Business Complexity',
  'Channels',
  'Infrastructure',
  'Urgency',
  'Support Model',
];

export function initEstimator(root) {
  const mount = root.querySelector('[data-ovgo-estimator]');
  if (!mount) return;

  mount.innerHTML = '<p>Estimator module scaffold ready for scope and pricing logic.</p>';
}
