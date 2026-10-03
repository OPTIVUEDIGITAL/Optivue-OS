import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.mjs';
test('all Workers hostname depths and response types get noindex/nofollow', async()=>{
 for(const host of ['worker.workers.dev','preview.worker.account.workers.dev','worker.account.workers.dev']) {
  for(const status of [200,301,404]) {
   const response=await worker.fetch(new Request(`https://${host}/estimator`),{ASSETS:{fetch:async()=>new Response(null,{status,headers:{'X-Robots-Tag':'noindex'}})}});
   assert.equal(response.status,status);assert.equal(response.headers.get('X-Robots-Tag'),'noindex, nofollow');
  }
 }
});
test('production asset responses and estimator noindex pass through unchanged', async()=>{
 for(const [path,value] of [['/',null],['/estimator','noindex']]) {
  const original=new Response('page',{headers:value?{'X-Robots-Tag':value}:{}});
  const result=await worker.fetch(new Request('https://growth.optivuedigital.com'+path),{ASSETS:{fetch:async()=>original}});
  assert.equal(result,original);assert.equal(result.headers.get('X-Robots-Tag'),value);
 }
});
