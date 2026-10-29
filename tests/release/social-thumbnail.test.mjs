import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const gif='https://static.wixstatic.com/media/cfa8a4_443771cb723c4e609ba6bbbe308348f9~mv2.gif';
const jpeg='https://static.wixstatic.com/media/cfa8a4_f35d936c3c7546a9b7f44a0c57bef341~mv2.jpg';
test('homepage and alternate site expose original GIF with static image fallback',async()=>{
 for(const page of ['index.html','site.html']){
  const s=await readFile('dist/'+page,'utf8');
  assert.match(s,/property="og:image:type" content="image\/gif"/);
  assert.match(s,/property="og:image:type" content="image\/jpeg"/);
  assert(s.includes('property="og:image" content="'+gif+'"'));
  assert(s.includes('property="og:image" content="'+jpeg+'"'));
  assert(s.indexOf(gif)<s.indexOf(jpeg));
  assert(s.includes('name="twitter:image" content="'+jpeg+'"'));
  assert.equal((s.match(/property="og:image:width"/g)||[]).length,2);
  assert.equal((s.match(/property="og:image:height"/g)||[]).length,2);
  assert(s.includes('property="og:image:alt"'));
  assert(s.includes('name="twitter:image:alt"'));
  assert(s.includes('<meta name="twitter:card" content="summary_large_image">'));
 }
});
