import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('visitor pages have concise metadata, favicon, one H1 and private indexing guard',async()=>{
 const titles=new Set();
 for(const route of ['index.html','privacy/index.html','terms/index.html','cookies/index.html','estimator/index.html','thank-you/index.html']){
  const s=await readFile('dist/'+route,'utf8');
  const title=s.match(/<title>(.*?)<\/title>/)[1];const description=s.match(/name="description" content="([^"]+)"/)[1];
  assert(title.length<60);assert(description.length<160);assert(!titles.has(title));titles.add(title);
  assert.equal((s.match(/<h1\b/g)||[]).length,1);assert(s.includes('href="/favicon.svg"'));assert(s.includes('content="noindex,nofollow"'));
  assert(!/OWNER TO CONFIRM|Lorem ipsum|DRAFT FOR OWNER REVIEW/.test(s));
  for(const img of s.matchAll(/<img\b[^>]*>/g))assert(/alt="[^"]*"/.test(img[0]));
 }
});
test('legal pages contain supplied business identity and cookie fallback anchor exists',async()=>{
 for(const route of ['privacy','terms','cookies']){const s=await readFile('dist/'+route+'/index.html','utf8');assert(s.includes('Optivue Digital Marketing Services'));assert(s.includes('7136794'));assert(s.includes('class="ovgo-footer"'));}
 assert((await readFile('dist/cookies/index.html','utf8')).includes('id="preferences"'));
});
