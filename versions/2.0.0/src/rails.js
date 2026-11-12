(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.tile-carousel').forEach(carousel=>{
  const track=carousel.querySelector('.tile-track'),previous=carousel.querySelector('[data-previous]'),next=carousel.querySelector('[data-next]'),position=carousel.querySelector('[data-position]');
  const items=[...track.children];let pointer=null,dragging=false,suppressClick=false,queued=false;
  const itemStep=()=>items.length>1?items[1].offsetLeft-items[0].offsetLeft:track.clientWidth;
  function update(){queued=false;const max=Math.max(0,track.scrollWidth-track.clientWidth);previous.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft>=max-2;const first=Math.min(items.length,Math.floor((track.scrollLeft+2)/itemStep())+1),last=Math.min(items.length,Math.ceil((track.scrollLeft+track.clientWidth-5)/itemStep()));const pad=n=>n.toString().padStart(2,'0');position.textContent=first===last?`${pad(first)} / ${pad(items.length)}`:`${pad(first)}–${pad(last)} / ${pad(items.length)}`;carousel.classList.toggle('at-start',previous.disabled);carousel.classList.toggle('at-end',next.disabled);}
  function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
  function scrollTo(left){track.scrollTo({left,behavior:reduced.matches?'auto':'smooth'});}
  previous.addEventListener('click',()=>scrollTo(track.scrollLeft-itemStep()));next.addEventListener('click',()=>scrollTo(track.scrollLeft+itemStep()));
  track.addEventListener('scroll',schedule,{passive:true});
  track.addEventListener('keydown',e=>{if(e.target!==track)return;const moves={ArrowRight:track.scrollLeft+itemStep(),ArrowLeft:track.scrollLeft-itemStep(),Home:0,End:track.scrollWidth};if(e.key in moves){e.preventDefault();scrollTo(moves[e.key]);}});
  // Touch/trackpad movement remains native. Mouse users can drag the same rail.
  track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,left:track.scrollLeft};dragging=false;suppressClick=false;});
  track.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.x;if(!dragging){if(Math.abs(dx)<7||Math.abs(dx)<Math.abs(e.clientY-pointer.y))return;dragging=true;suppressClick=true;track.classList.add('is-dragging');track.setPointerCapture(pointer.id);}e.preventDefault();track.scrollLeft=pointer.left-dx;});
  function release(e){if(!pointer||e.pointerId!==pointer.id)return;const didDrag=dragging;pointer=null;dragging=false;track.classList.remove('is-dragging');if(track.hasPointerCapture(e.pointerId))track.releasePointerCapture(e.pointerId);if(didDrag)scrollTo(Math.round(track.scrollLeft/itemStep())*itemStep());}
  track.addEventListener('pointerup',release);track.addEventListener('pointercancel',release);track.addEventListener('pointerleave',e=>{if(pointer&&!dragging)pointer=null;});
  track.addEventListener('click',e=>{if(suppressClick){if(e.detail>0){e.preventDefault();e.stopImmediatePropagation();}suppressClick=false;}},true);
  // A keyboard-focused offscreen tile is brought into view without moving the page.
  track.addEventListener('focusin',e=>{const tile=items.find(item=>item.contains(e.target));if(!tile)return;const start=tile.offsetLeft-track.offsetLeft,end=start+tile.offsetWidth;if(start<track.scrollLeft)scrollTo(start);else if(end>track.scrollLeft+track.clientWidth)scrollTo(end-track.clientWidth);});
  new ResizeObserver(schedule).observe(track);track.querySelectorAll('img').forEach(img=>img.addEventListener('load',schedule,{once:true}));update();
 });
})();
