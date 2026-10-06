import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ESTIMATOR_CONFIG as config} from '../production/js/estimator-config.js';
const html=fs.readFileSync('production/index.html','utf8');
test('approved copy and exact Audit price render in static HTML',()=>{
 for(const s of ['pay software directly',"provider's rates",'Three ways to start','from $800'])assert.ok(!html.includes(s),s);
 for(const s of ['Three ways to work together.','Every plan starts with an Audit. All prices in USD.','one-time · one location','Eight years working','qualified leads, booked visits, and revenue.'])assert.ok(html.includes(s),s);
 assert.equal(config.prices.diagnostic.display,'$800');
 assert.match(html,/<div class="ovgo-modal" data-ovgo-modal hidden>/);
});
