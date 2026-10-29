import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const gif='https://static.wixstatic.com/media/cfa8a4_443771cb723c4e609ba6bbbe308348f9~mv2.gif';

test('homepage and alternate page use one GIF for Open Graph and X cards',async()=>{
 for(const page of ['index.html','site.html']){
  const s=await readFile('dist/'+page,'utf8');
  assert(s.includes('property="og:image" content="'+gif+'"'),page+' Open Graph image');
  assert(s.includes('property="og:image:secure_url" content="'+gif+'"'),page+' HTTPS image');
  assert(s.includes('name="twitter:image" content="'+gif+'"'),page+' X image');
  assert(s.includes('property="og:image:type" content="image/gif"'));
  assert.equal((s.match(/property="og:image" content=/g)||[]).length,1);
  assert.equal((s.match(/property="og:image:type"/g)||[]).length,1);
  assert.equal((s.match(/property="og:image:width"/g)||[]).length,1);
  assert.equal((s.match(/property="og:image:height"/g)||[]).length,1);
  assert(s.includes('property="og:image:alt"'));
  assert(s.includes('name="twitter:image:alt"'));
  assert(s.includes('<meta name="twitter:card" content="summary_large_image">'));
 }
});
