import {readFile,readdir,access} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);files.push(...(e.isDirectory()?await walk(p):[p]));}return files;}
let refs=0;
for(const f of (await walk('dist')).filter(f=>f.endsWith('.html'))){
 const html=await readFile(f,'utf8');
 for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
  const ref=m[1].split(/[?#]/)[0];
  if(!ref||/^(?:https?:|mailto:|tel:|data:|\/\/)/.test(ref)||! /\.(?:js|css|webp|png|svg|jpg|woff2)$/.test(ref))continue;
  await access(ref.startsWith('/')?'dist'+ref:path.resolve(path.dirname(f),ref));refs++;
 }
}
const map=await readFile('dist/growth-map/index.html','utf8');
assert(!/12-second loop|Pause motion|Replay ↻|class="toolbar"/.test(map));
assert(map.includes('scrollbar-width:none'));
assert(map.includes('infinite'));
const site=await readFile('dist/site.html','utf8');
assert(site.includes('Illustrative workflow.'));
assert(!site.includes('Examples, not a required stack.'));
assert.equal((site.match(/rel="stylesheet"/g)||[]).length,2);
assert(site.includes('data-critical-hero'));
assert(site.includes('media="print" onload="this.media=\'all\'"'));
assert(site.includes('<noscript><link rel="stylesheet"'));
assert(!/src="\/js\/theme-[^\"]+\.min\.js"/.test(site));
const meta=JSON.parse(await readFile('build-meta.json','utf8'));
for(const output of Object.values(meta.outputs))for(const i of output.imports)if(!i.external)await access(i.path);
console.log(`Verified ${refs} asset references, JavaScript chunks, consolidated stylesheet, and Growth Map requirements.`);
