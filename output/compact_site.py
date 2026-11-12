from pathlib import Path
import re,shutil
R=Path(__file__).resolve().parents[1];V=R/'src/v3';backup=R/'output/pre-compact-layout'
if not backup.exists():
 for name in ['src/v3/page.html','src/v3/final-flow.css','src/v3/app.js','src/booking/main.tsx']:
  dest=backup/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(R/name,dest)
p=V/'page.html';s=p.read_text(encoding='utf-8')
# The destination rows describe stops; none are interactive links.
start=s.index('<section id="pilgrimage"');end=s.index('<section id="journeys"',start)
signature=s[start:end]
signature=re.sub(r'<span class="temple-tick"[^>]*>.*?</span>','',signature)
signature=signature.replace('<span aria-hidden="true">↗</span>','').replace(' ↗','').replace(' ↓','')
signature=signature.replace('Seven sacred places.<br><em>One beautiful journey.</em>','Seven temples.<br><em>One complete trip.</em>')
signature=signature.replace('Tirumala to Tiruvannamalai. Your complete temple journey, personally arranged.','Travel, stays and assistance, arranged around you.')
signature=signature.replace('A pilgrimage<br><em>to remember.</em>','Your seven<br><em>temple stops.</em>')
signature=signature.replace('Comfortable travel. Help with stays. Personal assistance throughout your journey.','Choose this route, then pick your vehicle.')
signature=signature.replace('<div id="below-gateway-service-picker" class="booking-flow"></div>','')
s=s[:start]+signature+s[end:]
s=s.replace('From the moment you arrive in Tirupati until your pilgrimage is complete, we take care of your travel.','Temple journeys, comfortable vehicles and personal assistance from Tirupati.')
s=s.replace('From a short Tirupati visit to a multi-day South India yatra. Choose a starting package, then make it your own.','Choose a route. View the stops. Pick your vehicle.')
# Keep every service available, but stop displaying a full brochure at once.
start=s.index('<dialog id="services-dialog"');end=s.index('</dialog>',start)+9;old=s[start:end]
cap=re.search(r'<section class="services-capabilities".*?</section>',old,re.S)[0]
groups=re.search(r'<aside class="services-groups">.*?</aside>',old,re.S)[0]
reach=re.search(r'<section class="services-travel-options".*?</section>',old,re.S)[0]
modal='''<dialog id="services-dialog" class="services-dialog compact-services" aria-labelledby="services-title"><button type="button" id="services-close" class="services-close" aria-label="Close package details">×</button><div class="services-dialog-body"><header class="services-dialog-heading"><p class="eyebrow">SEVEN SACRED DESTINATIONS</p><h2 id="services-title">Your complete pilgrimage.</h2><p>Transport, stay coordination and personal travel assistance. Choose the help you need.</p></header><div class="service-highlights"><span>Private AC travel</span><span>Hotel coordination</span><span>Family & senior support</span></div><p class="compact-availability">Darshan assistance is subject to official availability.</p><details class="services-fold"><summary>Travel services</summary>'''+cap+'''</details><details class="services-fold"><summary>Group travel · 3–200 members</summary>'''+groups+'''</details><details class="services-fold"><summary>Vehicles, pickup cities & custom tours</summary>'''+reach+'''</details><div class="compact-package-actions"><a class="button primary" href="vehicles.html?package=seven-temple">Select this package</a><a href="https://wa.me/919700181493" target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</a></div></div></dialog>'''
s=s[:start]+modal+s[end:]
p.write_text(s,encoding='utf-8')
p=V/'app.js';s=p.read_text(encoding='utf-8');s=s.replace('<ul class="package-includes">${t.includes.map(item=>`<li>${item}</li>`).join(\'\')}</ul>','<details class="package-stops"><summary>View stops & inclusions</summary><ul class="package-includes">${t.includes.map(item=>`<li>${item}</li>`).join(\'\')}</ul></details>');p.write_text(s,encoding='utf-8')
p=R/'src/booking/main.tsx';s=p.read_text(encoding='utf-8')
s=s.replace('Choose from one to five days. Swipe through the journeys, then explore the full plan below.','Choose how many days you have. Swipe to browse.')
s=s.replace('Darshan is subject to official ticket availability. Travel order and stay arrangements are confirmed with our team before booking.','Darshan is subject to official availability.')
s=s.replace('Darshan is subject to official ticket availability. Travel order and stay arrangements are confirmed with our team.','Darshan is subject to official availability.')
s=s.replace('<div className="day-itinerary-stops" key={active.id}>','<details className="day-itinerary-stops" key={active.id}><summary>View {active.duration}-day itinerary</summary><div className="day-itinerary-content">')
s=s.replace("The order across the two days is arranged around your darshan slot and travel needs.</p>}</div></article>","The two-day order follows your darshan slot.</p>}</div></details></article>")
s=s.replace('Choose a vehicle for your family or group. We’ll confirm the model, seats, luggage space and availability.','Choose your vehicle. We’ll confirm seating and availability.')
s=s.replace('Let’s arrange<br/><em>your journey.</em>','Review your trip.')
s=s.replace('Opens a WhatsApp draft for you to review and send. Our team confirms the arrangements. No payment or reservation happens on this website.','Review and send your draft in WhatsApp. No payment is taken here.')
start=s.index('<label>Travel date <span>');end=s.index('</select></label></div><SlideCommit',start)+len('</select></label>')
extras=s[start:end]
s=s[:start]+'</div><details className="booking-extra"><summary>Date, pickup & travel preference</summary><div className="booking-review-fields">'+extras+s[end:]
s=s.replace('</div><SlideCommit','</div></details><SlideCommit')
p.write_text(s,encoding='utf-8')
print('Removed signature arrows and duplicate picker; folded secondary details.')
