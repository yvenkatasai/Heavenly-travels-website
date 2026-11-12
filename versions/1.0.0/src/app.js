
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const art=(bus=false)=>`<svg viewBox="0 0 240 120" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">${bus?'<path fill="#fff8ec" d="M24 86V30q0-12 13-12h153q17 0 17 17v51H24Z"/><path d="M36 31h156v30H36Zm28 0v30m28-30v30m28-30v30m28-30v30m28-30v30M199 36v37M35 72h13m131 0h18"/>':'<path fill="#fff8ec" d="M19 84V66q0-8 12-11l29-8 26-25h67l31 28 27 10q9 3 9 12v12H19Z"/><path d="m67 47 23-20h58l27 20H67Zm51-20v20M31 65h19m139 0h18M82 60h12m44 0h12"/>'}<circle fill="#eedbc3" cx="62" cy="85" r="15"/><circle fill="#eedbc3" cx="180" cy="85" r="15"/><circle cx="62" cy="85" r="7"/><circle cx="180" cy="85" r="7"/><path opacity=".4" d="M8 105h225"/></svg>`;
const vehicles=[{name:'Sedan',tag:'For a small group',desc:'For one person, couples or small families.',facts:['Private travel for your group','Ask about seats, AC and space for bags']},{name:'SUV',tag:'More room for your family',desc:'A roomy choice for a family trip.',facts:['Extra space for your group','We’ll check the vehicle and seats with you']},{name:'Tempo Traveller',tag:'Travel together',desc:'Keep your family or group in one vehicle.',facts:['For family and group trips','We’ll check seats and bag space with you']},{name:'Mini bus / Bus',tag:'For a large group',desc:'For large families and temple tour groups.',facts:['Travel planned for your route','Ask about seats, AC and trip plans']}];
const stops=[['Tirumala','The seven hills'],['Tiruchanur · Padmavathi Temple','Tirupati'],['Govindaraja Swamy Temple','Tirupati'],['Kapila Theertham','Tirupati'],['Srikalahasti','South Andhra'],['Kanipakam','South Andhra'],['Srinivasa Mangapuram','Near Tirupati'],['Golden Temple, Vellore','Tamil Nadu'],['Chandragiri Fort','A fort visit'],['Kanchipuram','Tamil Nadu'],['Tiruvannamalai','Tamil Nadu'],['Srirangam','Tamil Nadu'],['Madurai','Tamil Nadu'],['Rameswaram','Tamil Nadu']];
const tourStops=[[0],[0,1,2,3],[0,4,5,1],[0,4,7],[0,9,10,11,12,13]];

const images=['tirumala.webp','padmavathi.webp','srikalahasti.webp','vellore.webp','srirangam.webp'];
const vehicleImage=i=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(art(i>1).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replaceAll('currentColor','#4a3430').replaceAll('#fff8ec','#f8f5ed'));
const state={tour:null,vehicle:null,vehicleHelp:false,customStarted:false,customized:false};
const stopChoices=new Map();
try {
 const saved=JSON.parse(sessionStorage.getItem('heavenly-trip-preferences')||'null');
 if(saved){
  if(Number.isInteger(saved.tour)&&saved.tour>=0&&saved.tour<tours.length)state.tour=saved.tour;
  if(Number.isInteger(saved.vehicle)&&saved.vehicle>=0&&saved.vehicle<vehicles.length)state.vehicle=saved.vehicle;
  for(const key of ['vehicleHelp','customStarted','customized'])state[key]=saved[key]===true;
  if(Array.isArray(saved.stops))for(const [key,values]of saved.stops){if((key==='custom'||Number.isInteger(key)&&key>=0&&key<tours.length)&&Array.isArray(values))stopChoices.set(key,new Set(values.filter(i=>Number.isInteger(i)&&i>=0&&i<stops.length)));}
 }
}catch{}
const money=n=>'₹'+n.toLocaleString('en-IN');
const activeKey=()=>state.tour??'custom';
const hasRoute=()=>state.tour!==null||state.customStarted;
function chosenFor(key=activeKey()){
 if(!stopChoices.has(key))stopChoices.set(key,new Set(key==='custom'?[]:tourStops[key]));
 return stopChoices.get(key);
}
const vehicleBase=()=>state.vehicle===null?routePricing.base:routePricing.vehicleBases[state.vehicle];
const routeCost=key=>vehicleBase()+chosenFor(key).size*routePricing.stopFee;
function savePreferences(){try{sessionStorage.setItem('heavenly-trip-preferences',JSON.stringify({...state,stops:[...stopChoices].map(([key,value])=>[key,[...value]])}));}catch{}}
function announce(message){$('#announcement').textContent=message;}
function goTo(id){
 const section=$(id);if(!section)return;
 section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 section.querySelector('h2')?.focus({preventScroll:true});
}

$('#package-list').innerHTML=tours.map((tour,index)=>`<article class="package-card" data-tour-card="${index}" data-categories="${tour.category}" aria-labelledby="tour-title-${index}"><div class="package-photo"><img src="${HEAVENLY_IMAGES[images[index]]}" alt="${tour.name} temple destination" width="750" height="500" loading="lazy"><span class="tour-tag">${tour.tag}</span><span class="selected-badge" hidden>Selected ✓</span><h3 id="tour-title-${index}" class="package-image-title">${tour.name}</h3></div><div class="package-body"><p class="package-number">JOURNEY ${String(index+1).padStart(2,'0')} <span>${tourStops[index].length} temple ${tourStops[index].length===1?'stop':'stops'}</span></p><p class="package-description">${tour.description}</p><div class="route-preview-small"><span>PLACES ON THIS ROUTE</span><p>${tourStops[index].map(i=>stops[i][0]).join(' · ')}</p></div><p class="best-for"><span>Suited to</span> ${tour.best}</p><details class="package-includes"><summary>What this package covers <span aria-hidden="true">+</span></summary><ul>${tour.includes.map(item=>`<li>${item}</li>`).join('')}</ul><p>You can add or remove temple stops after choosing this tour.</p></details><div class="package-price"><span>Starting route estimate<small data-package-base-label>Sedan base + ${tourStops[index].length} stops</small></span><strong data-package-price="${index}">${money(routePricing.base+tourStops[index].length*routePricing.stopFee)}</strong></div><button type="button" class="button" data-tour="${index}" aria-pressed="false">Choose &amp; customize <span aria-hidden="true">→</span></button></div></article>`).join('');

const vehicleLabels=['Small parties','Families & extra room','Family & group travel','Larger groups'];
$('#fleet-list').innerHTML=vehicles.map((vehicle,index)=>`<article class="vehicle-card" data-vehicle-card="${index}" aria-labelledby="vehicle-title-${index}"><span class="vehicle-label">${vehicleLabels[index]}</span><div class="vehicle-art"><img src="${vehicleImage(index)}" alt="Representative ${vehicle.name} illustration" width="400" height="220" loading="lazy"></div><div class="vehicle-body"><h3 id="vehicle-title-${index}">${vehicle.name}</h3><p>${vehicle.desc}</p><ul>${vehicle.facts.map(item=>`<li>${item}</li>`).join('')}</ul><div class="vehicle-price"><span>Starting vehicle base</span><strong>${money(routePricing.vehicleBases[index])}</strong></div><span class="vehicle-price-note">Temple stops added separately.</span><button class="button outline" type="button" data-vehicle="${index}" aria-pressed="false">Choose ${vehicle.name} &amp; continue <span aria-hidden="true">→</span></button></div></article>`).join('');

function renderStops(){
 const selected=chosenFor(),base=state.tour===null?[]:tourStops[state.tour];
 const main=[...new Set([...base,...selected])];
 const extras=stops.map((_,index)=>index).filter(index=>!main.includes(index));
 function row(index){return `<label class="stop-option"><input type="checkbox" data-stop="${index}" ${selected.has(index)?'checked':''}><span><strong>${stops[index][0]}</strong><small>${stops[index][1]}${base.includes(index)?' · Original package stop':''}</small></span><span class="stop-fee">+ ${money(routePricing.stopFee)}</span></label>`;}
 $('#stop-list').innerHTML=main.map(row).join('')+(extras.length?`<details class="extra-stops" ${main.length===0?'open':''}><summary>Add more temples <span>${extras.length} places to explore +</span></summary><p class="extra-stops-intro">Choose any additional places you’d like us to include. We’ll check the route and timing with you.</p>${extras.map(row).join('')}</details>`:'');
 $('#customize-empty').hidden=hasRoute();$('#customize-panel').hidden=!hasRoute();
 $('#customize-tour-name').textContent=state.tour===null?'Your own temple journey':tours[state.tour].name;
 $('#reset-stops').hidden=state.tour===null;
 $('#stop-error').hidden=true;
 updateSummary();
}
function updateSummary(){
 const started=hasRoute(),chosen=chosenFor(),tourName=state.tour===null?(state.customStarted?'Your custom temple trip':'Help me choose a tour'):tours[state.tour].name;
 const vehicleName=state.vehicle===null?'Help me choose a vehicle':vehicles[state.vehicle].name;
 $$('[data-tour]').forEach(button=>{
  const selected=Number(button.dataset.tour)===state.tour;
  button.setAttribute('aria-pressed',String(selected));
  button.innerHTML=selected?'Selected · customize stops <span aria-hidden="true">→</span>':'Choose &amp; customize <span aria-hidden="true">→</span>';
  const card=button.closest('article');card.classList.toggle('is-selected',selected);card.querySelector('.selected-badge').hidden=!selected;
 });
 $$('[data-package-price]').forEach(el=>{const index=Number(el.dataset.packagePrice);el.textContent=money(vehicleBase()+tourStops[index].length*routePricing.stopFee);el.closest('.package-price').querySelector('[data-package-base-label]').textContent=(state.vehicle===null?'Sedan':vehicles[state.vehicle].name)+' base + '+tourStops[index].length+(tourStops[index].length===1?' stop':' stops');});
 $$('[data-vehicle]').forEach(button=>{
  const index=Number(button.dataset.vehicle),selected=state.vehicle===index;
  button.setAttribute('aria-pressed',String(selected));button.innerHTML=selected?'Selected · review trip <span aria-hidden="true">→</span>':`Choose ${vehicles[index].name} &amp; continue <span aria-hidden="true">→</span>`;
  button.classList.toggle('outline',!selected);button.closest('article').classList.toggle('is-selected',selected);
 });
 $('#fleet-context').textContent=started?`For your ${tourName}, choose the vehicle that suits your group. Not sure? Ask our team to recommend one.`:'Compare all four vehicle options. Choose what suits your group, or let our team recommend one.';
 $('#route-stop-count').textContent=chosen.size+' selected '+(chosen.size===1?'temple':'temples');
 $('#selected-stops').replaceChildren(...[...chosen].map(index=>{const li=document.createElement('li');li.textContent=stops[index][0];return li;}));
 $('#estimate-vehicle-label').textContent=(state.vehicle===null?'Sedan':vehicles[state.vehicle].name)+' starting base';
 $('#estimate-base').textContent=money(vehicleBase());
 $('#estimate-stops-label').textContent=chosen.size+' stops × '+money(routePricing.stopFee);
 $('#estimate-stops').textContent=money(chosen.size*routePricing.stopFee);
 $('#customize-total').textContent=money(routeCost(activeKey()));
 $('#review-tour').textContent=tourName;$('#review-vehicle').textContent=vehicleName;
 $('#review-stops').textContent=chosen.size?[...chosen].map(index=>stops[index][0]).join(' → '):'Our team can help plan your route.';
 $('#review-total').textContent=started?money(routeCost(activeKey())):'To be discussed';
 $('#review-total').classList.toggle('is-unpriced',!started);
 $('#review-peek-price').textContent=started?money(routeCost(activeKey()))+' estimate':'Quote to be discussed';
 $('#review-price-note').textContent=started?'Starting estimate only. Distance, travel days, tolls, permits and availability are confirmed before booking.':'Choose a package or build a route to see a starting estimate.';
 $('#review-state').textContent=started&&chosen.size?(chosen.size+' temples · '+(state.vehicle===null?'vehicle to discuss':vehicles[state.vehicle].name)):'Your preferences';
 $('#mobile-plan-name').textContent=started?tourName:'Choose a tour to begin';
 const next=$('#mobile-next');
 next.href=!started?'#packages':!state.customized?'#customize':state.vehicle===null&&!state.vehicleHelp?'#fleet':'#booking';
 next.textContent=!started?'View packages →':!state.customized?'Edit stops →':state.vehicle===null&&!state.vehicleHelp?'Choose vehicle →':'Review trip →';
 $$('[data-step-link]').forEach(link=>{
  const complete={packages:started,customize:state.customized,fleet:state.vehicle!==null||state.vehicleHelp,booking:false}[link.dataset.stepLink];
  link.classList.toggle('is-complete',complete);
 });
 savePreferences();
}
function chooseTour(index){state.tour=index;state.customStarted=false;state.customized=false;renderStops();announce(tours[index].name+' selected. Choose your temple stops below.');goTo('#customize');}
$('#package-list').addEventListener('click',event=>{const button=event.target.closest('[data-tour]');if(button)chooseTour(Number(button.dataset.tour));});
function startCustom(){state.tour=null;state.customStarted=true;state.customized=false;renderStops();announce('Your custom route is ready. Choose your temple stops.');goTo('#customize');}
$('#build-custom').addEventListener('click',startCustom);$$('[data-custom-start]').forEach(button=>button.addEventListener('click',startCustom));
$('#stop-list').addEventListener('change',event=>{
 const input=event.target.closest('[data-stop]');if(!input)return;
 if(input.checked)chosenFor().add(Number(input.dataset.stop));else chosenFor().delete(Number(input.dataset.stop));
 $('#stop-error').hidden=true;updateSummary();
});
$('#route-help').addEventListener('click',()=>{state.tour=null;state.customStarted=false;state.customized=false;stopChoices.set('custom',new Set());renderStops();announce('Our team will help choose your temple route. Add your travel details below.');goTo('#booking');});
$('#reset-stops').addEventListener('click',()=>{if(state.tour!==null){stopChoices.set(state.tour,new Set(tourStops[state.tour]));renderStops();announce('Original package stops restored.');}});
function validateRoute(){
 if(hasRoute()&&chosenFor().size===0){$('#stop-error').hidden=false;goTo('#customize');$('#stop-list input')?.focus({preventScroll:true});return false;}
 return true;
}
$('#continue-vehicle').addEventListener('click',()=>{if(validateRoute()){state.customized=true;updateSummary();goTo('#fleet');}});
$('#fleet-list').addEventListener('click',event=>{
 const button=event.target.closest('[data-vehicle]');if(!button)return;
 state.vehicle=Number(button.dataset.vehicle);state.vehicleHelp=false;if(hasRoute()&&chosenFor().size)state.customized=true;
 updateSummary();announce(vehicles[state.vehicle].name+' selected. Review your trip and add your travel details.');goTo('#booking');
});
$('#vehicle-help').addEventListener('click',()=>{state.vehicle=null;state.vehicleHelp=true;if(hasRoute()&&chosenFor().size)state.customized=true;updateSummary();announce('Our team will help choose a vehicle.');goTo('#booking');});
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const category=button.dataset.filter;let visible=0;
 $$('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
 $$('[data-tour-card]').forEach(card=>{card.hidden=category!=='all'&&!card.dataset.categories.split(' ').includes(category);if(!card.hidden)visible++;});
 $('#package-count').textContent=category==='all'?'Showing all 5 tours':`Showing ${visible} ${visible===1?'tour':'tours'}`;
}));

const form=$('#enquiry-form'),people=$('#people'),date=$('#date');
const today=new Date();date.min=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');$('#year').textContent=today.getFullYear();
function saveDraft(){try{sessionStorage.setItem('heavenly-travel-draft',JSON.stringify(Object.fromEntries(['pickup','dropoff','name','phone','notes','people','date'].map(id=>[id,$('#'+id).value]).concat([['flexible',$('#flexible-date').checked]]))));}catch{}}
try{
 const draft=JSON.parse(sessionStorage.getItem('heavenly-travel-draft')||'null');
 if(draft){for(const id of ['pickup','dropoff','name','phone','notes','people','date'])if(typeof draft[id]==='string')$('#'+id).value=draft[id];$('#flexible-date').checked=draft.flexible===true;}
}catch{}
function flexibleDate(){date.required=!$('#flexible-date').checked;date.disabled=$('#flexible-date').checked;}
$('#flexible-date').addEventListener('change',()=>{flexibleDate();saveDraft();});flexibleDate();
form.addEventListener('input',saveDraft);
$('#people-minus').addEventListener('click',()=>{people.value=Math.max(1,(Number(people.value)||1)-1);saveDraft();});
$('#people-plus').addEventListener('click',()=>{people.value=Math.min(200,(Number(people.value)||1)+1);saveDraft();});
form.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity()||!validateRoute())return;
 const data=new FormData(form),chosen=chosenFor();
 const lines=['Namaskaram Heavenly Tours & Travels,','Please help me plan this temple trip and send a personal quote.','',`Name: ${data.get('name').trim()}`,`Tour: ${state.tour===null?(state.customStarted?'Custom temple trip':'Please help me choose'):tours[state.tour].name}`,`Vehicle: ${state.vehicle===null?'Please help me choose':vehicles[state.vehicle].name}`,`Travellers: ${data.get('people')}`,`Travel date: ${$('#flexible-date').checked?'Not decided yet':data.get('date')}`,`Pickup: ${data.get('pickup').trim()}`,`Drop-off: ${data.get('dropoff').trim()||'Same as pickup / to confirm'}`,`Temple stops: ${chosen.size?[...chosen].map(index=>stops[index][0]).join(', '):'Please help me plan the route'}`];
 if(data.get('phone').trim())lines.push(`Phone: ${data.get('phone').trim()}`);
 if(data.get('notes').trim())lines.push(`Requests: ${data.get('notes').trim()}`);
 if(hasRoute())lines.push(`Starting route estimate: ${money(routeCost(activeKey()))} (final price to confirm)`);
 lines.push('','Please confirm route timings, vehicle availability, darshan assistance and all costs before booking.');
 $('#form-status').textContent='Your WhatsApp draft is ready. Review the details and send it to our team.';
 const link=document.createElement('a');link.href='https://wa.me/919700181493?text='+encodeURIComponent(lines.join(String.fromCharCode(10)));link.target='_blank';link.rel='noopener noreferrer';link.click();
});

let navFrame=0;
function navigationState(){
 navFrame=0;const marker=document.querySelector('.journey-nav').getBoundingClientRect().bottom+80;
 let current='packages';for(const id of ['packages','customize','fleet','booking']){if($('#'+id).getBoundingClientRect().top<=marker)current=id;}
 $$('[data-step-link]').forEach(link=>{if(link.dataset.stepLink===current)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
 const hero=$('#home').getBoundingClientRect(),booking=$('#booking').getBoundingClientRect(),contact=$('#contact').getBoundingClientRect();
 $('.site-header').classList.toggle('is-solid',hero.bottom<90);
 $('#mobile-plan').hidden=hero.bottom>100||booking.top<innerHeight&&booking.bottom>0||contact.top<innerHeight;
}
function scheduleNavigation(){if(!navFrame)navFrame=requestAnimationFrame(navigationState);}
addEventListener('scroll',scheduleNavigation,{passive:true});addEventListener('resize',scheduleNavigation);
$('#trip-review-details').open=!matchMedia('(max-width:850px)').matches;
renderStops();navigationState();
