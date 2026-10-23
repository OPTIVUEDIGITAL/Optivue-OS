import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('preview route exists with static content and noindex, nofollow',async()=>{
 let html='';try{html=await readFile(new URL('production/preview/growth-map/index.html',root),'utf8')}catch{}
 assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
 assert.match(html,/Your Growth OS, built in your accounts\./);
 assert.equal((html.match(/<details/g)||[]).length,4);
 assert.equal((html.match(/href="\/estimator"/g)||[]).length,1);
 assert.doesNotMatch(html,/calendly|ga4\.js|100%/i);
});
test('static copy matches the data file and contains no banned terms',async()=>{
 const {GROWTH_MAP,OWNERSHIP_SENTENCE}=await import('../production/js/growth-map.data.js');
 const {renderGrowthMap}=await import('../production/js/components/growth-map.js');
 assert.equal(GROWTH_MAP.sources.length,5);assert.equal(GROWTH_MAP.stations.length,4);
 const html=renderGrowthMap();assert.ok(html.includes(OWNERSHIP_SENTENCE));
 const text=html.replace(/<[^>]*>/g,' ');
 for(const term of ['funnel','pipeline','tech stack','infrastructure','bespoke','engineer','leverage','seamless','ROI','ROAS','optimize for revenue','100%'])assert.ok(!new RegExp('\\b'+term+'\\b','i').test(text),term);
 for(const s of GROWTH_MAP.stations){assert.ok(html.includes(s.title));assert.ok(html.includes(s.gap));assert.ok(html.includes(s.expanded));}
});
test('preview is excluded from sitemap, navigation and analytics and has response headers',async()=>{
 const headers=await readFile(new URL('production/_headers',root),'utf8');assert.match(headers,/\/preview\/growth-map[\s\S]*X-Robots-Tag: noindex, nofollow/);
 for(const path of ['production/index.html','production/sitemap.xml','production/estimator/index.html']){const s=await readFile(new URL(path,root),'utf8');assert.ok(!s.includes('/preview/growth-map'));}
});
