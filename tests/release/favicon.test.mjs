import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const expected='691a4b221d6800d716a9943b30b9999274a44aafe03897fc248f4bab080590c0';
test('favicon matches the uploaded SVG, including its accessibility and reduced-motion states',async()=>{
 const svg=await readFile('src/favicon.svg','utf8');
 assert.equal(createHash('sha256').update(svg).digest('hex'),expected);
 assert.match(svg,/viewBox="0 0 32 32"/);
 assert.match(svg,/prefers-reduced-motion:reduce/);
 assert.match(svg,/@keyframes scanner/);
 assert.doesNotMatch(svg,/<script\b|<foreignObject\b|\shref=|<image\b/i);
});
test('release pages use a fingerprinted favicon href to invalidate prior icon cache',async()=>{
 const hash=expected.slice(0,10);
 for(const route of ['index.html','site.html','estimator/index.html']){
  const html=await readFile('dist/'+route,'utf8');
  assert(html.includes('<link rel="icon" type="image/svg+xml" href="/favicon.svg?v='+hash+'">'));
 }
});
