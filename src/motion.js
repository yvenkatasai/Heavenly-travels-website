(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!window.gsap||!window.ScrollTrigger||reduced.matches)return;
 gsap.registerPlugin(ScrollTrigger);
 const fine=matchMedia('(pointer:fine)').matches;
 if(window.Lenis&&fine&&innerWidth>760){const lenis=new Lenis({duration:1.1,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true,syncTouch:false});window.heavenlyLenis=lenis;lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
 document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',e=>{const id=link.getAttribute('href');if(id.length<2)return;const target=document.querySelector(id);if(!target)return;if(window.heavenlyLenis){e.preventDefault();window.heavenlyLenis.scrollTo(target,{duration:1.25});history.replaceState(null,'',id);}}));
 // The original text remains a single accessible label while visual words animate.
 document.querySelectorAll('.split').forEach(el=>{el.setAttribute('aria-label',el.innerText.replace(/\s+/g,' ').trim());function split(node){[...node.childNodes].forEach(child=>{if(child.nodeType===3){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.appendChild(document.createTextNode(word));else{const span=document.createElement('span');span.className='w';span.setAttribute('aria-hidden','true');span.textContent=word;fragment.appendChild(span);}});child.replaceWith(fragment);}else if(child.nodeType===1&&child.tagName!=='BR')split(child);});}split(el);});
 // Short, non-blocking introduction: links and native scrolling stay available.
 document.body.classList.add('intro-running');
 const intro=gsap.timeline({onComplete:()=>{document.body.classList.remove('intro-running');gsap.set('#app',{clearProps:'transform,borderRadius'});ScrollTrigger.refresh();}});
 intro.fromTo('#app',{scale:.96,borderRadius:24},{scale:1,borderRadius:0,duration:1.2,ease:'expo.inOut'})
 .from('.nav',{opacity:0,y:-15,duration:.65,ease:'power3.out'},.35)
 .from('#heroTitle .w',{opacity:0,y:25,filter:'blur(7px)',duration:.85,stagger:.055,ease:'power3.out'},.45)
 .from('.hero-label,.hero-title>p,.hero-buttons',{opacity:0,y:12,duration:.7,stagger:.1,ease:'power3.out'},.6)
 .from('.cloud-left',{x:-70,opacity:0,duration:1.5,ease:'power3.out'},.15)
 .from('.cloud-right',{x:70,opacity:0,duration:1.5,ease:'power3.out'},.15);
 gsap.to('.hero-title',{yPercent:-16,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
 gsap.to('.cloud-left',{y:-75,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
 gsap.to('.cloud-right',{y:-100,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
 document.querySelectorAll('.section-head .split,.enquiry-copy .split').forEach(el=>gsap.from(el.querySelectorAll('.w'),{opacity:0,y:21,filter:'blur(5px)',duration:.75,stagger:.045,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
 document.querySelectorAll('.confidence-strip,.tour-match,.fleet-heading,.fleet-grid,.group-note,.journey-steps,.questions').forEach(el=>gsap.from(el,{opacity:0,y:23,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
 gsap.from('.package-grid',{opacity:0,y:35,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.package-grid',start:'top 86%',once:true}});
 gsap.fromTo('.cta-scenery img',{yPercent:-7},{yPercent:0,ease:'none',scrollTrigger:{trigger:'#enquiry',start:'top bottom',end:'bottom bottom',scrub:1}});
 gsap.from('.cta-card',{opacity:0,y:45,scale:.98,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.cta-card',start:'top 88%',once:true}});
 const ring=document.querySelector('#fRing'),mark=document.querySelector('#fMark');const r=ring.getTotalLength(),m=mark.getTotalLength();gsap.set(ring,{strokeDasharray:r,strokeDashoffset:r});gsap.set(mark,{strokeDasharray:m,strokeDashoffset:m});gsap.timeline({scrollTrigger:{trigger:'#footer',start:'top 93%',once:true}}).to(mark,{strokeDashoffset:0,duration:1,ease:'power2.inOut'}).to(ring,{strokeDashoffset:0,duration:1.1,ease:'power2.inOut'},.35);
 // Pause CSS atmospheric motion offscreen, and leave the page static when hidden.
 const heroObserver=new IntersectionObserver(([entry])=>document.querySelector('#hero').classList.toggle('motion-paused',!entry.isIntersecting));heroObserver.observe(document.querySelector('#hero'));
 document.addEventListener('visibilitychange',()=>document.body.classList.toggle('motion-paused',document.hidden));
 addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
 reduced.addEventListener('change',()=>location.reload());
})();
