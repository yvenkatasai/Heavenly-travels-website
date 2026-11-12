// Continuous native playback: no scroll seeking, canvas swaps, or frame requests.
(() => {
 const film=document.querySelector('#hero-film');
 const hero=document.querySelector('#home');
 const toggle=document.querySelector('#motion-toggle');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=preference.matches||navigator.connection?.saveData===true;
 let inView=true,playRequest=null;
 const shouldPlay=()=>!paused&&!preference.matches&&inView&&!document.hidden;
 function playback(){
  if(!shouldPlay()){film.pause();return;}
  if(!film.getAttribute('src'))film.src=matchMedia('(max-width:700px)').matches?film.dataset.mobile:film.dataset.desktop;
  if(film.paused&&!playRequest){
   playRequest=film.play();
   if(playRequest&&typeof playRequest.catch==='function')playRequest.catch(()=>{if(shouldPlay()){paused=true;updateControl();}}).finally(()=>{playRequest=null;});
  }
 }
 function updateControl(){
  toggle.disabled=preference.matches;
  toggle.setAttribute('aria-pressed',String(paused));
  const label=preference.matches?'Still image':paused?'Play video':'Pause video';
  toggle.setAttribute('aria-label',preference.matches?'Background video disabled by your reduced-motion preference':label);
  toggle.replaceChildren(document.createTextNode(label+' '));
  const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.textContent=paused?'▷':'Ⅱ';toggle.append(icon);
 }
 film.addEventListener('playing',()=>{if(shouldPlay())film.classList.add('is-playing');else film.pause();});
 film.addEventListener('error',()=>{film.classList.remove('is-playing');paused=true;updateControl();});
 toggle.addEventListener('click',()=>{paused=!paused;updateControl();playback();});
 preference.addEventListener('change',()=>{paused=preference.matches;if(preference.matches)film.classList.remove('is-playing');updateControl();playback();});
 document.addEventListener('visibilitychange',playback);
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;playback();},{threshold:0}).observe(hero);
 updateControl();playback();


 const scene=hero,panel=scene.querySelector('.hero'),header=document.querySelector('.site-header');
 let scrollFrame=0;
 function scenePosition(){
  scrollFrame=0;const rect=scene.getBoundingClientRect();
  const progress=preference.matches?0:Math.max(0,Math.min(1,-rect.top/Math.max(1,scene.offsetHeight-panel.offsetHeight)));
  panel.style.setProperty('--scene-progress',progress);
  header.classList.toggle('is-solid',rect.bottom<100);
  document.body.classList.toggle('has-scrolled',scrollY>innerHeight*.75);
 }
 function scheduleScene(){if(!scrollFrame)scrollFrame=requestAnimationFrame(scenePosition);}
 addEventListener('scroll',scheduleScene,{passive:true});addEventListener('resize',scheduleScene);scenePosition();

 const menu=document.querySelector('#site-menu'),menuButton=document.querySelector('#menu-toggle');
 function closeMenu(){menu.close();document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');}
 menuButton.addEventListener('click',()=>{menu.showModal();document.body.classList.add('menu-open');menuButton.setAttribute('aria-expanded','true');});
 document.querySelector('#menu-close').addEventListener('click',closeMenu);
 menu.addEventListener('close',()=>{document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');});
 menu.addEventListener('click',event=>{if(event.target.closest('a[href^="#"]'))closeMenu();});

 const thumbnails=[...document.querySelectorAll('[data-landscape]')];
 const viewer=document.querySelector('#landscape-dialog'),large=document.querySelector('#landscape-large');
 let landscapeIndex=0;
 function showLandscape(index){
  landscapeIndex=(index+thumbnails.length)%thumbnails.length;
  const item=thumbnails[landscapeIndex],image=item.querySelector('img');
  large.src=image.src;large.alt=image.alt;
  document.querySelector('#landscape-caption').textContent=item.querySelector('span').textContent;
  document.querySelector('#landscape-count').textContent=`${landscapeIndex+1} / ${thumbnails.length}`;
 }
 thumbnails.forEach((button,index)=>button.addEventListener('click',()=>{showLandscape(index);viewer.showModal();}));
 document.querySelector('#landscape-close').addEventListener('click',()=>viewer.close());
 document.querySelector('#landscape-prev').addEventListener('click',()=>showLandscape(landscapeIndex-1));
 document.querySelector('#landscape-next').addEventListener('click',()=>showLandscape(landscapeIndex+1));
 viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showLandscape(landscapeIndex-1);}if(event.key==='ArrowRight'){event.preventDefault();showLandscape(landscapeIndex+1);}});
})();
