import fs from 'node:fs';
import { renderPriceHTML } from '../production/js/pricing-values.js';
const path = new URL('../production/index.html', import.meta.url);
const html = fs.readFileSync(path, 'utf8');
const output = renderPriceHTML(html);
if (process.argv.includes('--check')) { if (output !== html) throw Error('Static prices differ from shared config. Run node scripts/build-prices.mjs'); }
else fs.writeFileSync(path, output);
