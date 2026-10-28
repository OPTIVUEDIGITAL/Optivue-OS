import {readFile,writeFile,readdir} from 'node:fs/promises';
export const publicBuild=process.env.SITE_TARGET==='production';
const indexable=new Set(['index.html','privacy/index.html','terms/index.html','cookies/index.html']);
const descriptions={
 'thank-you/index.html':'Your Optivue Fit Call next steps. Review your booking details and prepare to discuss your CRM, follow-up and appointment conversion goals.',
 'tracking-plan.html':'Optivue Growth OS measurement reference for consent-based website events, booking actions and funnel reporting.',
 'review.html':'Private responsive design review of Optivue Growth OS, including packages, client-owned systems and booking.'
};
async function walk(dir){let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;out.push(...e.isDirectory()?await walk(p):[p]);}return out;}
for(const file of (await walk('dist')).filter(f=>f.endsWith('.html'))){
 let s=await readFile(file,'utf8');const route=file.slice(5);
 if(!/name="description"/.test(s)&&descriptions[route])s=s.replace('</head>',`<meta name="description" content="${descriptions[route]}"></head>`);
 if(!/rel="icon"/.test(s))s=s.replace('</head>','<link rel="icon" type="image/svg+xml" href="/favicon.svg"></head>');
 // Every page of this owner-private review stays out of search results.
 s=s.replace(/<meta name="robots"[^>]*>/g,'');
 s=s.replace('</head>',`<meta name="robots" content="${publicBuild&&indexable.has(route)?'index,follow':'noindex,nofollow'}"></head>`);
 if(publicBuild)s=s.replace(/<section[^>]*data-video-placeholder>[\s\S]*?<\/section>/g,'');
 s=s.replace(/href="(?:\/|\.\/)?site\.html(#[^"]*)?"/g,(_,fragment)=>`href="/${fragment||''}"`);
 await writeFile(file,s);
}

if(publicBuild){
 await writeFile('dist/robots.txt','User-agent: *\nAllow: /\n\nSitemap: https://growth.optivuedigital.com/sitemap.xml\n');
}
