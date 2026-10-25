import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('src/growth-map/index.html','utf8');
const js=readFileSync('src/js/map.js','utf8');
test('map no longer requires an overview/details control',()=>{assert(!html.includes('id="view-toggle"'));assert(!js.includes('toggle.addEventListener'));});
test('each of six animated travellers follows its visible route',()=>{const rails=[...html.matchAll(/class="rail" d="([^"]+)"/g)].map(m=>m[1]);const paths=[...html.matchAll(/offset-path:path\('([^']+)'\)/g)].map(m=>m[1]);assert.equal(rails.length,6);assert.deepEqual(paths,rails);assert.equal((html.match(/class="stop"/g)||[]).length,24);});
