from pathlib import Path
import shutil
root=Path('.');backup=root/'output/pre-react-booking-flow'
if not backup.exists():shutil.copytree(root/'src/v3',backup/'src/v3');shutil.copy2(root/'build_v3.py',backup/'build_v3.py')
p=root/'src/v3/page.html';s=p.read_text(encoding='utf-8').replace('/*__PILGRIMAGE_CSS__*/','/*__PILGRIMAGE_CSS__*/\n/*__BOOKING_CSS__*/')
s=s.replace('<style>/*__CSS__*/','<link rel="stylesheet" href="assets/booking-tailwind.css"><style>/*__CSS__*/')
s=s.replace('<button id="services-open"','<div id="gateway-service-picker" class="booking-flow"></div><button id="services-open"',1)
s=s.replace('<section id="journeys"','<div id="below-gateway-service-picker" class="booking-flow"></div>\n<section id="journeys"',1)
s=s.replace('<section id="our-approach"','<div id="booking-flow-root"><p class="flow-loading">Preparing five-day itineraries, package preferences and vehicle options…</p></div><noscript><p>Call +91 97001 81493 or <a href="https://wa.me/919700181493">contact us on WhatsApp</a> to discuss five-day trips, package levels and vehicles.</p></noscript>\n<section id="our-approach"',1)
s=s.replace('</script></body>','</script><script src="assets/booking-flow.js" defer></script></body>')
p.write_text(s,encoding='utf-8')
p=root/'build_v3.py';s=p.read_text(encoding='utf-8').replace('import argparse,shutil','import argparse,shutil,subprocess');s=s.replace("SRC=ROOT/'src/v3'","SRC=ROOT/'src/v3'\nsubprocess.run(['node',str(ROOT/'scripts/build-booking.mjs')],cwd=ROOT,check=True)")
s=s.replace("('PILGRIMAGE_CSS','pilgrimage.css')","('PILGRIMAGE_CSS','pilgrimage.css'),('BOOKING_CSS','booking.css')");p.write_text(s,encoding='utf-8')
p=root/'src/v3/app.js';s=p.read_text(encoding='utf-8')
s=s.replace("$('#pricing').scrollIntoView({behavior:'instant'})};", "(document.getElementById('vehicle-selection')||$('#pricing')).scrollIntoView({behavior:'instant'})};",2)
needle="setTab(0);$('#pricing').scrollIntoView({behavior:'instant'});$('#tour-select').focus({preventScroll:true})};$('#tour-rail').append(card)"
replacement="setTab(0);window.dispatchEvent(new CustomEvent('heavenly:route',{detail:{label:t.name}}));(document.getElementById('package-options')||$('#pricing')).scrollIntoView({behavior:'instant'})};$('#tour-rail').append(card)"
assert needle in s;s=s.replace(needle,replacement)
s=s.replace("if(group&&Number($('#people').value)<3)","window.dispatchEvent(new CustomEvent('heavenly:service',{detail:serviceRequest.value}));if(group&&Number($('#people').value)<3)")
marker="if(saved.tour==='custom'"
bridge="""window.HeavenlyTrip={get:()=>({service:$('#service-request').value,vehicle:state.vehicle,tour:state.tour,tourName:state.tour===''?'':tourLabel(),people:$('#people').value,date:state.date,pickup:$('#pickup').value,name:$('#name').value}),setService:value=>{if([...$('#service-request').options].some(o=>o.value===value)){$('#service-request').value=value;$('#service-request').dispatchEvent(new Event('change',{bubbles:true}))}},setVehicle:index=>{if(Number.isInteger(index)&&index>=0&&index<VEHICLES.length){state.vehicle=String(index);$('#vehicle-select').value=String(index);render()}},setFiveDay:()=>{$('#service-request').value='Custom multi-day South India tour';$('#service-request').dispatchEvent(new Event('change',{bubbles:true}));chooseTour('custom');state.stops=[0,1,2,3,4,5,7,9,10];render()}};
"""
s=s.replace(marker,bridge+marker,1);p.write_text(s,encoding='utf-8')
p=root/'deploy_vercel.py';s=p.read_text(encoding='utf-8').replace("'change':'Full-screen temple gateway, complete services and scroll-revealed pilgrimage packages'","'change':'React parallax five-day itinerary, service/package flow and horizontal floating vehicle tiles'");p.write_text(s,encoding='utf-8')
p=root/'.gitignore';s=p.read_text();s+='\nnode_modules/\n';p.write_text(s)
print('Installed React booking flow, portal service selectors and legacy-planner bridge.')
