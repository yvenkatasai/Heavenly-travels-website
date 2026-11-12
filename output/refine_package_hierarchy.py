from pathlib import Path
import re,shutil,json,urllib.request
R=Path(__file__).resolve().parents[1];V=R/'src/v3';B=R/'output/pre-package-hierarchy'
if not B.exists():
 for name in ['src/v3/page.html','src/v3/vehicles.html','src/v3/app.js','src/booking/main.tsx','build_v3.py']:
  dest=B/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(R/name,dest)

# Official Google Fonts distribution, served locally with the font's OFL.
folder=V/'assets/fonts';css_url='https://fonts.googleapis.com/css2?family=Cinzel:wght@600&display=swap&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%20%26'
css=urllib.request.urlopen(css_url,timeout=30).read().decode()
url=re.search(r'url\(([^)]+)\)',css)[1]
font=urllib.request.urlopen(url,timeout=30).read();assert font[:4] in [b'wOF2',b'\x00\x01\x00\x00'],'Expected web font.'
extension='woff2' if font[:4]==b'wOF2' else 'ttf'
(folder/('cinzel-labels.'+extension)).write_bytes(font)
license_url='https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/OFL.txt'
(folder/'cinzel-OFL.txt').write_bytes(urllib.request.urlopen(license_url,timeout=30).read())
(folder/'cinzel-source.json').write_text(json.dumps({'family':'Cinzel','css':css_url,'file':url,'license':license_url,'use':'Category labels only; serif titles and readable sans-serif body remain distinct.'},indent=2))

def chapter(number,label,note,extra=''):
 return f'<div class="package-chapter {extra}"><span class="chapter-number" aria-hidden="true">{number}</span><p class="chapter-name">{label}</p><span class="chapter-note">{note}</span></div>'

p=V/'page.html';s=p.read_text(encoding='utf-8')
s=s.replace('/*__COMPACT_CSS__*/','/*__COMPACT_CSS__*/\n/*__HIERARCHY_CSS__*/')
s=s.replace('<a class="header-link header-services" href="#pilgrimage">Our services</a>','<a class="header-link header-services" href="#our-approach">Travel assistance</a>')
s=s.replace('<a class="header-pricing header-link" href="#journeys">Our tours</a>','<a class="header-pricing header-link" href="#package-types">Packages</a>')
s=s.replace('href="#pilgrimage">See packages','href="#package-types">See packages')
categorynav='''<nav id="package-types" class="package-category-nav" aria-label="Choose a package type"><div class="category-nav-intro"><span class="section-overline">FIND YOUR PILGRIMAGE</span><h2>Choose your kind of journey</h2></div><div class="category-nav-links"><a href="#pilgrimage"><strong>Complete Package</strong><span>All 7 temples</span></a><a href="#journeys"><strong>Individual Packages</strong><span>Choose from 5 routes</span></a><a href="#day-packages"><strong>Day-wise Packages</strong><span>Choose 1–5 days</span></a></div></nav>'''
start='<section id="pilgrimage" class="signature-section" aria-labelledby="pilgrimage-title">'
s=s.replace(start,categorynav+start+chapter('01','Complete Package','7 temples · One route','chapter-inverse'))
s=s.replace('<p class="eyebrow">OUR SIGNATURE PILGRIMAGE</p>','<p class="eyebrow">THE SEVEN-TEMPLE PILGRIMAGE</p>')
s=s.replace('<p class="eyebrow">YOUR PILGRIMAGE, BEAUTIFULLY ARRANGED</p>','<p class="eyebrow">CHOOSE ONE OF FIVE ROUTES</p>')
s=s.replace('<h2 id="journeys-title">Five journeys.<br><em>Find yours.</em></h2>','<h2 id="journeys-title">Individual temple<br><em>journeys.</em></h2>')
start='<section id="journeys" class="pilgrimage-packages" aria-labelledby="journeys-title">'
s=s.replace(start,start+chapter('02','Individual Packages','5 routes · Choose one'))
start='<section id="our-approach" class="complete-pilgrimage heritage-container" aria-labelledby="complete-title">'
s=s.replace(start,start+chapter('04','Travel Assistance','Flights · Stays · Groups'))
s=s.replace('<p class="eyebrow">YOUR TIRUPATI PILGRIMAGE, OUR RESPONSIBILITY</p>','<p class="eyebrow">HELP BEYOND THE TEMPLE ROUTE</p>')
s=s.replace('<h2 id="complete-title">Complete Tirupati<br><em>Pilgrimage Services.</em></h2>','<h2 id="complete-title">The rest of your trip,<br><em>taken care of.</em></h2>')
s=s.replace('<summary>Need a different route? Build a custom trip</summary>','<summary><span class="custom-plan-title">Custom Packages</span><span class="custom-plan-note">Choose your own temples and travel days</span></summary>')
s=s.replace('Fonts: Cormorant Garamond and DM Sans,','Fonts: Cinzel, Cormorant Garamond and DM Sans,')
p.write_text(s,encoding='utf-8')
p=V/'vehicles.html';s=p.read_text(encoding='utf-8').replace('/*__COMPACT_CSS__*/','/*__COMPACT_CSS__*/\n/*__HIERARCHY_CSS__*/');p.write_text(s,encoding='utf-8')
p=V/'app.js';s=p.read_text(encoding='utf-8').replace('<a href="#journeys"><span aria-hidden="true">◇</span> Tours</a>','<a href="#package-types"><span aria-hidden="true">◇</span> Packages</a>');p.write_text(s,encoding='utf-8')
p=R/'src/booking/main.tsx';s=p.read_text(encoding='utf-8')
start='<section id="day-packages" className="day-packages" aria-labelledby="day-packages-title">'
s=s.replace(start,start+'<div className="package-chapter flow-container"><span className="chapter-number" aria-hidden="true">03</span><p className="chapter-name">Day-wise Packages</p><span className="chapter-note">1–5 days · Choose your duration</span></div>')
s=s.replace('STAY A DAY. STAY A LITTLE LONGER.','CHOOSE BY TRIP LENGTH')
s=s.replace('Your time.<br/><em>Your temple journey.</em>','One day or five.<br/><em>A journey for your time.</em>')
s=s.replace('02 · CHOOSE YOUR VEHICLE','02 · VEHICLE SELECTION').replace('Together,<br/><em>in comfort.</em>','Choose your<br/><em>vehicle.</em>')
p.write_text(s,encoding='utf-8')
p=R/'build_v3.py';s=p.read_text(encoding='utf-8').replace("('COMPACT_CSS','compact-layout.css')","('COMPACT_CSS','compact-layout.css'),('HIERARCHY_CSS','package-hierarchy.css')");p.write_text(s,encoding='utf-8')
print('Clear package categories and local inscription font prepared:',len(font),'font bytes.')
