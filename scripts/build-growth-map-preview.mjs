import { mkdir, writeFile } from 'node:fs/promises';
import { GROWTH_MAP } from '../production/js/growth-map.data.js';
import { renderGrowthMap } from '../production/js/components/growth-map.js';
const destination=new URL('../production/preview/growth-map/',import.meta.url);
await mkdir(destination,{recursive:true});
await writeFile(new URL('index.html',destination),`<!doctype html>
<html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${GROWTH_MAP.pageTitle}</title><link rel="stylesheet" href="/css/tokens.generated.css"><link rel="stylesheet" href="/css/optivue.css"><link rel="stylesheet" href="/css/optivue-v2.css"><link rel="stylesheet" href="/css/growth-map.css"><script type="module" src="/js/growth-map-preview.js"></script></head><body><main id="optivue-growth-os" class="ovgo-app gm-preview" data-theme="dark"><p class="gm-internal">${GROWTH_MAP.internalPreview}</p>${renderGrowthMap()}</main></body></html>\n`);
console.log('Built production/preview/growth-map/index.html');
