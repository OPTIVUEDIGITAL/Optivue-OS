import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const tokens=JSON.parse(readFileSync('src/design-tokens.json','utf8'));
function luminance(hex){const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb.reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
function contrast(a,b){const [low,high]=[luminance(a),luminance(b)].sort((a,b)=>a-b);return (high+.05)/(low+.05);}
test('Midnight Navy exact main palette',()=>{for(const [key,value] of Object.entries({bg:'#0E1A2B',surface:'#16263D',text:'#F6F2E8',primary:'#D6F34E','primary-text':'#0E1A2B'}))assert.equal(tokens.dark[key],value,key);});
test('light values are unchanged from the selected baseline',()=>{const old={light:JSON.parse(readFileSync('tests/fixtures/review-light-tokens.json','utf8'))};for(const [k,v] of Object.entries(old.light))assert.equal(tokens.light[k],v,k);});
test('dark text and essential borders pass on both surfaces',()=>{for(const bg of ['#0E1A2B','#16263D']){assert(contrast(tokens.dark.text,bg)>=4.5);assert(contrast(tokens.dark.muted,bg)>=4.5);assert(contrast(tokens.dark.border,bg)>=3);}assert(contrast(tokens.dark.primary,tokens.dark['primary-text'])>=4.5);});

const bootstrap=readFileSync('src/js/theme-init.js','utf8');
test('theme resolves synchronously before render, with safe storage fallback',()=>{
 for(const saved of ['dark','light',null]){const doc={documentElement:{dataset:{},style:{}}};const win={};runInNewContext(bootstrap,{document:doc,window:win,parent:win,localStorage:{getItem:()=>saved}});assert.equal(doc.documentElement.dataset.theme,saved==='dark'?'dark':'light');assert.equal(doc.documentElement.style.colorScheme,doc.documentElement.dataset.theme);}
 const doc={documentElement:{dataset:{},style:{}}},win={};runInNewContext(bootstrap,{document:doc,window:win,parent:win,localStorage:{getItem(){throw Error('denied')}}});assert.equal(doc.documentElement.dataset.theme,'light');
});
test('embedded map inherits the parent theme',()=>{const doc={documentElement:{dataset:{},style:{}}};runInNewContext(bootstrap,{document:doc,window:{},parent:{document:{documentElement:{dataset:{theme:'dark'}}}},localStorage:{getItem:()=>null}});assert.equal(doc.documentElement.dataset.theme,'dark');});
