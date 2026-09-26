import fs from 'node:fs';
import { renderFoundingHTML } from '../production/js/founding-program.js';
const path=new URL('../production/index.html',import.meta.url);
const html=fs.readFileSync(path,'utf8');
const output=renderFoundingHTML(html);
if(process.argv.includes('--check')) { if(output!==html)throw Error('Founding HTML differs from config/date. Run node scripts/build-founding.mjs'); }
else fs.writeFileSync(path,output);
