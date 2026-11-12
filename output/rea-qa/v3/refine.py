from pathlib import Path
p=Path('src/v3/app.js');s=p.read_text(encoding='utf-8')
s=s.replace("$('#route-error').hidden=state.stops.length>0||!chosen;","$('#route-error').hidden=true;")
s=s.replace("label.querySelector('input').onchange=e=>{state.stops=", "label.querySelector('input').onchange=e=>{if(state.tour===''){state.tour='custom';$('#tour-select').value='custom'}state.stops=")
replacements={
'Yes. Choose a starting tour and change the temple stops, or build your own route. We will discuss travel times and help arrange the final itinerary.':'Yes. Pick a tour, then add or remove temples. You can also build your own route.',
'The website adds the selected vehicle base and ₹249 for each selected temple stop. This is an indicative starting estimate. Distance, travel days, tolls, permits, parking and other arrangements are confirmed in your final quote.':'The estimate adds a vehicle base and ₹249 per temple stop. The final price also depends on distance, days and other travel costs. We confirm it before you book.',
'Sedan, SUV, Tempo Traveller and Mini bus / Bus options are available to discuss. Actual models, seating, air conditioning, luggage capacity and availability are confirmed by our team.':'Choose Sedan, SUV, Tempo Traveller or Bus. Call us to confirm seats, luggage space, AC and availability.',
'We can discuss your travel and available assistance. Darshan tickets, slots and eligibility follow official rules and availability; they are not guaranteed by an enquiry or this website.':'Ask us about available help. Darshan tickets and time slots follow official rules and availability. We cannot guarantee them.',
'Tell us your pickup and drop-off locations, such as your Tirupati hotel, station or airport. We will confirm whether your requested locations can be included and any additional costs.':'Tell us your hotel, station, airport or other pickup place. We will confirm the route and any extra cost.',
'Tell us about your group, mobility needs, luggage and preferred pace. We can discuss suitable vehicles, breaks and route adjustments before confirming the arrangements.':'Yes. Tell us about any walking, luggage or comfort needs. We can discuss a suitable ride and rest breaks.',
'Choose the flexible-date option or leave the date blank. You can start a conversation now and confirm your travel dates with our team.':'Tick “I haven’t decided my date yet.” You can talk to us now and choose a date later.',
'Send your enquiry through the WhatsApp draft or call our team. We confirm the itinerary, availability, final costs and payment arrangements personally. This website does not collect payments or confirm bookings.':'Send your trip on WhatsApp or call us. We confirm your plan, price and payment details personally. You do not pay on this website.',
'Choose a starting route to see its temples and estimate. You can also ask us to help plan the whole trip.':'Choose a tour to see the temples and starting price. Need help? Tap Get a quote.',
'Your choices are ready for a quote. Distance, days and availability are confirmed personally.':'Your plan is ready. Tap Get a quote to confirm the final price.',
'Estimate uses the Sedan reference base. Your vehicle and final quote will be confirmed with our team.':'This estimate uses a Sedan base. Choose a vehicle or ask us for help.',
}
for a,b in replacements.items():s=s.replace(a,b)
p.write_text(s,encoding='utf-8')
p=Path('src/v3/style.css');s=p.read_text(encoding='utf-8');s+='\n.hero-title{letter-spacing:-.055em;line-height:.94}.site-header nav{background:#f1f1f1e8;backdrop-filter:blur(12px);border-radius:10px;padding:5px}.site-header{top:37px}.hero-description{letter-spacing:-.025em}.pricing-intro h2,.catchphrase h2,.final-inner h2{letter-spacing:-.05em}@media(max-width:767px){.site-header{top:13px;right:19px}.hero-title{letter-spacing:-.055em}.tour-mini-footer>span{font-size:11px}.site-header nav{padding:5px}.values-heading h2{letter-spacing:-.045em}}\n';p.write_text(s,encoding='utf-8')
