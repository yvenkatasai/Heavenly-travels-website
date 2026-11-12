const root=document.querySelector('[data-dot-field]'),canvas=root?.querySelector('canvas');
const ctx=canvas?.getContext('2d',{alpha:true});if(!root||!canvas||!ctx)return;
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)'),coarseQuery=matchMedia('(pointer: coarse)');
const noise=createNoise(7),size={width:0,height:0,color:'#eee3c9'};
const pointer={x:0,y:0,lastX:0,lastY:0,inside:false},shocks=[];
let field=createField(0,0,16),raf=0,last=0,lastDraw=0,lastTone=0,carry=0,time=0;
let awake=false,stirring=false,onScreen=false,visible=false,resizePending=true;
let qualityPenalty=0,slowFrames=0,lastQualityChange=0;
const stats={frames:0,physicsSteps:0,lastFrameMs:0,maxFrameMs:0,averageFrameMs:0,visible:false,animated:false,dots:0,spacing:16,dpr:1,shocks:0};
const mobile=()=>coarseQuery.matches||innerWidth<=767;
const lowPower=()=>navigator.connection?.saveData===true||(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4;
const allowed=()=>window.heavenlyMotionAllowed?.()!==false&&!motionQuery.matches;
function resetPhysics(){root.classList.remove('dot-awake');for(const key of ['ox','oy','vx','vy','ax','ay'])field[key].fill(0);shocks.length=0;pointer.inside=false;awake=false;stirring=false;carry=0;stats.shocks=0}
function resize(){const rect=root.getBoundingClientRect();size.width=rect.width;size.height=rect.height;
 const cap=mobile()?(lowPower()?1500:2600):(lowPower()?4500:8500);
 const gap=Math.max(mobile()?18:16,Math.ceil(Math.sqrt(size.width*size.height/cap)))+qualityPenalty;
 const dpr=Math.min(devicePixelRatio||1,mobile()?(lowPower()?1:1.25):1.5);
 canvas.width=Math.max(1,Math.round(size.width*dpr));canvas.height=Math.max(1,Math.round(size.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
 field=createField(size.width,size.height,gap);sampleTone(field,noise,time);resetPhysics();draw(ctx,field,size,false);
 stats.dots=field.cols*field.rows;stats.spacing=gap;stats.dpr=dpr;resizePending=false;
 canvas.style.opacity='1';root.dataset.dotFieldReady='true';
}
function physics(dt){const pushed=applyPointer(field,pointer,dt);carry=Math.min(carry+dt,STEP*6);
 while(carry>=STEP){carry-=STEP;for(const shock of shocks)shock.age+=STEP;while(shocks.length&&shocks[0].age>SHOCK_LIFE)shocks.shift();stirring=integrate(field,shocks,STEP);stats.physicsSteps++}
 if(!pushed&&!stirring&&!shocks.length)resetPhysics();stats.shocks=shocks.length;
}
function frame(now){raf=0;if(!visible||!allowed())return;
 if(resizePending)resize();
 const interval=awake?(mobile()&&lowPower()?1000/30:1000/60):(mobile()?1000/20:IDLE_FRAME_MS);
 if(now-lastDraw>=interval-.6){const begin=performance.now(),dt=last?Math.min((now-last)/1000,.05):0;last=now;time+=dt;
  const wasAwake=awake;if(awake)physics(dt);
  // The expensive noise sampling is independent of fast pointer animation.
  if(now-lastTone>=(mobile()?100:66)){sampleTone(field,noise,time);lastTone=now}
  draw(ctx,field,size,wasAwake);lastDraw=now;stats.frames++;
  const cost=performance.now()-begin;stats.lastFrameMs=cost;stats.maxFrameMs=Math.max(stats.maxFrameMs,cost);stats.averageFrameMs=stats.averageFrameMs?stats.averageFrameMs*.95+cost*.05:cost;
  slowFrames=cost>(mobile()?9:12)?slowFrames+1:Math.max(0,slowFrames-1);
  if(slowFrames>=8&&qualityPenalty<10&&now-lastQualityChange>2000){qualityPenalty+=2;resizePending=true;slowFrames=0;lastQualityChange=now}
 }
 raf=requestAnimationFrame(frame);
}
function start(){if(!raf&&visible&&allowed()){last=0;lastDraw=0;stats.animated=true;raf=requestAnimationFrame(frame)}}
function stop(){cancelAnimationFrame(raf);raf=0;last=0;stats.animated=false;pointer.inside=false}
function updateVisible(){visible=onScreen&&!document.hidden&&!document.documentElement.classList.contains('intro-playing');stats.visible=visible;
 if(visible&&allowed())start();else stop();
}
function updateMotion(){stop();resetPhysics();if(resizePending)resize();else draw(ctx,field,size,false);updateVisible()}
function local(event){const rect=root.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top}}
function isControl(event){return event.target instanceof Element&&event.target.closest('a,button,input,textarea,select,label,summary,[role="button"]')}
function wake(){root.classList.add('dot-awake');if(!awake){awake=true;carry=0;stirring=true}start()}
function onMove(event){if(!allowed()||!visible||isControl(event)||(event.pointerType==='touch'&&!pointer.inside))return;const p=local(event);
 if(!pointer.inside){pointer.lastX=p.x;pointer.lastY=p.y;pointer.inside=true}pointer.x=p.x;pointer.y=p.y;
 if(Math.abs(pointer.x-pointer.lastX)>.5||Math.abs(pointer.y-pointer.lastY)>.5)wake();
}
function onDown(event){if(!allowed()||!visible||event.button!==0||isControl(event))return;const p=local(event);Object.assign(pointer,p,{lastX:p.x,lastY:p.y,inside:true});
 shocks.push({...p,age:0});if(shocks.length>(mobile()?2:3))shocks.shift();stats.shocks=shocks.length;wake();
}
// Passive listeners preserve normal page scrolling, pinch zoom and button behavior.
root.addEventListener('pointermove',onMove,{passive:true});root.addEventListener('pointerdown',onDown,{passive:true});
root.addEventListener('pointerleave',()=>pointer.inside=false,{passive:true});root.addEventListener('pointercancel',()=>pointer.inside=false,{passive:true});root.addEventListener('pointerup',e=>{if(e.pointerType==='touch')pointer.inside=false},{passive:true});
const intersection=new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;updateVisible()});intersection.observe(root);
const resizeObserver=new ResizeObserver(()=>{resizePending=true;if(!raf){resize();updateVisible()}});resizeObserver.observe(root);
document.addEventListener('visibilitychange',updateVisible);window.addEventListener('motionchange',updateMotion);motionQuery.addEventListener('change',updateMotion);
window.addEventListener('resize',()=>{resizePending=true;updateVisible()},{passive:true});
// Start only after the intro has exposed the hero; opening curtains gets its own frame budget.
const introObserver=new MutationObserver(updateVisible);introObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
let dprQuery;function watchDpr(){dprQuery=matchMedia(`(resolution: ${devicePixelRatio}dppx)`);dprQuery.addEventListener('change',()=>{resizePending=true;if(!raf)resize();watchDpr()},{once:true})}watchDpr();
resize();
// Read-only diagnostics let local QA measure work, pause behavior and numeric stability.
Object.defineProperty(root,'dotFieldStats',{get:()=>({...stats,awake,offsetMax:field.ox.reduce((m,v)=>Math.max(m,Math.abs(v)),0),finite:field.ox.every(Number.isFinite)&&field.oy.every(Number.isFinite),motionAllowed:allowed()})});
window.addEventListener('pagehide',()=>{stop();intersection.disconnect();resizeObserver.disconnect();introObserver.disconnect()},{once:true});
window.addEventListener('pageshow',e=>{if(e.persisted){intersection.observe(root);resizeObserver.observe(root);introObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});updateVisible()}});
