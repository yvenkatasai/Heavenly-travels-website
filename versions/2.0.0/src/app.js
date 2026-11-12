
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const art=(bus=false)=>`<svg viewBox="0 0 240 120" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">${bus?'<path fill="#fff8ec" d="M24 86V30q0-12 13-12h153q17 0 17 17v51H24Z"/><path d="M36 31h156v30H36Zm28 0v30m28-30v30m28-30v30m28-30v30m28-30v30M199 36v37M35 72h13m131 0h18"/>':'<path fill="#fff8ec" d="M19 84V66q0-8 12-11l29-8 26-25h67l31 28 27 10q9 3 9 12v12H19Z"/><path d="m67 47 23-20h58l27 20H67Zm51-20v20M31 65h19m139 0h18M82 60h12m44 0h12"/>'}<circle fill="#eedbc3" cx="62" cy="85" r="15"/><circle fill="#eedbc3" cx="180" cy="85" r="15"/><circle cx="62" cy="85" r="7"/><circle cx="180" cy="85" r="7"/><path opacity=".4" d="M8 105h225"/></svg>`;
const vehicles=[{name:'Sedan',tag:'For a small group',desc:'For one person, couples or small families.',facts:['Private travel for your group','Ask about seats, AC and space for bags']},{name:'SUV',tag:'More room for your family',desc:'A roomy choice for a family trip.',facts:['Extra space for your group','We’ll check the vehicle and seats with you']},{name:'Tempo Traveller',tag:'Travel together',desc:'Keep your family or group in one vehicle.',facts:['For family and group trips','We’ll check seats and bag space with you']},{name:'Mini bus / Bus',tag:'For a large group',desc:'For large families and temple tour groups.',facts:['Travel planned for your route','Ask about seats, AC and trip plans']}];
const stops=[['Tirumala','The seven hills'],['Tiruchanur · Padmavathi Temple','Tirupati'],['Govindaraja Swamy Temple','Tirupati'],['Kapila Theertham','Tirupati'],['Srikalahasti','South Andhra'],['Kanipakam','South Andhra'],['Srinivasa Mangapuram','Near Tirupati'],['Golden Temple, Vellore','Tamil Nadu'],['Chandragiri Fort','A fort visit'],['Kanchipuram','Tamil Nadu'],['Tiruvannamalai','Tamil Nadu'],['Srirangam','Tamil Nadu'],['Madurai','Tamil Nadu'],['Rameswaram','Tamil Nadu']];
const tourStops=[[0],[0,1,2,3],[0,4,5,1],[0,4,7],[0,9,10,11,12,13]];
const stopChoices=new Map();
const vehicleImage=i=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(art(i>1).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replaceAll('currentColor','#5b0617'));
const images=['tirumala.webp','padmavathi.webp','srikalahasti.webp','vellore.webp','srirangam.webp'];
const state={tour:null,vehicle:null,vehicleHelp:false};
try{const saved=JSON.parse(sessionStorage.getItem('heavenly-trip-preferences')||'null');if(saved){state.tour=Number.isInteger(saved.tour)&&saved.tour>=0&&saved.tour<tours.length?saved.tour:null;state.vehicle=Number.isInteger(saved.vehicle)&&saved.vehicle>=0&&saved.vehicle<vehicles.length?saved.vehicle:null;state.vehicleHelp=saved.vehicleHelp===true;if(Array.isArray(saved.stops))saved.stops.forEach(([key,values])=>{if((key==='custom'||Number.isInteger(key)&&key>=0&&key<tours.length)&&Array.isArray(values))stopChoices.set(key,new Set(values.filter(i=>Number.isInteger(i)&&i>=0&&i<stops.length)));});}}catch{}
function savePreferences(){try{sessionStorage.setItem('heavenly-trip-preferences',JSON.stringify({...state,stops:[...stopChoices].map(([k,v])=>[k,[...v]])}));}catch{}}

const money=n=>'₹'+n.toLocaleString('en-IN');
function chosenFor(i){if(!stopChoices.has(i))stopChoices.set(i,new Set(tourStops[i]));return stopChoices.get(i);}
function routeCost(i){const chosen=chosenFor(i);return (state.vehicle!==null&&routePricing.vehicleBases[state.vehicle]!==null?routePricing.vehicleBases[state.vehicle]:routePricing.base)+chosen.size*routePricing.stopFee;}
function bookRoute(i){return `<ol class="book-route"><li>Starting point · <span data-outline-pickup>your pickup</span></li>${[...chosenFor(i)].map(j=>`<li>${stops[j][0]}</li>`).join('')}<li>Ending point · <span data-outline-dropoff>your drop-off</span></li></ol>`;}
$('#package-list').innerHTML=tours.map((t,i)=>`<article class="tour-card route-book" data-tour-card="${i}" aria-label="${t.name}"><div class="book-map"><img class="trip-cover" src="${HEAVENLY_IMAGES[images[i]]}" alt="${t.name}" loading="lazy" width="750" height="500"><span class="eyebrow">YOUR ROUTE</span><h3>${t.name}</h3><div data-route-outline="${i}">${bookRoute(i)}</div></div><div class="card-body book-details"><span class="eyebrow">${t.tag}</span><h3>Make this trip yours.</h3><label class="book-endpoint">Starting point<input data-book-endpoint="pickup" placeholder="Hotel, station or city" maxlength="160"></label><div class="book-stops-scroll" tabindex="0" role="region" aria-label="Available temple stops"><fieldset class="book-stops"><legend>Choose your stops <small>+ ${money(routePricing.stopFee)} each</small></legend>${[...new Set([...tourStops[i],...stops.map((_,j)=>j)])].map((j,k)=>`${k===tourStops[i].length?'<details class="book-more"><summary>More places</summary>':''}<label><input type="checkbox" data-book-tour="${i}" data-book-stop="${j}" ${chosenFor(i).has(j)?'checked':''}><span>${stops[j][0]}</span><small>+${money(routePricing.stopFee)}</small></label>`).join('')}</details></fieldset></div><label class="book-endpoint">Ending point<input data-book-endpoint="dropoff" placeholder="Same as pickup, or another place" maxlength="160"></label><div class="book-price"><span>Route estimate <small>Base <b data-base-price>${money(routePricing.base)}</b> + selected stops</small></span><strong data-book-total="${i}" aria-live="polite">${money(routeCost(i))}</strong></div><p class="price-note">Starting estimate. Distance, days, tolls and permits confirmed before booking.</p><button class="button" type="button" data-tour="${i}" aria-pressed="false">Book this package →</button></div></article>`).join('');
function syncBook(){$$('[data-base-price]').forEach(el=>el.textContent=money(state.vehicle===null?routePricing.base:routePricing.vehicleBases[state.vehicle]));tours.forEach((_,i)=>{document.querySelectorAll(`[data-book-tour="${i}"]`).forEach(el=>el.checked=chosenFor(i).has(Number(el.dataset.bookStop)));const total=document.querySelector(`[data-book-total="${i}"]`);if(total)total.textContent=money(routeCost(i));const outline=document.querySelector(`[data-route-outline="${i}"]`);if(outline)outline.innerHTML=bookRoute(i);});$$('[data-outline-pickup]').forEach(el=>el.textContent=$('#pickup').value.trim()||'Your pickup');$$('[data-outline-dropoff]').forEach(el=>el.textContent=$('#dropoff').value.trim()||'Same as pickup / to confirm');const summary=$('#selected-route-summary');if(summary){const selected=state.tour===null?[]:[...chosenFor(state.tour)];summary.innerHTML=`<strong>${state.tour===null?'Select a package':money(routeCost(state.tour))+' route estimate'}</strong><p>${selected.length} selected stops · final route price to confirm</p><details><summary>View selected places</summary><ol><li>Start: <span data-summary-pickup></span></li>${selected.map(j=>`<li>${stops[j][0]}</li>`).join('')}<li>End: <span data-summary-dropoff></span></li></ol></details>`;summary.querySelector('[data-summary-pickup]').textContent=$('#pickup').value.trim()||'Your pickup location';summary.querySelector('[data-summary-dropoff]').textContent=$('#dropoff').value.trim()||'Same as pickup / to confirm';}}
$('#package-list').addEventListener('input',e=>{const key=e.target.dataset.bookEndpoint;if(!key)return;$('#'+key).value=e.target.value;$$(`[data-book-endpoint="${key}"]`).forEach(el=>{if(el!==e.target)el.value=e.target.value;});routePreview();});
$('#package-list').addEventListener('change',e=>{const el=e.target.closest('[data-book-stop]');if(!el)return;const i=Number(el.dataset.bookTour),j=Number(el.dataset.bookStop),chosen=chosenFor(i);if(el.checked)chosen.add(j);else chosen.delete(j);if(state.tour===i)renderStops();syncBook();savePreferences();});
$('#fleet-list').innerHTML=vehicles.map((v,i)=>`<article class="vehicle-card" data-vehicle-card="${i}"><div class="vehicle-art"><img src="${vehicleImage(i)}" alt="Representative ${v.name} illustration" width="400" height="220" draggable="false"><span class="illustration-label">SAMPLE IMAGE</span></div><div class="card-body"><span class="eyebrow">${v.tag}</span><h3>${v.name}</h3><p class="card-description">${v.desc}</p><ul class="card-facts">${v.facts.map(f=>`<li>${f}</li>`).join('')}</ul><div class="quote-mini"><span>PRICE & VEHICLE</span><strong>${money(routePricing.vehicleBases[i])}</strong></div><button class="button" type="button" data-vehicle="${i}" aria-pressed="false">Select this vehicle <span aria-hidden="true">→</span></button></div></article>`).join('');
function renderStops(){
 const key=state.tour??'custom';if(!stopChoices.has(key))stopChoices.set(key,new Set(state.tour===null?[]:tourStops[state.tour]));const chosen=stopChoices.get(key);
 const order=[...(state.tour===null?[]:tourStops[state.tour]),...stops.map((_,i)=>i).filter(i=>state.tour===null||!tourStops[state.tour].includes(i))];
 const stopRow=i=>`<label class="stop-option"><input type="checkbox" name="stop" value="${stops[i][0]}" data-stop="${i}" ${chosen.has(i)?'checked':''}><span><strong>${stops[i][0]}</strong><small>${stops[i][1]} · ${state.tour!==null&&tourStops[state.tour].includes(i)?'Package stop':'Extra stop'}</small></span></label>`;const main=order.filter(i=>chosen.has(i)||(state.tour!==null&&tourStops[state.tour].includes(i)));const extra=order.filter(i=>!main.includes(i));$('#stop-list').innerHTML=main.map(stopRow).join('')+`<details class="extra-stops"><summary>Add other places (${extra.length} options)</summary>${extra.map(stopRow).join('')}</details>`;routePreview();
}
function cartTile(type,index){const isTour=type==='tour',item=isTour?tours[index]:vehicles[index];return `<div class="booking-choice"><img src="${isTour?HEAVENLY_IMAGES[images[index]]:vehicleImage(index)}" alt="${item.name}" width="80" height="68"><div><small>${isTour?'Package':'Vehicle'}</small><h4>${item.name}</h4></div><button class="choice-change" type="button" data-change="${type}">Change<span class="sr-only"> ${isTour?'package':'vehicle'}</span></button></div>`;}
function jump(id){$(id).scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});}
function summary(){
 const t=state.tour===null?null:tours[state.tour],v=state.vehicle===null?null:vehicles[state.vehicle];
 $('#tour-summary').innerHTML=t?cartTile('tour',state.tour):'<div class="summary-empty"><h4>Your temple trip</h4><button type="button" class="text-button" data-change="tour">Choose a package</button></div>';
 $('#vehicle-summary').innerHTML=v?cartTile('vehicle',state.vehicle):'<div class="summary-empty"><h4>Vehicle</h4><button type="button" class="text-button" data-change="vehicle">Choose a vehicle</button></div>';
 $$('[data-tour]').forEach(b=>{const selected=Number(b.dataset.tour)===state.tour;b.setAttribute('aria-pressed',selected);b.innerHTML=selected?'Tour selected <span aria-hidden="true">✓</span>':'Book this package <span aria-hidden="true">→</span>';b.closest('article').classList.toggle('is-chosen',selected);});
 $$('[data-vehicle]').forEach(b=>{const selected=Number(b.dataset.vehicle)===state.vehicle;b.setAttribute('aria-pressed',selected);b.innerHTML=selected?'Vehicle selected <span aria-hidden="true">✓</span>':'Select this vehicle <span aria-hidden="true">→</span>';b.closest('article').classList.toggle('is-chosen',selected);});
 $('#fleet-context').textContent=t?`For your ${t.name}, choose a vehicle below. We can help if you are not sure.`:'Choose a vehicle below, or ask us for help.';
 const count=Number(!!t)+Number(!!v||state.vehicleHelp);$('#selection-count').hidden=!count;$('#selection-count').textContent=count;
 const next=$('#mobile-next');next.href=t?(v||state.vehicleHelp?'#booking':'#fleet'):'#packages';next.textContent=t?(v||state.vehicleHelp?'Check my trip →':'Choose my vehicle →'):'See our packages ↓';
 $('#announcement').textContent=[t?.name,v?.name].filter(Boolean).join(' · ');routePreview();savePreferences();
}
function routePreview(){$$('[data-book-endpoint]').forEach(el=>{if(el!==document.activeElement)el.value=$('#'+el.dataset.bookEndpoint).value;});const chosen=$$('input[name="stop"]:checked').map(el=>el.value);$('#route-preview').textContent=[$('#pickup').value.trim()||'Pickup',...chosen,$('#dropoff').value.trim()||'Drop-off'].join(' → ');const count=$('#stops-count');if(count)count.textContent=chosen.length?`${chosen.length} selected`:'Choose stops';syncBook();}
$('#pickup').addEventListener('input',routePreview);$('#dropoff').addEventListener('input',routePreview);
$('#package-list').addEventListener('click',e=>{const b=e.target.closest('[data-tour]');if(!b)return;state.tour=Number(b.dataset.tour);renderStops();summary();jump('#fleet');});
$('#fleet-list').addEventListener('click',e=>{const b=e.target.closest('[data-vehicle]');if(!b)return;state.vehicle=Number(b.dataset.vehicle);state.vehicleHelp=false;summary();$('#confirm-scroll').classList.add('is-ready');});
$('#vehicle-help').addEventListener('click',()=>{state.vehicle=null;state.vehicleHelp=true;summary();jump('#booking');});
$('#stop-list').addEventListener('change',()=>{stopChoices.set(state.tour??'custom',new Set($$('input[name="stop"]:checked').map(el=>Number(el.dataset.stop))));routePreview();savePreferences();});
const rails={};
function initRail(id,position){const rail=$(id),cards=[...rail.children];let current=0,start=null,turn=null;rail.setAttribute('aria-roledescription','carousel');
 function update(){cards.forEach((c,i)=>{let delta=(i-current+cards.length)%cards.length;if(delta>cards.length/2)delta-=cards.length;c.classList.toggle('is-centered',delta===0);c.classList.toggle('is-before',delta===-1);c.classList.toggle('is-after',delta===1);c.inert=delta!==0;c.setAttribute('aria-hidden',String(delta!==0));});$(position).textContent=`${current+1} / ${cards.length}`;}
 function move(delta){
  if(turn?.playState==='running')return;
  const next=(current+delta+cards.length)%cards.length;
  if(next===current)return;
  const previous=cards[current];
  if(previous.contains(document.activeElement))rail.focus({preventScroll:true});
  current=next;
  update();
 }
 rails[id]={show(index){turn?.cancel();current=index;update();}};
 document.querySelector(`[data-prev="${rail.id}"]`).addEventListener('click',()=>move(-1));document.querySelector(`[data-next="${rail.id}"]`).addEventListener('click',()=>move(1));
 rail.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select'))return;if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();move(e.key==='Home'?-current:e.key==='End'?cards.length-1-current:e.key==='ArrowLeft'?-1:1);}});
 rail.addEventListener('pointerdown',e=>{if(e.target.closest('input,button,label,summary'))return;start={x:e.clientX,y:e.clientY};});rail.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){move(dx>0?-1:1);}});rail.addEventListener('pointercancel',()=>start=null);update();
}
initRail('#package-list','#package-position');initRail('#fleet-list','#fleet-position');
const changeDialog=$('#change-dialog');let changeOpener;
function openChange(type){changeOpener=document.activeElement;$('#change-title').textContent=type==='tour'?'Change your package':'Change your vehicle';const options=type==='tour'?tours:vehicles;$('#change-options').innerHTML=options.map((item,i)=>`<button type="button" class="change-option" data-change-type="${type}" data-index="${i}" aria-pressed="${(type==='tour'?state.tour:state.vehicle)===i}"><img src="${type==='tour'?HEAVENLY_IMAGES[images[i]]:vehicleImage(i)}" alt="${item.name}" width="120" height="80"><span><strong>${item.name}</strong><small>${type==='tour'?item.route:item.desc}</small></span><span aria-hidden="true">${(type==='tour'?state.tour:state.vehicle)===i?'✓':'→'}</span></button>`).join('');changeDialog.showModal();}
$('#tour-summary').addEventListener('click',e=>{if(e.target.closest('[data-change]'))openChange('tour');});$('#vehicle-summary').addEventListener('click',e=>{if(e.target.closest('[data-change]'))openChange('vehicle');});
$('.dialog-close').addEventListener('click',()=>changeDialog.close());changeDialog.addEventListener('click',e=>{if(e.target===changeDialog){const r=changeDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)changeDialog.close();}const b=e.target.closest('[data-change-type]');if(!b)return;const index=Number(b.dataset.index);if(b.dataset.changeType==='tour'){state.tour=index;renderStops();rails['#package-list'].show(index);}else{state.vehicle=index;state.vehicleHelp=false;rails['#fleet-list'].show(index);}summary();changeDialog.close();document.querySelector(b.dataset.changeType==='tour'?'#tour-summary [data-change]':'#vehicle-summary [data-change]').focus({preventScroll:true});});
changeDialog.addEventListener('close',()=>{if(changeOpener?.isConnected)changeOpener.focus({preventScroll:true});});
const people=$('#people');$('#people-minus').addEventListener('click',()=>people.value=Math.max(1,(Number(people.value)||1)-1));$('#people-plus').addEventListener('click',()=>people.value=Math.min(200,(Number(people.value)||1)+1));
const now=new Date();$('#date').min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');$('#year').textContent=now.getFullYear();
function syncFlexibleDate(){$('#date').required=!$('#flexible-date').checked;$('#date').disabled=$('#flexible-date').checked;}$('#flexible-date').addEventListener('change',syncFlexibleDate);addEventListener('pageshow',()=>{syncFlexibleDate();routePreview();});syncFlexibleDate();
$('#enquiry-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const f=new FormData(e.currentTarget),extra=f.getAll('stop');const lines=['Namaskaram Heavenly Tours & Travels,','Please send me a price for this temple trip.','',`Name: ${f.get('name').trim()}`,`Tour: ${state.tour===null?'Please help me choose':tours[state.tour].name}`,`Vehicle: ${state.vehicle===null?'Help me choose':vehicles[state.vehicle].name}`,`People: ${f.get('people')}`,`Date: ${$('#flexible-date').checked?'Date not chosen yet':f.get('date')}`,`Pickup: ${f.get('pickup').trim()}`,`Drop-off: ${f.get('dropoff').trim()||'Same as pickup / to confirm'}`,`Places to visit: ${extra.length?extra.join(', '):'None'}`];if(f.get('phone').trim())lines.push(`Phone: ${f.get('phone').trim()}`);if(f.get('notes').trim())lines.push(`Requests: ${f.get('notes').trim()}`);if(state.tour!==null)lines.push(`Route estimate: ${money(routeCost(state.tour))} (final route price to confirm)`);lines.push('','Please check my trip plans and tell me the price and any extra costs before booking.');location.href='https://wa.me/919700181493?text='+encodeURIComponent(lines.join('\n'));});
new IntersectionObserver(([entry])=>document.body.classList.toggle('booking-visible',entry.isIntersecting),{threshold:0}).observe($('#booking'));

summary();
renderStops();

if(state.tour!==null)rails['#package-list'].show(state.tour);if(state.vehicle!==null)rails['#fleet-list'].show(state.vehicle);

// Reflect the section in view rather than the last navigation click.
const sectionLinks=$$('[data-section-nav]');
let sectionFrame=0;
function updateSectionNavigation(){
 sectionFrame=0;
 const marker=document.querySelector('header').getBoundingClientRect().bottom+Math.min(innerHeight*.22,170);
 let active=null;
 sectionLinks.forEach(link=>{const section=document.getElementById(link.dataset.sectionNav),rect=section.getBoundingClientRect();if(rect.top<=marker&&rect.bottom>marker)active=link;});
 const contactRect=$('#contact').getBoundingClientRect();
 if(scrollY+innerHeight>=document.documentElement.scrollHeight-3&&contactRect.top<innerHeight&&contactRect.bottom>0)active=sectionLinks.find(link=>link.dataset.sectionNav==='contact');
 sectionLinks.forEach(link=>{const current=link===active;link.classList.toggle('is-section-active',current);if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
function scheduleSectionNavigation(){if(!sectionFrame)sectionFrame=requestAnimationFrame(updateSectionNavigation);}
addEventListener('scroll',scheduleSectionNavigation,{passive:true});addEventListener('resize',scheduleSectionNavigation);addEventListener('pageshow',scheduleSectionNavigation);updateSectionNavigation();

// Follow the pointer across the button, including when it passes over child text or icons.
const spotlightMedia=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const spotlightSelector='button:not(:disabled),a.button,a.section-nav';
let spotlightButton=null;
function clearSpotlight(){if(!spotlightButton)return;spotlightButton.classList.remove('spotlight-hover');spotlightButton.style.removeProperty('--spotlight-x');spotlightButton=null;}
document.addEventListener('pointermove',e=>{
 if(!spotlightMedia.matches||e.pointerType==='touch')return;
 const button=e.target.closest?.(spotlightSelector);
 if(button!==spotlightButton){clearSpotlight();spotlightButton=button;if(button)button.classList.add('spotlight-hover');}
 if(!button)return;
 const rect=button.getBoundingClientRect();if(rect.width)button.style.setProperty('--spotlight-x',`${Math.min(100,Math.max(0,(e.clientX-rect.left)/rect.width*100))}%`);
},{passive:true});
document.addEventListener('pointerout',e=>{if(spotlightButton?.contains(e.target)&&!spotlightButton.contains(e.relatedTarget))clearSpotlight();},{passive:true});
spotlightMedia.addEventListener('change',clearSpotlight);

const dateInput = $('#date');
const calendarTrigger = $('.calendar-open');
const calendarDialog = $('#booking-calendar');
const calendarMonth = $('#calendar-month');
const calendarYear = $('#calendar-year');
const calendarDays = $('.calendar-days');
const monthName = new Intl.DateTimeFormat('en', {month:'long'});
const fullDate = new Intl.DateTimeFormat('en', {dateStyle:'full'});

for (let month = 0; month < 12; month++) {
 calendarMonth.add(new Option(monthName.format(new Date(2020,month,1)),month));
}

function renderCalendar() {
 const year = Number(calendarYear.value);
 const month = Number(calendarMonth.value);
 const first = new Date(year,month,1).getDay();
 const count = new Date(year,month+1,0).getDate();
 calendarDays.replaceChildren();
 for (const weekday of ['Su','Mo','Tu','We','Th','Fr','Sa']) {
  const heading = document.createElement('span');
  heading.textContent = weekday;
  calendarDays.append(heading);
 }
 for (let blank = 0; blank < first; blank++) calendarDays.append(document.createElement('span'));
 for (let day = 1; day <= count; day++) {
  const value = [year,month+1,day].map(part=>String(part).padStart(2,'0')).join('-');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = day;
  button.dataset.date = value;
  button.disabled = value < dateInput.min;
  button.setAttribute('aria-label',fullDate.format(new Date(year,month,day)));
  button.setAttribute('aria-pressed',String(value===dateInput.value));
  calendarDays.append(button);
 }
}
calendarTrigger.addEventListener('click', () => {
 if (dateInput.disabled) return;
 const [minimumYear] = dateInput.min.split('-').map(Number);
 const [year,month] = (dateInput.value || dateInput.min).split('-').map(Number);
 calendarYear.replaceChildren();
 for (let option = minimumYear; option <= Math.max(minimumYear+10,year); option++) {
  calendarYear.add(new Option(option,option));
 }
 calendarYear.value = Math.max(year,minimumYear);
 calendarMonth.value = month-1;
 renderCalendar();
 calendarDialog.showModal();
});
calendarMonth.addEventListener('change',renderCalendar);
calendarYear.addEventListener('change',renderCalendar);
calendarDays.addEventListener('click', event => {
 const button = event.target.closest('button[data-date]');
 if (!button || button.disabled) return;
 dateInput.value = button.dataset.date;
 dateInput.dispatchEvent(new Event('change',{bubbles:true}));
 calendarDialog.close();
});
$('#calendar-close').addEventListener('click',()=>calendarDialog.close());
function syncCalendarTrigger() {
 calendarTrigger.disabled = dateInput.disabled;
}
$('#flexible-date').addEventListener('change',syncCalendarTrigger);
addEventListener('pageshow',syncCalendarTrigger);
syncCalendarTrigger();
