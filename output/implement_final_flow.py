from pathlib import Path
import re,json,shutil
R=Path(__file__).resolve().parents[1]; V=R/'src/v3'
B=R/'output/pre-final-journey-flow'
if not B.exists():
 for name in ['src/v3','src/booking','components','build_v3.py','src/tours.js']:
  p=R/name; dest=B/name;dest.parent.mkdir(parents=True,exist_ok=True)
  if p.is_dir():shutil.copytree(p,dest)
  else:shutil.copy2(p,dest)

# Preserve the supplied momentum physics, including native touch scrolling.
attachment=Path('C:/Users/jkvam/.codex/attachments/dd6f1d24-a21a-4090-af76-204871609dd3/Pasted text.txt').read_text(encoding='utf-8-sig')
physics=attachment[attachment.index('const STIFFNESS ='):attachment.index('/* Rail ',attachment.index('function useMomentumRail'))]
physics=physics[:physics.rfind('/* ------------------------------------------------------------------ */')]
physics=physics.replace('function useMomentumRail(', 'export function useMomentumRail(').replace('window.matchMedia("(prefers-reduced-motion: reduce)").matches','(window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("motion-paused"))')
(R/'components/ui/use-momentum-rail.ts').write_text('/** Momentum Rail physics adapted from @dorianbaffier / kokonutui, MIT, supplied by the user. */\nimport {useRef,useCallback,useEffect,type RefObject} from "react";\n'+physics,encoding='utf-8')

data=(R/'src/booking/data.ts').read_text(encoding='utf-8')
fleet=data[data.index('export const FLEET='):data.index('export type LevelId')]
services=data[:data.index('export const LEVELS=')]
temples=['Sri Venkateswara Temple — Tirumala','Sri Padmavathi Ammavari Temple — Tiruchanur','Sri Kalahasteeswara Temple — Srikalahasti','Sri Varasiddhi Vinayaka Temple — Kanipakam','Sri Lakshmi Narayani Golden Temple — Vellore','Sri Kamakshi Amman Temple — Kanchipuram','Sri Arunachaleswarar Temple — Tiruvannamalai']
toursjs=(R/'src/tours.js').read_text(encoding='utf-8')
tours=json.loads(toursjs[toursjs.index('['):toursjs.index('\n];')+2])
packages=[dict(id='seven-temple',name='Seven Sacred Destinations',type='signature',image='assets/tirumala.webp',note='Our complete seven-place pilgrimage. Travel, stays and darshan assistance arranged around your needs.',places=temples,days=[])]
for i,t in enumerate(tours):packages.append(dict(id=f'tour-{i+1}',name=t['name'],type='tour',image='assets/'+['tirumala.webp','padmavathi.webp','srikalahasti.webp','vellore.webp','srirangam.webp'][i],note=t['description'],places=t['includes'],days=[]))
local='Tirupati local temples: Padmavathi, Govindaraja, Kapileswar and ISKCON'
d1=['Tirumala darshan','Tirumala sightseeing'];d2=['Arunachaleswarar Temple, Tiruvannamalai','Night stay at Tiruvannamalai'];d3=['Golden Temple, Vellore','Kanipakam Ganesh Temple','Srinivasamangapuram Temple','Vakulamatha Temple'];d4=[local,'Sri Kalahasti Shiva Temple']
dayplans=[
 ('One-day package','Darshan ticket already booked.',['Padmavathi Temple','Varahaswamy Temple','Govindaraja Temple','Tirumala darshan'],[]),
 ('Two-day package','Tirumala, Tirupati local temples and Srikalahasti.',['Tirumala darshan','Varahaswamy darshan',local,'Sri Kalahasti Shiva Temple'],[]),
 ('Three-day package','Tirumala, Vellore and the temples around Tirupati.',[],[['Tirumala darshan','Varahaswamy darshan','Tirumala sightseeing'],d3,d4]),
 ('Four-day package','A temple circuit with a night in Tiruvannamalai.',[],[d1,d2,d3,d4]),
 ('Five-day package','The extended yatra, including Kanchipuram and Thiruthani.',[],[d1,d2,d3,d4,['Kanchipuram temples — 3 temples','Thiruthani Temple']])]
for i,(name,note,places,days) in enumerate(dayplans):packages.append(dict(id=f'days-{i+1}',name=name,type='days',duration=i+1,image='assets/'+['padmavathi.webp','srikalahasti.webp','tirumala.webp','vellore.webp','hilltop.webp'][i],note=note,places=places,days=[dict(title=f'Day {j+1}',places=p) for j,p in enumerate(days)]))
types='''
export type TravelPackage={id:string;name:string;type:string;image:string;note:string;duration?:number;places:string[];days:{title:string;places:string[]}[]};
export const DAY_PACKAGES=PACKAGES.filter(p=>p.type==='days');
export type VehicleId=typeof FLEET[number]['id'];
export interface LegacySnapshot {service:string;vehicle:string;tour:string;tourName:string;people:string;date:string;pickup:string;name:string}
export interface LegacyBridge {get:()=>LegacySnapshot;setService:(value:string)=>void;setVehicle:(index:number)=>void;setFiveDay:()=>void}
declare global {interface Window {HeavenlyTrip?:LegacyBridge;heavenlyMotionAllowed?:()=>boolean}}
'''
(R/'src/booking/data.ts').write_text(services+'export const PACKAGES:TravelPackage[]='+json.dumps(packages,ensure_ascii=False,indent=1)+';\n'+fleet+types,encoding='utf-8')

# Remove every active amount and all estimate logic, including WhatsApp output.
app=(V/'app.js').read_text(encoding='utf-8')
app=app.replace(",money=n=>'₹'+n.toLocaleString('en-IN')",'')
app=app.replace('Customise this package','Select this package')
old="window.dispatchEvent(new CustomEvent('heavenly:route',{detail:{label:t.name}}));(document.getElementById('package-options')||$('#pricing')).scrollIntoView({behavior:'instant'})"
app=app.replace(old,"location.assign('vehicles.html?package=tour-'+(i+1))")
app=re.sub(r'<div class="vehicle-price">.*?</div>','',app)
app=app.replace('<em>+₹249</em>','')
app=re.sub(r'function estimate\(\)\{[^\n]+\}\n','',app)
app=re.sub(r"\$\('#base-label'\).*?(?=\$\('#route-error'\))",'',app)
app=re.sub(r"\$\('#summary-estimate'\).*?(?=;\$\('#pricing-helper'\))",'',app)
app=re.sub(r"\$\('#pricing-helper'\)\.textContent=.*?;store\(\)","$('#pricing-helper').textContent=chosen?'Your route is ready. Share your travel needs with our team.':'Choose a route or ask us to help plan your trip.';store()",app)
app=app.replace("!nonTemple&&state.tour!==''?`Indicative starting estimate: ${money(estimate())}. Please confirm final costs.`:'',",'')
app=re.sub(r"\['What does the starting estimate include\?'.*?\],", "['What can you arrange for our trip?','Transport, hotel coordination, local sightseeing and travel assistance. Share your dates and group size so we can help plan your journey.'],",app)
app=app.replace('the route and any extra cost','the route and pickup arrangements').replace('We confirm your plan, price and payment details personally.','We confirm your travel arrangements personally.')
app=app.replace("(document.getElementById('vehicle-selection')||$('#pricing')).scrollIntoView({behavior:'instant'})","location.assign('vehicles.html')")
(V/'app.js').write_text(app,encoding='utf-8')
datajs=(V/'data.js').read_text(encoding='utf-8');datajs=re.sub(r',base:\d+','',datajs);(V/'data.js').write_text(datajs,encoding='utf-8')
toursjs=re.sub(r'\nconst routePricing=.*?;','',toursjs);(R/'src/tours.js').write_text(toursjs,encoding='utf-8')

page=(V/'page.html').read_text(encoding='utf-8')
page=page.replace('/*__BOOKING_CSS__*/','/*__BOOKING_CSS__*/\n/*__FINAL_FLOW_CSS__*/')
page=page.replace('<li>4 vehicle options</li>','<li>5 vehicle options</li>')
page=page.replace('href="#pilgrimage">Temples & services ↗','href="#pilgrimage">See packages ↗').replace('<a class="button secondary" href="#journeys">Explore packages ↗</a>','<button class="button secondary" type="button" data-contact>Book a trip ↗</button>')
start=page.index('<section id="pilgrimage"');end=page.index('<div id="below-gateway-service-picker"',start)
oldgateway=page[start:end];directory=re.search(r'<div class="temple-directory">.*?</ol></div>',oldgateway)[0]
gateway='''<section id="pilgrimage" class="signature-section" aria-labelledby="pilgrimage-title"><div class="signature-mask-stage"><div class="signature-mask-image"><img src="assets/tirumala.webp" alt="Sri Venkateswara Temple at Tirumala" width="1000" height="1000" loading="lazy"></div><div class="signature-mask-shade"></div><div class="signature-mask-caption"><p class="eyebrow">OUR SIGNATURE PILGRIMAGE</p><h2 id="pilgrimage-title">Seven sacred places.<br><em>One beautiful journey.</em></h2><p>Tirumala to Tiruvannamalai. Your complete temple journey, personally arranged.</p><button id="services-open" type="button" class="button primary" aria-haspopup="dialog">View this package <span aria-hidden="true">↗</span></button><span class="signature-scroll-note">SCROLL TO REVEAL YOUR JOURNEY ↓</span></div></div><article class="signature-details"><div><p class="eyebrow">THE SEVEN DESTINATIONS</p><h3>A pilgrimage<br><em>to remember.</em></h3><p>Comfortable travel. Help with stays. Personal assistance throughout your journey.</p><a class="button primary" href="vehicles.html?package=seven-temple">Select this package ↗</a></div>'''+directory+'''<div id="gateway-service-picker" class="booking-flow"></div></article></section>\n'''
page=page[:start]+gateway+page[end:]
page=page.replace('Preparing five-day itineraries, package preferences and vehicle options…','Preparing one-to-five-day packages…').replace('five-day trips, package levels and vehicles','day-wise trips and vehicles')
page=page.replace('Your starting estimate updates as you go.','Our team will help arrange the details.').replace('Choose below. Then ask us for the final price.','Choose your travel preferences below.')
page=re.sub(r'<div class="estimate-calculation">.*?</p><button class="button primary" type="button" id="request-plan">','<button class="button primary" type="button" id="request-plan">',page)
page=re.sub(r'<div class="summary-estimate">.*?</div>','',page)
page=page.replace('Temple stop fees are added separately.','').replace('Choose a starting route to see its temples and estimate.','Choose a starting route to see its temples.')
page=page.replace('<footer class="services-enquiry">','<section class="signature-inclusions"><p class="eyebrow">YOUR COMPLETE PILGRIMAGE</p><h3>What we help arrange</h3><ul><li>Transport between the seven destinations</li><li>Hotel & accommodation coordination</li><li>Pickup, drop-off and local sightseeing</li><li>Darshan assistance, subject to official availability</li><li>Personalised itinerary for your family or group</li></ul><p>Tell us what you need. We confirm the arrangements and availability with you.</p><a class="button primary" href="vehicles.html?package=seven-temple">Select this package & choose a vehicle ↗</a></section><footer class="services-enquiry">')
(V/'page.html').write_text(page,encoding='utf-8')

# The vehicle route is a real, lightweight page with no legacy planner scripts.
head=page[:page.index('<body>')]
head=re.sub(r'<link rel="preload" as="image".*?>','',head)
head=head.replace('<title>Heavenly Tours &amp; Travels — Temple trips made simple</title>','<title>Choose your vehicle — Heavenly Tours &amp; Travels</title>')
vehiclepage=head+'''<body class="vehicle-page"><a class="skip-link" href="#main-content">Skip to main content</a><header class="site-header"><a class="site-brand brand-mark" href="index.html"><span class="brand-wordmark">Heavenly<small>TOURS &amp; TRAVELS</small></span></a><nav aria-label="Main navigation"><a class="header-link" href="index.html#pilgrimage">All packages</a><a class="button primary" href="tel:+919700181493">Call us ↗</a></nav></header><main id="main-content"><div id="booking-flow-root"><p class="flow-loading">Preparing your vehicle choices…</p></div><noscript><p>Call <a href="tel:+919700181493">+91 97001 81493</a> to choose your package and vehicle.</p></noscript></main><footer class="vehicle-page-footer"><a href="index.html#pilgrimage">← Back to packages</a><span>Heavenly Tours &amp; Travels · Tirupati</span></footer><script src="assets/booking-flow.js" defer></script></body></html>'''
(V/'vehicles.html').write_text(vehiclepage,encoding='utf-8')

build=(R/'build_v3.py').read_text(encoding='utf-8')
build=build.replace("page=(SRC/'page.html').read_text(encoding='utf-8')","page=(SRC/'page.html').read_text(encoding='utf-8')\nvehicle_page=(SRC/'vehicles.html').read_text(encoding='utf-8')")
build=build.replace("('BOOKING_CSS','booking.css')","('BOOKING_CSS','booking.css'),('FINAL_FLOW_CSS','final-flow.css')")
build=build.replace(" page=page.replace('/*__'+token+'__*/',(SRC/name).read_text(encoding='utf-8'))"," content=(SRC/name).read_text(encoding='utf-8')\n page=page.replace('/*__'+token+'__*/',content)\n vehicle_page=vehicle_page.replace('/*__'+token+'__*/',content)")
build=build.replace(" page=page.replace('assets/'+asset+'\"','assets/'+asset+'?v='+digest+'\"')"," page=page.replace('assets/'+asset+'\"','assets/'+asset+'?v='+digest+'\"')\n vehicle_page=vehicle_page.replace('assets/'+asset+'\"','assets/'+asset+'?v='+digest+'\"')")
build=build.replace("assert '/*__' not in page and '{{' not in page","assert '/*__' not in page and '{{' not in page and '/*__' not in vehicle_page")
build=build.replace("(out/'index.html').write_text(page,encoding='utf-8')","(out/'index.html').write_text(page,encoding='utf-8')\n(out/'vehicles.html').write_text(vehicle_page,encoding='utf-8')")
(R/'build_v3.py').write_text(build,encoding='utf-8')
deploy=(R/'deploy_vercel.py').read_text(encoding='utf-8').replace("paths=[ROOT/'dist/index.html',ROOT/'vercel.json']","paths=[ROOT/'dist/index.html',ROOT/'dist/vehicles.html',ROOT/'vercel.json']").replace('React parallax five-day itinerary, service/package flow and horizontal floating vehicle tiles','Scroll-mask signature pilgrimage, exact 1–5 day momentum packages, dedicated vehicle page and slide-to-WhatsApp; no pricing')
(R/'deploy_vercel.py').write_text(deploy,encoding='utf-8')
print('Canonical itineraries, supplied momentum hook, price removal and vehicle page prepared.')
