import { initBooking } from './booking.js';
import { initDiagnosis } from './diagnosis.js';
import { initEstimator } from './estimator.js';

const root = document.getElementById('optivue-growth-os');

if (root) {
  initBooking(root);
  initDiagnosis(root);
  initEstimator(root);
}
