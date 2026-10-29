import {build,transform} from 'esbuild';
import {readFile,writeFile,rm,mkdir,cp,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {extractCriticalCSS} from './critical-css.mjs';
import {ESTIMATOR_CONFIG} from '../src/js/estimator-config.js';
await import('./generate-legal.mjs');
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,10);
await rm('dist',{recursive:true,force:true});
await cp('src','dist',{recursive:true});
await rm('dist/config',{recursive:true,force:true});
await rm('dist/README.md',{force:true});
await rm('dist/js',{recursive:true,force:true});
await rm('dist/css',{recursive:true,force:true});
await mkdir('dist/css',{recursive:true});
await mkdir('dist/fingerprinted',{recursive:true});
// The hero gets content-addressed URLs. Original source assets remain available
// under /assets for compatibility, while fingerprinted copies are immutable.
const heroAssets=['hero-office-mobile-clean.webp','hero-office-desktop-clean.webp'];
const heroUrls={};
for(const name of heroAssets){
  const original=await readFile('dist/assets/'+name);
  const fingerprinted=name.replace('.webp','-'+hash(original)+'.webp');
  const url='/fingerprinted/'+fingerprinted;
  await writeFile('dist'+url,original);
  heroUrls['/assets/'+name]=url;
}
const tokens=JSON.parse(await readFile('src/design-tokens.json','utf8'));
const declarations=o=>Object.entries(o).map(([k,v])=>'--ovgo-'+k+':'+v+';').join('');
const generated=':root,#optivue-growth-os{'+declarations({...tokens.shared,...tokens.light})+'}:root[data-theme="dark"],#optivue-growth-os[data-theme="dark"]{'+declarations(tokens.dark)+'}';
const themeCSS=(await transform(generated,{loader:'css',minify:true})).code;
const themeFile='/css/theme-'+hash(themeCSS)+'.min.css';
await writeFile('dist'+themeFile,themeCSS);
const cssInputs=['optivue.css','optivue-v2.css','revamp.css','office-hero.css','brand.css','midnight-navy.css','legal-consent.css','packages.css','concept.css','bento.css','estimator-analysis.css'];
const cssSources=await Promise.all(cssInputs.map(f=>readFile('src/css/'+f,'utf8')));
const rawCss=generated+'\n'+cssSources.join('\n');
// Preserve cascade ordering in inline first-screen rules. The full sheet
// continues to style every route and noncritical component unchanged.
const criticalRaw=generated+'\n'+cssSources.map(extractCriticalCSS).join('\n');
const criticalCss=(await transform(criticalRaw,{loader:'css',minify:true,target:'es2020'})).code;
const themeInit=(await transform(await readFile('src/js/theme-init.js','utf8'),{loader:'js',minify:true,target:'es2020'})).code;
const css=(await transform(rawCss,{loader:'css',minify:true,target:'es2020'})).code;
const cssFile='/css/site-'+hash(css)+'.min.css';
await writeFile('dist'+cssFile,css);
const entries={app:'src/js/optivue.js',spotlight:'src/js/components/spotlight-card.js',ga4:'src/js/ga4.js',map:'src/js/map.js',embed:'src/js/growth-map-embed.js',theme:'src/js/theme-init.js'};
const result=await build({entryPoints:entries,bundle:true,splitting:true,format:'esm',outdir:'dist/js',entryNames:'[name]-[hash].min',chunkNames:'chunk-[hash].min',minify:true,target:'es2020',metafile:true,legalComments:'none'});
const outputFor=entry=>'/'+Object.entries(result.metafile.outputs).find(([,v])=>v.entryPoint===entry)[0].replace(/^dist\//,'');
const mapping={
'js/theme-init.js':outputFor(entries.theme),
'js/optivue.js':outputFor(entries.app),
'js/components/spotlight-card.js':outputFor(entries.spotlight),
'js/growth-map-embed.js':outputFor(entries.embed),
'js/map.js':outputFor(entries.map),
'js/ga4.js':outputFor(entries.ga4)
};
async function files(dir){const r=[];for(const e of await readdir(dir,{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())r.push(...await files(f));else r.push(f);}return r;}
let inlineBytesBefore=0,inlineBytesAfter=0;
for(const file of (await files('dist')).filter(f=>f.endsWith('.html'))){
 let html=await readFile(file,'utf8'),inserted=false;
 const isHomepage=file==='dist/index.html'||file==='dist/site.html';
 for(const [before,after] of Object.entries(heroUrls))html=html.replaceAll(before,after);
 html=html.replace(/(<span data-package-(amount|monthly)="(\w+)">)[^<]*(<\/span>)/g,(_,open,type,key,close)=>open+ESTIMATOR_CONFIG.prices[key][type==='amount'?'amount':'monthlyAmount']+close);
 html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,tag=>{
  if(tag.includes('theme.generated.css'))return '<link rel="stylesheet" href="'+themeFile+'">';
  if(!/css\//.test(tag))return tag;
  if(inserted)return '';inserted=true;return '<link rel="stylesheet" href="'+cssFile+'">';
 });
 html=html.replace(/<script([^>]*?)src="([^"]+)"([^>]*)><\/script>/g,(tag,before,url,after)=>{
  const key=url.replace(/^(\.\.\/|\.\/|\/)+/,'');
  if(mapping[key])return '<script'+before+'src="'+mapping[key]+'"'+after+'></script>';
  return tag;
 });
 // Eliminate the 1KB render-blocking theme request on the homepage while
 // preserving the identical early theme initialization logic.
 if(isHomepage){
  const cssLink='<link rel="stylesheet" href="'+cssFile+'">';
  if(!html.includes(cssLink))throw new Error('Expected homepage CSS link: '+file);
  html=html.replace(cssLink,
   '<style data-critical-hero>'+criticalCss+'</style>'+
   '<link rel="stylesheet" href="'+cssFile+'" media="(min-width:768px)" onload="this.media=\'all\'">'+
   '<noscript><link rel="stylesheet" href="'+cssFile+'"></noscript>');
  const originalTheme='<script src="'+mapping['js/theme-init.js']+'"></script>';
  if(!html.includes(originalTheme))throw new Error('Expected theme script: '+file);
  html=html.replace(originalTheme,'<script>'+themeInit+'</script>');
 }
 // GA4 is an ES module. Consent and URL cleanup precede tag initialization.
 // esbuild emits no exports for these three entrypoints, so their existing script mode is safe.
 const styleMatches=[...html.matchAll(/<style>([\s\S]*?)<\/style>/g)];
 for(const m of styleMatches){const code=(await transform(m[1],{loader:'css',minify:true,target:'es2020'})).code;inlineBytesBefore+=Buffer.byteLength(m[1]);inlineBytesAfter+=Buffer.byteLength(code);html=html.replace(m[0],'<style>'+code+'</style>');}
 const scriptMatches=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 for(const m of scriptMatches){const code=(await transform(m[1],{loader:'js',minify:true,target:'es2020'})).code;inlineBytesBefore+=Buffer.byteLength(m[1]);inlineBytesAfter+=Buffer.byteLength(code);html=html.replace(m[0],'<script>'+code+'</script>');}
 await writeFile(file,html);
}
await import('./finalize-metadata.mjs');
let headers=await readFile('src/_headers','utf8');
if(process.env.SITE_TARGET==='production')headers=headers.replace('  X-Robots-Tag: noindex, nofollow\n','');
await writeFile('dist/_headers',headers+'\n/fingerprinted/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/css/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/js/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/assets/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n');
const outputs=Object.keys(result.metafile.outputs);
const js=await Promise.all(outputs.map(f=>readFile(f)));
const report={css:{beforeBytes:Buffer.byteLength(rawCss),minifiedBytes:Buffer.byteLength(css),gzipBytes:gzipSync(css).length,criticalBytes:Buffer.byteLength(criticalCss),criticalGzipBytes:gzipSync(criticalCss).length},javascript:{files:outputs.length,minifiedBytes:js.reduce((n,b)=>n+b.length,0),gzipBytes:js.reduce((n,b)=>n+gzipSync(b).length,0)},inline:{beforeBytes:inlineBytesBefore,minifiedBytes:inlineBytesAfter},entries:mapping};
await writeFile('build-report.json',JSON.stringify(report,null,2)+'\n');
await writeFile('build-meta.json',JSON.stringify(result.metafile,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
