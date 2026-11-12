from pathlib import Path
import re,json,shutil,html
R=Path(__file__).resolve().parents[1];V=R/'src/v3';B=R/'output/pre-simple-copy'
if not B.exists():
 for name in ['src/v3/page.html','src/v3/vehicles.html','src/v3/app.js','src/v3/pilgrimage.js','src/booking/main.tsx','src/booking/data.ts','src/tours.js']:
  dest=B/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(R/name,dest)

labels={'Temple tour':'Temple trip','Group package':'Group trip','Domestic / international flights':'Flight tickets','Hotel & accommodation':'Hotel stays','Airport / railway pickup & drop':'Airport / station pickup','Local sightseeing / outstation travel':'Local visits / travel to other cities','Custom multi-day South India tour':'Trip with your own temple stops'}
p=R/'src/booking/data.ts';s=p.read_text(encoding='utf-8');s=s.replace('export const PACKAGES:', 'export const SERVICE_LABELS:Record<string,string>='+json.dumps(labels,ensure_ascii=False)+';\nexport const PACKAGES:');p.write_text(s,encoding='utf-8')

phrases={
 'Choose your kind of journey':'Choose your package',
 'Sacred places. Personal journeys.':'Temple trips made easy.',
 'FIND YOUR PILGRIMAGE':'PLAN YOUR TEMPLE TRIP',
 'Individual temple<br><em>journeys.</em>':'Choose a temple<br><em>trip.</em>',
 'One day or five.<br/><em>A journey for your time.</em>':'How many days<br/><em>do you have?</em>',
 'View your itinerary':'View your trip plan',
 'View itinerary':'View trip plan',
 'Close package itinerary':'Close trip plan',
 'Package itinerary. Scroll to read the full plan.':'Trip plan. Scroll to see all days.',
 'Scroll within the itinerary to see the full plan.':'Scroll here to see all days.',
 'Swipe to browse. Open any card to see its itinerary and choose your trip.':'Swipe to see packages. Tap View trip plan for details.',
 '1–5 days · Choose your duration':'1–5 days · Choose your days',
 'PERSONAL TRAVEL ASSISTANCE':'TELL US WHAT YOU NEED',
 'What can we arrange for you?':'What do you need?',
 'Explore the packages':'See packages',
 'Discuss this service':'Ask us about this',
 'YOUR SELECTED JOURNEY':'YOUR SELECTED PACKAGE',
 'YOUR JOURNEY':'YOUR TRIP',
 'CHOOSE BY TRIP LENGTH':'CHOOSE YOUR DAYS',
 'View stops & inclusions':'See temples & trip details',
 'Date, pickup & travel preference':'Date, pickup & package type',
 'Travel preference':'Package type',
 'Pickup location':'Pickup place',
 'To be discussed':'Not decided yet',
 'Your complete pilgrimage.':'Your seven-temple trip.',
 'Transport, stay coordination and personal travel assistance. Choose the help you need.':'Help with vehicles, hotels and temple visits. Tell us what you need.',
 'Hotel coordination':'Hotel booking help',
 'Complete pilgrimage &amp; travel services':'Temple trips &amp; other travel services',
 'Complete pilgrimage & travel services':'Temple trips & other travel services',
 'Darshan assistance is subject to official availability.':'Darshan tickets depend on official availability.',
 'Darshan Ticket Booking Assistance':'Help with Darshan Tickets',
 'Subject to Official Availability':'Only when tickets are officially available',
 'Hotel & Accommodation Booking Assistance':'Help with Hotel Bookings',
 'Special Packages for Families & Senior Citizens':'Trips for Families & Older People',
 'Special group transportation and customised itineraries':'Group vehicles and trip plans made for you',
 'Request a group quotation':'Ask about a group trip',
 'Customised Multi-Day':'Trips for More Than One Day',
 'Local Sightseeing & Outstation Travel Services':'Local visits and travel to other cities',
 'Representative illustrations. Actual model, seating, AC, luggage space and availability are confirmed with your quote. ':'Vehicle pictures are examples. Ask us about seats, luggage space and available vehicles.',
 'Share your name and travel details. Review your enquiry and send it on WhatsApp.':'Add your name and trip details. Check them, then send them on WhatsApp.',
 'Choose your travel preferences below.':'Choose what you need below.',
 'Request a quote':'Ask about this trip',
 'customised itineraries':'trip plans made for you',
 'Create a custom itinerary':'Make your own trip',
 'Custom Packages':'Plan Your Own Trip',
 'YOUR JOURNEY, YOUR WAY':'CHOOSE YOUR TEMPLES',
 'Make this journey<br>your own.':'Plan your own<br>temple trip.',
 'Family Spiritual Tour':'Family Temple Trip',
 'South Andhra Temple Circuit':'South Andhra Temple Trip',
 'Tirupati and Vellore Pilgrimage':'Tirupati and Vellore Temple Trip',
 'South India Temple Yatra':'South India Temple Trip',
 'Seven Sacred Destinations':'Seven-Temple Package',
 'Our complete seven-place pilgrimage. Travel, stays and darshan assistance arranged around your needs.':'Visit all seven temples. Ask us for help with vehicles, hotels and darshan tickets.',
 'A family pilgrimage through Tirupati and Tirumala, with nearby temples, hotel coordination and transfers.':'Visit Tirupati, Tirumala and nearby temples with your family. We help with hotels and travel.',
 'A customised multi-day South India temple journey, from Tirupati and Kanchipuram to Madurai and Rameswaram.':'A temple trip from Tirupati and Kanchipuram to Madurai and Rameswaram. Choose the days you need.',
 'Arrival, Tirumala travel, local sightseeing when time allows and a return drop. Ideal for short-stay pilgrims.':'Pickup in Tirupati, travel to Tirumala, nearby temple visits if time allows, and a return drop.',
 'The extended yatra, including Kanchipuram and Thiruthani.':'A five-day temple trip with Kanchipuram and Thiruthani.',
 'A temple circuit with a night in Tiruvannamalai.':'Temple visits with a night in Tiruvannamalai.',
 'Hotel coordination and transfers':'Help with hotels, pickup and drop',
 'hotel coordination':'hotel booking help',
 'Ideal for short-stay pilgrims':'Good for a short visit',
 'Corporate & devotional groups':'Work & temple groups',
 'Comfort & flexibility':'Comfort & space',
 'Travellers:':'People:',
 '>Travellers <':'>People <',
 'TRAVELLERS':'PEOPLE',
 "'ITINERARY'":"'TRIP PLAN'",
}
for filename in ['src/booking/main.tsx','src/booking/data.ts','src/tours.js']:
 p=R/filename;s=p.read_text(encoding='utf-8')
 for old,new in sorted(phrases.items(),key=lambda item:-len(item[0])):s=s.replace(old,new)
 if filename.endswith('main.tsx'):
  s=s.replace('import {SERVICES,PACKAGES,','import {SERVICES,SERVICE_LABELS,PACKAGES,')
  s=s.replace('<option key={s}>{s}</option>','<option key={s} value={s}>{SERVICE_LABELS[s]}</option>')
  s=s.replace('`Service: ${state.service}`','`Service: ${SERVICE_LABELS[state.service]||state.service}`')
  s=s.replace('Please confirm the travel arrangements, hotel booking help, vehicle model, seating and availability. Darshan tickets depend on official availability.','Please confirm the temples, hotel needs, vehicle, seats and available dates. Darshan tickets depend on official availability.')
 p.write_text(s,encoding='utf-8')

p=V/'page.html';s=p.read_text(encoding='utf-8')
start=s.index('<section id="our-approach"');end=s.index('</section>',start)+10
services='''<section id="our-approach" class="travel-help-section" aria-labelledby="travel-help-title"><header class="travel-help-heading"><div><p class="section-overline">OTHER TRAVEL SERVICES</p><h2 id="travel-help-title">Need help with<br><em>anything else?</em></h2></div><p>We also help with hotels, flights, pickup and group trips. Choose what you need.</p></header><div class="travel-help-options"><article><h3>Hotel bookings</h3><p>Help finding and booking a place to stay.</p><button type="button" data-enquiry="Hotel &amp; accommodation">Ask about hotels</button></article><article><h3>Flight tickets</h3><p>Help booking flights within India and to other countries.</p><button type="button" data-enquiry="Domestic / international flights">Ask about flights</button></article><article><h3>Pickup &amp; drop</h3><p>Travel from the airport or station, or to another city.</p><button type="button" data-enquiry="Airport / railway pickup &amp; drop">Plan a pickup</button></article><article><h3>Group trips</h3><p>For 3–200 people. Cars, Tempo Travellers and buses.</p><button type="button" data-enquiry="Group package">Plan a group trip</button></article></div><p class="travel-help-reach">Travel from Bengaluru, Chennai, Hyderabad and across India.</p></section>'''
s=s[:start]+services+s[end:]
# Preserve internal service values; show plain labels in the native form.
for value,label in labels.items():s=s.replace('<option>'+html.escape(value,quote=False)+'</option>','<option value="'+html.escape(value,quote=True)+'">'+html.escape(label,quote=False)+'</option>')
for old,new in sorted(phrases.items(),key=lambda item:-len(item[0])):s=s.replace(old,new)
s=s.replace('>Travel assistance</a>','>Other services</a>')
s=s.replace('<h2 id="faq-title">A little clarity<br>for the journey.</h2>','<h2 id="faq-title">Common questions</h2>')
s=s.replace('Need more information?<br>Feel free to <button type="button" class="inline-link" data-contact>reach out.</button>','Still have a question? <button type="button" class="inline-link" data-contact>Ask our team.</button>')
start=s.index('<section class="final-cta');end=s.index('</section>',start)+10
closing='''<section class="closing-booking" aria-labelledby="final-title"><div class="closing-booking-copy"><p class="section-overline">HEAVENLY TOURS &amp; TRAVELS · TIRUPATI</p><h2 id="final-title">Ready to book<br><em>your temple trip?</em></h2><p>Send us your travel date, number of people and pickup place. Our team will help you plan the trip.</p></div><div class="closing-booking-actions"><a class="button primary" href="https://wa.me/919700181493?text=Hello%20Heavenly%20Tours%20%26%20Travels%2C%20I%20need%20help%20planning%20a%20temple%20trip." target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a><a class="closing-phone" href="tel:+919700181493">Call +91 97001 81493</a><span>Based in Tirupati. Here to help with your trip.</span></div></section>'''
s=s[:start]+closing+s[end:]
s=s.replace('<button type="button" class="inline-link" id="credits-open">','<button type="button" class="inline-link" id="showreel-open" aria-haspopup="dialog">Watch the hills video</button><button type="button" class="inline-link" id="credits-open">')
s=s.replace('/*__DIRECT_FLOW_CSS__*/','/*__DIRECT_FLOW_CSS__*/\n/*__SIMPLE_CLOSING_CSS__*/')
s=s.replace('Travellers in your group','How many people?').replace('Number of travellers','Number of people').replace('One fewer traveller','One fewer person').replace('One more traveller','One more person')
p.write_text(s,encoding='utf-8')
p=V/'vehicles.html';s=p.read_text(encoding='utf-8').replace('/*__DIRECT_FLOW_CSS__*/','/*__DIRECT_FLOW_CSS__*/\n/*__SIMPLE_CLOSING_CSS__*/');p.write_text(s,encoding='utf-8')
p=V/'pilgrimage.js';s=p.read_text(encoding='utf-8').replace("document.getElementById('services-secondary').addEventListener","document.getElementById('services-secondary')?.addEventListener");p.write_text(s,encoding='utf-8')
p=V/'app.js';s=p.read_text(encoding='utf-8')
for old,new in sorted(phrases.items(),key=lambda item:-len(item[0])):s=s.replace(old,new)
faqs=[['How do I book a trip?','Choose a package and vehicle, then send your details on WhatsApp. Our team will confirm the trip with you. You do not pay on this website.'],['Can I change the temples or number of days?','Yes. Open Plan Your Own Trip, or tell us what you want on WhatsApp. We can help you plan a different trip.'],['Can you help with Tirumala darshan tickets?','Darshan tickets depend on official availability. Ask us what help is available. Tickets and entry times are not guaranteed.'],['Can older people and children travel with us?','Yes. Tell us if anyone needs less walking, extra rest or room for luggage. We will help you choose a suitable vehicle and plan.'],['Can you pick us up from an airport or station?','Yes. Share your arrival place and time so we can plan your pickup.'],['What if I have not chosen a travel date?','You can ask us now and choose your travel date later.']]
start=s.index('const faqs=');end=s.index('\nfaqs.forEach',start)
s=s[:start]+'const faqs='+json.dumps(faqs,ensure_ascii=False)+';'+s[end:]
s=s.replace("`Service requested: ${$('#service-request').value}`","`Service requested: ${$('#service-request').selectedOptions[0].text}`")
s=s.replace("'Hotel destination or city'","'City for your hotel'").replace("'Departure city or airport'","'City or airport you leave from'")
s=s.replace("'Destination city or airport'","'City or airport you are going to'").replace("'Preferred hotel (optional)'","'Hotel name, if you have one'")
s=s.replace("'Preferred travel dates, airline preferences and any other requests…'","'Travel dates, airline name if you have one, and anything else you need…'")
s=s.replace("'Travel dates, number of rooms, room preferences and any other requests…'","'Travel dates, number of rooms, and anything else you need…'")
p.write_text(s,encoding='utf-8')
p=R/'build_v3.py';s=p.read_text(encoding='utf-8').replace("('DIRECT_FLOW_CSS','direct-package-flow.css')","('DIRECT_FLOW_CSS','direct-package-flow.css'),('SIMPLE_CLOSING_CSS','simple-closing.css')");p.write_text(s,encoding='utf-8')
print('Simpler package wording, service labels, six FAQs and a focused closing section prepared.')
