import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const title = 'Optivue Growth OS | Own Your Marketing. Book More Visits';
const description = 'For health, wellness and aesthetics clinics. Stop renting your marketing. Own your ad accounts, CRM and follow-up. Track leads from click to booking.';
const load = p => readFile(new URL('../../' + p, import.meta.url), 'utf8');

test('source and built homepage share ownership-first SEO and social metadata', async () => {
  assert.ok(title.length <= 60);
  assert.ok(description.length <= 160);
  for (const path of ['src/index.html', 'src/site.html', 'dist/index.html']) {
    const html = await load(path);
    assert.ok(html.includes('<title>' + title + '</title>'), path + ' title');
    assert.ok(html.includes('name="description" content="' + description + '"'), path + ' description');
    assert.ok(html.includes('property="og:title" content="' + title + '"'), path + ' OG title');
    assert.ok(html.includes('property="og:description" content="' + description + '"'), path + ' OG description');
    assert.ok(html.includes('name="twitter:description" content="' + description + '"'), path + ' Twitter description');
    assert.ok(html.includes('rel="canonical" href="https://growth.optivuedigital.com/"'), path + ' canonical');
  }
});

test('homepage adds skip-to-content navigation without changing hero asset priority', async () => {
  for (const path of ['src/index.html', 'src/site.html', 'dist/index.html']) {
    const html = await load(path);
    assert.ok(html.includes('class="ovgo-skip-link" href="#main-content"'), path + ' skip link');
    assert.ok(html.includes('<main id="main-content" tabindex="-1">'), path + ' main landmark');
    assert.match(html, /hero-office-mobile-clean(?:-[a-f0-9]{10})?\.webp/, path + ' mobile image');
    assert.ok(html.includes('fetchpriority="high"'), path + ' hero priority');
    if(path.startsWith('dist/')){
      assert.ok(html.includes('data-critical-hero'), 'critical CSS should be inline');
      assert.ok(html.includes('media="print" onload="this.media=\'all\'"'), 'below-fold CSS should load asynchronously');
      assert.ok(/\/fingerprinted\/hero-office-mobile-clean-[a-f0-9]{10}\.webp/.test(html), 'hashed hero image');
    }
    assert.ok(html.includes('id="growth-map-frame"'), path + ' map');
    assert.ok(/id="growth-map-frame"[^>]+loading="lazy"/.test(html), path + ' map lazy load');
  }
});

const luminosity = hex => {
  const channels=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255);
  const rgb=channels.map(n=>n<=0.04045?n/12.92:((n+0.055)/1.055)**2.4);
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
};
const contrast=(a,b)=>{
  const x=luminosity(a),y=luminosity(b);
  return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
};

test('bento labels use full-strength theme tokens with WCAG AA contrast', async () => {
  const tokens=JSON.parse(await load('src/design-tokens.json'));
  const bento=await load('src/css/bento.css');
  const brand=await load('src/css/brand.css');
  assert.match(bento, /#systems \.bento-index \{ color:var\(--bento-muted\)/);
  assert.doesNotMatch(bento, /bento-muted\) 64%,transparent/);
  assert.match(brand, /\.ovgo-skip-link:focus-visible/);
  for(const theme of ['light','dark']){
    const palette=tokens[theme];
    assert.ok(contrast(palette.muted,palette.surface)>=4.5,theme+' muted on surface');
    assert.ok(contrast(palette.text,palette.bg)>=4.5,theme+' text on background');
  }
});
