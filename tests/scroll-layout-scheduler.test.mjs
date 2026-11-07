import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source=ts.transpileModule(fs.readFileSync(new URL('../src/mobile/scroll-layout-scheduler.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function fixture(){
 let now=0,id=0;const tasks=new Map();
 const schedule=(callback,delay)=>{tasks.set(++id,{at:now+delay,callback});return id;};
 const window=new EventTarget(),document=new EventTarget(),exports={};
 window.setTimeout=(fn,delay)=>schedule(fn,delay);
 vm.runInNewContext(source,{exports,window,document,performance:{now:()=>now},requestAnimationFrame:fn=>schedule(fn,16),cancelAnimationFrame:id=>tasks.delete(id),clearTimeout:id=>tasks.delete(id)});
 return {api:exports,window,document,tick(ms){const end=now+ms;for(;;){const next=[...tasks].filter(([,t])=>t.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;tasks.delete(next[0]);now=next[1].at;next[1].callback();}now=end;},event(target,type,touches=0){const e=new Event(type);Object.defineProperty(e,'touches',{value:Array(touches).fill({})});target.dispatchEvent(e);}};
}

test('layout waits for native touch end even after pointercancel and a stationary hold',()=>{
 const f=fixture();let layouts=0;const scheduler=f.api.createScrollLayoutScheduler(()=>layouts++);
 f.event(f.document,'touchstart',1);scheduler.request();
 f.event(f.document,'pointercancel'); // Native pan takes over from Pointer Events.
 for(let i=0;i<24;i++){scheduler.request();f.tick(35);}
 assert.equal(layouts,0);
 f.event(f.document,'touchend');f.tick(199);assert.equal(layouts,0);
 f.tick(1);assert.equal(layouts,1);scheduler.dispose();
});

test('momentum scroll defers the coalesced geometry rebuild until the viewport settles',()=>{
 const f=fixture();let layouts=0;const scheduler=f.api.createScrollLayoutScheduler(()=>layouts++);
 f.event(f.document,'touchstart',1);scheduler.request();f.event(f.document,'touchend');
 for(let i=0;i<8;i++){f.tick(90);f.event(f.window,'scroll');scheduler.request();}
 assert.equal(layouts,0);f.tick(199);assert.equal(layouts,0);f.tick(1);assert.equal(layouts,1);
 scheduler.dispose();
});

test('multi-touch remains guarded and disposal removes queued work',()=>{
 const f=fixture();let layouts=0;const scheduler=f.api.createScrollLayoutScheduler(()=>layouts++);
 f.event(f.document,'touchstart',2);scheduler.request();f.event(f.document,'touchend',1);f.tick(400);assert.equal(layouts,0);
 f.event(f.document,'touchend');scheduler.dispose();f.tick(400);assert.equal(layouts,0);
});

test('manual horizontal offset joins vertical travel continuously and reaches both ends',()=>{
 const {railProgress}=fixture().api;
 for(const natural of [0,150,400,999,1000])for(const progress of [0,100,700,1000]){
  const anchor={natural,progress};assert.equal(railProgress(natural,1000,anchor),progress);
  if(natural>0)assert.equal(railProgress(0,1000,anchor),0);
  if(natural<1000)assert.equal(railProgress(1000,1000,anchor),1000);
  let previous=-1;for(let n=0;n<=1000;n++){const value=railProgress(n,1000,anchor);assert(value>=previous);assert(value>=0&&value<=1000);previous=value;}
 }
 assert.equal(railProgress(-10,1000),0);assert.equal(railProgress(1100,1000),1000);
});
