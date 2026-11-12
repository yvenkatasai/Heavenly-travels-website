from pathlib import Path
R=Path(__file__).resolve().parents[1]
words={
 'YOUR TEMPLE JOURNEY STARTS HERE':'YOUR TEMPLE TRIP STARTS HERE',
 'TIRUPATI · PRIVATE TEMPLE JOURNEYS':'TIRUPATI · PRIVATE TEMPLE TRIPS',
 'Temple journeys, comfortable vehicles and personal assistance from Tirupati.':'Temple trips, comfortable vehicles and friendly help from Tirupati.',
 'JOURNEYS THROUGH SOUTH INDIA':'TEMPLE TRIPS IN SOUTH INDIA',
 'JOURNEYS THROUGH TIRUPATI &amp; SOUTH INDIA':'TEMPLE TRIPS FROM TIRUPATI',
 'THE SEVEN-TEMPLE PILGRIMAGE':'THE SEVEN-TEMPLE TRIP',
 'EXPLORE FAMOUS TEMPLES &amp; PILGRIMAGE DESTINATIONS':'THE SEVEN TEMPLE STOPS',
 'SEVEN SACRED DESTINATIONS':'SEVEN TEMPLE STOPS',
 'Temple journeys':'Temple trips',
 'Devotional and pilgrimage groups':'Temple and prayer groups',
 'Five pilgrimage packages':'Five temple trip packages',
 'YOUR PILGRIMAGE STARTS WITH A PACKAGE':'CHOOSE A PACKAGE FIRST',
 'Choose your journey first.':'Choose your package first.',
 'Explore the seven-place pilgrimage, our five individual tours, or a one-to-five-day package. Then choose your vehicle here.':'Choose the seven-temple package, another temple trip, or a 1–5 day package. Then choose your vehicle here.',
 'Local temple sightseeing, subject to available time':'Nearby temple visits, if time allows',
 'Tirumala transport':'Travel to Tirumala',
 'Individuals & smaller families':'Small families',
 'Room & flexibility':'More room',
 'Discuss a private AC car for your travel plans.':'An AC car for a small group.',
 'Ask about space for your family and luggage.':'More space for your family and bags.',
 'An option to discuss for family and group travel.':'For families and groups travelling together.',
 'Discuss a suitable group vehicle and seating needs.':'For bigger groups. Ask us about seats.',
 'Group transport arranged to match your party size.':'For large groups. Tell us how many people are coming.',
 '5 routes · Choose one':'5 trips · Choose one',
 'Choose from 5 routes':'Choose from 5 trips',
 'CHOOSE ONE OF FIVE ROUTES':'CHOOSE ONE OF FIVE TRIPS',
 'Choose a route. View the stops. Pick your vehicle.':'Choose a package. See the temples. Pick a vehicle.',
 'Choose this route, then pick your vehicle.':'Choose this package, then pick your vehicle.',
 'Choose at least one temple, or ask our team to help with your route.':'Choose at least one temple, or ask our team for help.',
 'Choose a starting route to see its temples. You can also ask us to help plan the whole trip.':'Choose a package to see its temples. We can also help plan your trip.',
 'WhatsApp draft opened':'WhatsApp opened',
 'Your WhatsApp draft opened. Review it and tap Send in WhatsApp.':'Your message is open in WhatsApp. Check it and tap Send.',
 'Your WhatsApp draft is ready. Review the details and send it when you are ready.':'Your message is ready in WhatsApp. Check it and tap Send.',
 'Review and send your draft in WhatsApp. No payment is taken here.':'Check your message in WhatsApp, then tap Send. No payment is taken here.',
 'Vehicle selected. Review your trip and open the WhatsApp draft.':'Vehicle selected. Check your trip and open WhatsApp.',
 'WhatsApp draft opened. Review and send it in WhatsApp.':'WhatsApp opened. Check your message and tap Send.',
}
for name in ['src/v3/page.html','src/v3/app.js','src/booking/main.tsx','src/booking/data.ts','src/tours.js','components/ui/SlideCommit.tsx']:
 p=R/name;s=p.read_text(encoding='utf-8')
 for old,new in sorted(words.items(),key=lambda item:-len(item[0])):s=s.replace(old,new)
 p.write_text(s,encoding='utf-8')
