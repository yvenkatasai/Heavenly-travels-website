from pathlib import Path
import argparse,shutil,subprocess,hashlib

ROOT=Path(__file__).resolve().parent
SRC=ROOT/'src/v3'
subprocess.run(['node',str(ROOT/'scripts/build-booking.mjs')],cwd=ROOT,check=True)
parser=argparse.ArgumentParser()
parser.add_argument('--output',default='dist')
args=parser.parse_args()
out=(ROOT/args.output).resolve()
if not out.is_relative_to(ROOT):raise SystemExit('Build output must stay in this project.')
page=(SRC/'page.html').read_text(encoding='utf-8')
vehicle_page=(SRC/'vehicles.html').read_text(encoding='utf-8')
for token,name in [('CSS','style.css'),('THEME','travel-theme.css'),('HERITAGE','heritage.css'),('PILGRIMAGE_CSS','pilgrimage.css'),('BOOKING_CSS','booking.css'),('FINAL_FLOW_CSS','final-flow.css'),('COMPACT_CSS','compact-layout.css'),('HIERARCHY_CSS','package-hierarchy.css'),('DIRECT_FLOW_CSS','direct-package-flow.css'),('SIMPLE_CLOSING_CSS','simple-closing.css'),('MOBILE_NAV_CSS','mobile-nav.css'),('COMPLETE_PACKAGE_CSS','complete-package.css'),('MOBILE_NAV_JS','mobile-nav.js'),('PILGRIMAGE_JS','pilgrimage.js'),('APP','app.js'),('EFFECTS','heritage-effects.js'),('DATA','data.js'),('INTRO','intro.js'),('DOT_FIELD','dot-field.js')]:
 content=(SRC/name).read_text(encoding='utf-8')
 page=page.replace('/*__'+token+'__*/',content)
 vehicle_page=vehicle_page.replace('/*__'+token+'__*/',content)
page=page.replace('/*__TOURS__*/',(ROOT/'src/tours.js').read_text(encoding='utf-8'))
page=page.replace('{{CREDITS}}',(ROOT/'src/credits.html').read_text(encoding='utf-8'))
for asset in ['booking-flow.js','booking-tailwind.css']:
 digest=hashlib.sha256((SRC/'assets'/asset).read_bytes()).hexdigest()[:12]
 page=page.replace('assets/'+asset+'"','assets/'+asset+'?v='+digest+'"')
 vehicle_page=vehicle_page.replace('assets/'+asset+'"','assets/'+asset+'?v='+digest+'"')
assert '/*__' not in page and '{{' not in page and '/*__' not in vehicle_page
out.mkdir(parents=True,exist_ok=True)
(out/'index.html').write_text(page,encoding='utf-8')
(out/'vehicles.html').write_text(vehicle_page,encoding='utf-8')
shutil.copytree(SRC/'assets',out/'assets',dirs_exist_ok=True)
print(f'Heavenly 3.0.0 built: {out} ({len(page.encode()):,} HTML bytes)')

