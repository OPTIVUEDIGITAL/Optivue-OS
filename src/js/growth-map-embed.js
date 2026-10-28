(() => {
  const frame = document.getElementById('growth-map-frame');
  if (!frame) return;
  const app = document.getElementById('optivue-growth-os');
  let visible = false;
  const send = () => {
    frame.contentWindow?.postMessage({type:'optivue-map-theme',theme:app.dataset.theme},location.origin);
    frame.contentWindow?.postMessage({type:'optivue-map-visibility',visible:visible&&!document.hidden},location.origin);
  };
  frame.addEventListener('load',send);
  new MutationObserver(send).observe(app,{attributes:true,attributeFilter:['data-theme']});
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => {visible=entry.isIntersecting;send();}).observe(frame);
  else {visible=true;}
  document.addEventListener('visibilitychange',send);
  window.addEventListener('message',event => {
    if (event.origin!==location.origin || event.source!==frame.contentWindow || event.data?.type!=='optivue-map-size') return;
    const height=Number(event.data.height);
    if (!Number.isFinite(height)||height<200||height>15000) return;
    const pixels=Math.ceil(height)+'px';
    if(frame.style.height!==pixels) frame.style.height=pixels;
    frame.parentElement.classList.add('is-ready');
  });
})();
