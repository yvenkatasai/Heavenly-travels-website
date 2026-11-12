from pathlib import Path
import re,shutil
R=Path(__file__).resolve().parents[1];V=R/'src/v3';B=R/'output/pre-complete-package-clarity';B.mkdir(exist_ok=True)
for name in ['src/v3/page.html','src/booking/main.tsx','src/booking/data.ts']:
 dest=B/name;dest.parent.mkdir(parents=True,exist_ok=True)
 if not dest.exists():shutil.copy2(R/name,dest)
p=V/'page.html';s=p.read_text(encoding='utf-8')
start=s.index('<section id="pilgrimage"');end=s.index('</article></section>',start)+len('</article></section>');section=s[start:end]
section=section.replace('<p id="complete-category" class="chapter-name">Complete Package</p>','<p id="complete-category" class="chapter-name">Complete 7-Temple Package</p>')
section=section.replace('7 temples · One route','All 7 temples included')
section=section.replace('Seven temples.<br><em>One complete trip.</em>','All 7 temples.<br><em>One complete package.</em>')
section=section.replace('Travel, stays and assistance, arranged around you.','Visit all seven temples listed below in one complete trip.')
section=section.replace('<div><p class="eyebrow">THE SEVEN DESTINATIONS</p><h3>Your seven<br><em>temple stops.</em></h3><p>Choose this package, then pick your vehicle.</p><a class="button primary" href="vehicles.html?package=seven-temple">Select this package</a></div>','<div class="signature-package-summary"><p class="eyebrow">ONE PACKAGE · ALL SEVEN TEMPLES</p><h3>All 7 temples.<br> <em>One package.</em></h3><p>You will visit every temple in this list. You do not need to choose a separate package for each temple.</p></div>')
section=section.replace('THE SEVEN TEMPLE STOPS','TEMPLES INCLUDED IN THIS PACKAGE')
choice='''<div class="signature-package-choice"><p class="signature-inclusion-statement">All 7 temples above are included in this package.</p><a class="button primary" data-complete-package-select href="vehicles.html?package=seven-temple">Select this 7-temple package</a><p class="signature-next-step">Next: choose your vehicle.</p></div>'''
section=section.replace('</ol></div><div id="gateway-service-picker" class="booking-flow"></div>','</ol>'+choice+'</div>')
assert 'gateway-service-picker' not in section
assert 'data-complete-package-select' in section
s=s[:start]+section+s[end:]
s=s.replace('<h2 id="services-title">Your seven-temple trip.</h2>','<h2 id="services-title">Your complete 7-temple trip.</h2>')
s=s.replace('Help with vehicles, hotels and temple visits. Tell us what you need.','This package covers all seven temples listed on the page. Choose your vehicle after selecting the package.')
s=s.replace('/*__MOBILE_NAV_CSS__*/','/*__MOBILE_NAV_CSS__*/\n/*__COMPLETE_PACKAGE_CSS__*/');p.write_text(s,encoding='utf-8')
p=V/'vehicles.html';s=p.read_text(encoding='utf-8').replace('/*__MOBILE_NAV_CSS__*/','/*__MOBILE_NAV_CSS__*/\n/*__COMPLETE_PACKAGE_CSS__*/');p.write_text(s,encoding='utf-8')
p=R/'src/booking/main.tsx';s=p.read_text(encoding='utf-8').replace('useRef,useId','useRef')
start=s.index('function ServicePicker(');end=s.index('function DayRail()',start);s=s[:start]+s[end:]
s=re.sub(r' const changeService=.*?;\n','',s)
s=s.replace("const inside=document.getElementById('gateway-service-picker'),below=document.getElementById('below-gateway-service-picker'),categoryNav=document.getElementById('package-split-nav');","const categoryNav=document.getElementById('package-split-nav');")
s=s.replace('{inside&&createPortal(<ServicePicker inside service={state.service} onChange={changeService}/>,inside)}{below&&createPortal(<ServicePicker service={state.service} onChange={changeService}/>,below)}','')
assert 'ServicePicker' not in s
p.write_text(s,encoding='utf-8')
p=R/'src/booking/data.ts';s=p.read_text(encoding='utf-8').replace('"name": "Seven-Temple Package"','"name": "Complete 7-Temple Package"').replace('Visit all seven temples. Ask us for help with vehicles, hotels and darshan tickets.','All seven temples are included in this package. Choose a vehicle for your trip.');p.write_text(s,encoding='utf-8')
p=R/'build_v3.py';s=p.read_text(encoding='utf-8').replace("('MOBILE_NAV_CSS','mobile-nav.css')","('MOBILE_NAV_CSS','mobile-nav.css'),('COMPLETE_PACKAGE_CSS','complete-package.css')");p.write_text(s,encoding='utf-8')
