import { ESTIMATOR_CONFIG } from './estimator-config.js';
export function priceFor(key, config = ESTIMATOR_CONFIG) { return { ...config.prices[key] }; }
export function displayPrice(key, dataset = {}, config = ESTIMATOR_CONFIG) {
 const price = priceFor(key, config);
 if ('priceMonthly' in dataset) return `then ${price.monthly}`;
 return 'priceShort' in dataset ? (price.cardDisplay || price.display) : price.display;
}
export function pathTotal(result, config = ESTIMATOR_CONFIG) {
 if (result === 'B' || result === 'D') return `Typical first step: ${config.prices.diagnostic.display.replace(/^from /, '')} Audit, then ${config.prices.foundation.display} (Audit credited)`;
 if (result === 'C') return `${config.prices.operations.display} (Audit credited)`;
 return '';
}
export function renderPriceHTML(html, config = ESTIMATOR_CONFIG) {
 return html.replace(/(<(?:strong|span)[^>]*data-price-key="(\w+)"([^>]*)>)[^<]*(<\/(?:strong|span)>)/g, (_, open, key, attrs, close) => open + displayPrice(key, {...(/data-price-short/.test(attrs)?{priceShort:''}:{}),...(/data-price-monthly/.test(attrs)?{priceMonthly:''}:{})}, config) + close);
}
