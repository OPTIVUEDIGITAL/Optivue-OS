import {cp,rm} from 'node:fs/promises';
process.env.SITE_TARGET='production';
await import('./build.mjs');
await rm('production',{recursive:true,force:true});
await cp('dist','production',{recursive:true});
