(()=>{'use strict';
const intro=document.getElementById('brand-intro');if(!intro)return;
const preference=matchMedia('(prefers-reduced-motion: reduce)'),key='heavenly-brand-welcome-v1';
let seen=false;try{seen=sessionStorage.getItem(key)==='seen'}catch{}
// Deep links and return visits go straight to the requested content.
if(seen||preference.matches||location.hash)return;
let finished=false,timer;const originalFocus=document.activeElement;
function finish(){if(finished)return;finished=true;clearTimeout(timer);intro.hidden=true;document.documentElement.classList.remove('intro-playing');document.removeEventListener('keydown',onKey);preference.removeEventListener('change',onPreference);if(intro.contains(document.activeElement))originalFocus?.focus({preventScroll:true});window.dispatchEvent(new Event('resize'))}
function onKey(e){if(e.key==='Escape')finish()}
function onPreference(e){if(e.matches)finish()}
try{sessionStorage.setItem(key,'seen')}catch{}
intro.hidden=false;document.documentElement.classList.add('intro-playing');
document.getElementById('skip-intro').addEventListener('click',finish);
document.addEventListener('keydown',onKey);preference.addEventListener('change',onPreference);
intro.addEventListener('animationend',e=>{if(e.animationName==='curtain-open-right')finish()});
// The independent timer also clears the overlay if CSS animations fail or pause.
timer=setTimeout(finish,2550);
})();
