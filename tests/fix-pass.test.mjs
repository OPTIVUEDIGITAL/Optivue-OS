import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { ESTIMATOR_CONFIG } from '../production/js/estimator-config.js';
const read = p => fs.readFileSync(new URL(`../production/${p}`, import.meta.url), 'utf8');
const html = read('index.html');
test('three pricing cards and the care note contain static prices matching shared config', () => {
  assert.equal((html.match(/data-price-card\b/g)||[]).length, 3);
  for (const [key, price] of Object.entries(ESTIMATOR_CONFIG.prices)) {
    const match = html.match(new RegExp(`data-price-key="${key}"[^>]*>([^<]+)<`));
    assert.equal(match?.[1].toLowerCase(), price.display.toLowerCase(), `${key} needs a static price`);
  }
  assert.ok(html.includes('from $350/month'));
  assert.doesNotMatch(html, /<optivue-spotlight-card[^>]*>\s*<div class="ovgo-price-card__content"/);
});
test('public HTML contains no unresolved placeholders or unapproved client names', () => {
  assert.doesNotMatch(html, /\[CONFIRM|Revive Medical|Ideal Spine|LearnX by CJB/);
});
test('one stage section contains useful static detail', () => {
  assert.equal((html.match(/id="systems"/g)||[]).length, 1);
  assert.match(html, /data-stage-purpose>[^<]+<\/p>/);
  assert.match(html, /data-stage-capabilities><li>/);
});
function sliderHarness(attrs = {}) {
  let Slider;
  const frameEvents = {}, handleEvents = {}, values = {};
  const handle = {setAttribute:(k,v)=>values[k]=v, getAttribute:k=>values[k], addEventListener:(k,f)=>handleEvents[k]=f, focus(){}};
  const frame = {getBoundingClientRect:()=>({left:100,width:400}),addEventListener:(k,f)=>frameEvents[k]=f,setPointerCapture(){},releasePointerCapture(){}};
  class Element { getAttribute(k){return attrs[k]??null;} style={setProperty(){}}; shadowRoot={querySelector:s=>s==='.frame'?frame:handle}; }
  vm.runInNewContext(read('js/components/compare-slider.js'), {HTMLElement:Element,customElements:{get:()=>false,define:(name,cls)=>Slider=cls}});
  const slider = new Slider(); slider.setPosition(slider.initialPosition()); slider.bind();
  return {slider,frameEvents,handleEvents,values};
}
test('comparison defaults to 50 and honors explicit 35', () => {
  assert.equal(sliderHarness().slider.initialPosition(),50);
  assert.equal(sliderHarness({start:'35'}).slider.initialPosition(),35);
});
test('slider preserves grab offset and supports keyboard and pointer cancel', () => {
  const h=sliderHarness({start:'35'});
  const event={clientX:247,pointerId:1,button:0,preventDefault(){}};
  h.frameEvents.pointerdown(event);
  assert.equal(h.values['aria-valuenow'],'35');
  h.frameEvents.pointermove({...event,clientX:287});
  assert.equal(h.values['aria-valuenow'],'45');
  h.frameEvents.pointercancel(event);
  h.frameEvents.pointermove({...event,clientX:387});
  assert.equal(h.values['aria-valuenow'],'45');
  h.handleEvents.keydown({key:'ArrowRight',preventDefault(){}});
  assert.equal(h.values['aria-valuenow'],'50');
});

test('a missing or throwing IntersectionObserver does not abort page setup', () => {
  const source = read('js/optivue.js').replace(/^import .*;\n/gm, '');
  for (const observer of [undefined, class { constructor() { throw new Error('unavailable'); } }]) {
    const element={classList:{add(){},toggle(){}},setAttribute(){}};
    const context={document:{getElementById:()=>null},window:{matchMedia:()=>({matches:false})},IntersectionObserver:observer,testRoot:{querySelector:()=>element,querySelectorAll:()=>[element]}};
    assert.doesNotThrow(()=>vm.runInNewContext(source+'\ninitReveal(testRoot); initMobileCta(testRoot);',context));
  }
});

test('About uses the approved portrait pair with no image tags or process strip', () => {
  const about = html.match(/<section id="about"[\s\S]*?<\/section>/)[0];
  assert.match(about, /start="50" ratio="portrait-45" labels="hidden"/);
  assert.match(about, /slot="before" src="\.\/assets\/rahmel-dela-cruz\.webp"/);
  assert.match(about, /slot="after" src="\.\/assets\/rahmel-working-after\.webp"/);
  assert.doesNotMatch(about, /rahmel-candid-before|class="ovgo-process"/);
  assert.match(about, /Rahmel Dela Cruz · Founder, Optivue Digital/);
});

test('Reporting preserves approved labels, start and caption', () => {
  const reporting = html.match(/<section id="reporting"[\s\S]*?<\/section>/)[0];
  assert.match(reporting, /start="35" label-before="No tracking" label-after="Tracked"/);
  assert.match(reporting, /<figcaption>Illustrative tracking view\.<\/figcaption>/);
  assert.match(reporting, /Tracking changes what the report can prove\./);
  assert.doesNotMatch(reporting, /Starts at 35/);
});

 test('pricing offers one booking action and ownership follows the audience section', () => {
  const pricing = html.slice(html.indexOf('<section id="pricing"'), html.indexOf('<section id="fit"'));
  assert.equal((pricing.match(/data-ovgo-booking/g) || []).length, 1);
  assert.match(pricing, /Request a Diagnostic/);
  assert.match(pricing, /Starts after your Diagnostic/);
  assert.match(pricing, /Starts after your Foundation Launch/);
  assert.doesNotMatch(pricing, /ovgo-value-grid|Who controls your systems/);
  assert.match(html, /<\/section>\s*<section id="ownership"/);
  assert.match(html, /Find your gaps in 90 seconds →<\/a><\/p><\/section>\s*<section id="ownership"/);
  assert.equal((html.match(/id="ownership"/g) || []).length, 1);
  assert.doesNotMatch(html, /Who controls your systems\?/);
  assert.match(html, /Renting \(many agency sub-account setups\)/);
  assert.match(html, /workflows often stay behind/);
  assert.ok(html.indexOf('id="ownership"') < html.indexOf('id="how-it-works"'));

});
test('optional Diagnostic policies default off and each flag controls its own statement', () => {
  const config = read('js/runtime-config.js');
  assert.match(config, /diagnosticCreditEnabled: false/);
  assert.match(config, /diagnosticGuaranteeEnabled: false/);
  assert.doesNotMatch(html, /Your Diagnostic fee is credited|I'll refund it/);
  const source = read('js/optivue.js').replace(/^import .*;\n/gm, '');
  for (const credit of [false, true]) for (const guarantee of [false, true]) {
    const paragraphs = [];
    const container = { hidden: false, replaceChildren(){paragraphs.length=0;}, append(p){paragraphs.push(p.textContent);} };
    vm.runInNewContext(source + '\ninitPricingPolicies(testRoot, config);', {
      document: { getElementById:()=>null, createElement:()=>({textContent:''}) },
      testRoot: {querySelector:()=>container},
      config: {diagnosticCreditEnabled:credit,diagnosticGuaranteeEnabled:guarantee},
    });
    assert.equal(container.hidden, !(credit || guarantee));
    assert.equal(paragraphs.length, Number(credit)+Number(guarantee));
    assert.equal(paragraphs.some(p=>p.includes('credited')), credit);
    assert.equal(paragraphs.some(p=>p.includes('refund')), guarantee);
  }
});
