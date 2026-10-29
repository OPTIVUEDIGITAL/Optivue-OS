// Extract first-viewport styling from existing source CSS without changing the cascade.
// The full stylesheet loads afterward and remains authoritative for the entire page.
const firstScreen = /(?:\boffice-|\bovgo-hero|\bovgo-header|\bovgo-brand|\bovgo-nav|\bovgo-icon-btn|\bovgo-menu-btn|\bovgo-mobile-menu|\bovgo-btn|\bovgo-actions|\bovgo-microcopy|\bovgo-sr-only|\bdata-hero|\bovgo-kicker)/;
function isCriticalSelector(selector) {
  if (firstScreen.test(selector)) return true;
  return selector.split(',').some(part => {
    const s=part.trim();
    return /^(?:html|body|:root)(?=$|[\s.#:\[])/.test(s)
      || /^#optivue-growth-os(?:\[data-theme=(?:"|')?(?:dark|light)(?:"|')?\])?$/.test(s)
      || /^#optivue-growth-os\s*(?:\*,|\*::before|\*::after|h[1-6])(?:[\s,:]|$)/.test(s)
      || /^(?:button|input|select|textarea|a)(?:,|$)/.test(s);
  });
}

// Brace-balanced parser preserves media conditions and declaration order.
// The inputs are first-party, compiled CSS files, not untrusted user content.
export function extractCriticalCSS(source) {
  const css=source.replace(/\/\*[\s\S]*?\*\//g,'');
  let cursor=0;
  const parse=scope=>{
    let output='';
    while(cursor<scope.length){
      while(/\s/.test(scope[cursor]||''))cursor++;
      const start=cursor;
      let quote=null,round=0;
      while(cursor<scope.length){
        const ch=scope[cursor];
        if(quote){if(ch==='\\'){cursor+=2;continue;}if(ch===quote)quote=null;cursor++;continue;}
        if(ch==='"'||ch==="'"){quote=ch;cursor++;continue;}
        if(ch==='(')round++;
        if(ch===')')round--;
        if(!round&&(ch==='{'||ch==='}'||ch===';'))break;
        cursor++;
      }
      const prelude=scope.slice(start,cursor).trim(),delimiter=scope[cursor++];
      if(delimiter==='}')break;
      if(delimiter===';')continue;
      if(delimiter!=='{')break;
      const bodyStart=cursor;
      let depth=1;quote=null;
      while(cursor<scope.length&&depth){
        const ch=scope[cursor];
        if(quote){if(ch==='\\'){cursor+=2;continue;}if(ch===quote)quote=null;cursor++;continue;}
        if(ch==='"'||ch==="'"){quote=ch;cursor++;continue;}
        if(ch==='{')depth++;
        if(ch==='}')depth--;
        cursor++;
      }
      if(depth)throw new Error('Unbalanced CSS: '+prelude);
      const body=scope.slice(bodyStart,cursor-1);
      if(/^@(?:media|supports|container)\b/.test(prelude)){
        const child=extractCriticalCSS(body);
        if(child)output+=prelude+'{'+child+'}';
      } else if(/^@font-face\b/.test(prelude)
        || /^@keyframes\s+ovgo-hero/.test(prelude)
        || (!prelude.startsWith('@')&&isCriticalSelector(prelude))){
        output+=prelude+'{'+body+'}';
      }
    }
    return output;
  };
  return parse(css);
}
