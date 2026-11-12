// Lightweight breeze interaction, scoped exclusively to decorative petals.
(() => {
 const hero=document.querySelector('.hero');
 const layer=hero?.querySelector('.hero-petals');
 if(!layer)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0, x=0, y=0;
 const reset=()=>{cancelAnimationFrame(frame);frame=0;layer.style.setProperty('--petal-hand','0px');layer.style.setProperty('--petal-hand-y','0px');};
 const draw=()=>{frame=0;if(preference.matches||document.hidden)return;
  const r=hero.getBoundingClientRect();
  layer.style.setProperty('--petal-hand',`${Math.max(-28,Math.min(28,(x-r.left-r.width/2)*.07))}px`);
  layer.style.setProperty('--petal-hand-y',`${Math.max(-12,Math.min(12,(y-r.top-r.height/2)*.035))}px`);
 };
 const move=e=>{if(preference.matches||e.target.closest('a,button,input,select,textarea'))return;x=e.clientX;y=e.clientY;if(!frame)frame=requestAnimationFrame(draw);};
 hero.addEventListener('pointermove',move,{passive:true});
 hero.addEventListener('pointerdown',move,{passive:true});
 hero.addEventListener('pointerleave',reset,{passive:true});
 hero.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')reset();},{passive:true});
 hero.addEventListener('pointercancel',reset,{passive:true});
 preference.addEventListener('change',reset);
 document.addEventListener('visibilitychange',()=>{layer.style.visibility=document.hidden?'hidden':'';if(document.hidden)reset();});
})();
