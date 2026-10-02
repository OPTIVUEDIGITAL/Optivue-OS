import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {faqEntities,renderSeo} from '../scripts/build-seo.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('production/index.html');
test('no-JS H1 contains exactly one sentence and no phrase-list text',()=>{
 const headings=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
 assert.equal(headings.length,1);
 assert.equal(headings[0][1].replace(/<[^>]*>/g,''),'Turn more leads into booked visits');
 const body=html.split('<body>')[1].replace(/<[^>]*>/g,'');
 for(const phrase of ['a higher conversion rate','long-term clients','better appointments','closed deals','stronger ad performance','revenue you can scale','higher ROAS']) assert.ok(!body.includes(phrase));
});
test('homepage title and social metadata match approved copy',()=>{
 const title='Clinic Lead Follow-Up &amp; Booking Systems | Optivue Growth OS';
 assert.ok(html.includes(`<title>${title}</title>`));
 for(const name of ['og:title','twitter:title'])assert.ok(html.includes(`${name}" content="${title}"`));
 const description='I help med spas and wellness clinics fix lead follow-up, booking, and tracking, so more leads become booked visits. Systems you own.';
 for(const name of ['description','og:description','twitter:description'])assert.ok(html.includes(`${name}" content="${description}"`));
 assert.ok(html.includes("Here's where clinic leads usually get lost."));
 assert.ok(html.includes("Every plan starts with an Audit of your clinic's lead follow-up. All prices in USD."));
});
test('About alt text and 1200 by 630 social PNG exist',()=>{
 assert.match(html,/rahmel-dela-cruz\.webp[^>]*alt="Rahmel Dela Cruz, founder of Optivue Digital"/);
 assert.match(html,/rahmel-working-after\.webp[^>]*alt="Rahmel Dela Cruz working on a client's growth system"/);
 const image=fs.readFileSync(new URL('../production/assets/growth-os-social.png',import.meta.url));
 assert.equal(image.subarray(1,4).toString(),'PNG');
 assert.equal(image.readUInt32BE(16),1200);assert.equal(image.readUInt32BE(20),630);
 for(const tag of ['og:image','twitter:image'])assert.ok(html.includes(`${tag}" content="https://growth.optivuedigital.com/assets/growth-os-social.png"`));
 assert.ok(html.includes('og:image:width" content="1200"'));assert.ok(html.includes('og:image:height" content="630"'));assert.ok(html.includes('og:image:alt'));
});
test('JSON-LD parses, ProfessionalService exists, FAQ exactly matches visible content',()=>{
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const service=schemas.find(x=>x['@type']==='ProfessionalService');
 assert.equal(service['@context'],'https://schema.org');assert.equal(service.name,'Optivue Digital');assert.equal(service.url,'https://growth.optivuedigital.com/');
 const faq=schemas.find(x=>x['@type']==='FAQPage');assert.equal(faq['@context'],'https://schema.org');assert.equal(faq.mainEntity.length,6);
 assert.deepEqual(faq.mainEntity,faqEntities(html));
 for(const q of faq.mainEntity){assert.equal(q['@type'],'Question');assert.ok(q.name);assert.equal(q.acceptedAnswer['@type'],'Answer');assert.ok(q.acceptedAnswer.text);}
 assert.equal(renderSeo(html),html);
});
test('robots allows crawling, sitemap includes homepage only, preview rules are host-scoped',()=>{
 const robots=read('production/robots.txt'), sitemap=read('production/sitemap.xml'),headers=read('production/_headers');
 assert.match(robots,/User-agent: \*\nAllow: \//);assert.ok(!robots.includes('Disallow: /'));
 assert.ok(robots.includes('Sitemap: https://growth.optivuedigital.com/sitemap.xml'));
 assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),['https://growth.optivuedigital.com/']);
 assert.match(headers,/https:\/\/:version\.:subdomain\.workers\.dev\/\*\n  X-Robots-Tag: noindex, nofollow/);
 assert.match(html,/<meta name="robots" content="index,follow,max-image-preview:large">/);
 assert.ok(!headers.includes('https://growth.optivuedigital.com/'));
});
