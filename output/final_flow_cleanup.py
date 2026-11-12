from pathlib import Path
import re,json
R=Path(__file__).resolve().parents[1];V=R/'src/v3'
p=R/'src/booking/main.tsx';s=p.read_text(encoding='utf-8');s=s.replace("closest<HTMLAnchorElement>('a[href*=\"vehicles.html\"]')","closest<HTMLElement>('a[href*=\"vehicles.html\"],[data-tour-pick],#header-vehicles,#quick-vehicles')");s=s.replace("vehicle:!query&&FLEET.some(v=>v.id===saved.vehicle)","vehicle:(!query||query===saved.packageId)&&FLEET.some(v=>v.id===saved.vehicle)");p.write_text(s,encoding='utf-8')
for name in ['page.html','app.js','style.css','travel-theme.css','heritage.css','pilgrimage.css','booking.css','heritage-effects.js']:
 p=V/name;s=p.read_text(encoding='utf-8').replace('#pricing','#custom-trip').replace('id="pricing"','id="custom-trip"')
 if name=='page.html':s=s.replace('class="estimate" id="estimate"','class="route-ready" id="route-ready"').replace('Hero Dot Field adapted from the user-supplied MIT component by Dorian Baffier / Kokonut UI.','Hero Dot Field and Momentum Rail adapted from the user-supplied MIT components by Dorian Baffier / Kokonut UI. The rail retains the supplied momentum and spring physics, with original pilgrimage content and styling.')
 if name=='app.js':s=s.replace("$('#estimate')","$('#route-ready')").replace("join(' → ');;","join(' → ');")
 p.write_text(s,encoding='utf-8')
license='''Momentum Rail — adapted from the user-supplied component
Author: @dorianbaffier / Kokonut UI, version 2.0.0, 2026-10-14
https://kokonutui.com
https://github.com/kokonut-labs/kokonutui

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
'''
(V/'assets/momentum-rail.LICENSE.txt').write_text(license,encoding='utf-8')
p=R/'README-V3.md';s=p.read_text(encoding='utf-8');s=re.sub(r'Five starting tours, fourteen optional temple stops.*?There is no automatic booking, payment or message\.', 'The homepage leads from the hero to the scroll-mask seven-place pilgrimage, five individual tour cards and a one-to-five-day Momentum Rail. Every package opens a dedicated vehicles.html page with five horizontally sliding vehicle tiles. Selecting a vehicle opens a review dialog. Slide to WhatsApp or use the accessible tap alternative to open a manual draft with the selected package, full itinerary and vehicle. All prices, per-stop fees, base amounts and estimated totals have been removed from active pages, data and drafts. The optional custom-route planner remains. There is no automatic booking, payment or message.',s,flags=re.S);s=s.replace('pricing tabs','planning tabs');p.write_text(s,encoding='utf-8')
config=R/'vercel.json';v=json.loads(config.read_text());v['headers'].insert(1,{'source':'/vehicles.html','headers':[{'key':'Cache-Control','value':'public, max-age=0, must-revalidate'}]});config.write_text(json.dumps(v,indent=2))
print('Removed obsolete estimate identifiers; preserved service and customer details on every navigation path.')
