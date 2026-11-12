from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request,json,hashlib
root=Path('.');base='https://heavenly-tours.vercel.app'
with urllib.request.urlopen(base+'/',timeout=25) as r:
 page=r.read();status=r.status
assert hashlib.sha256(page).digest()==hashlib.sha256((root/'dist/index.html').read_bytes()).digest(),'Production HTML differs from the local build.'
with urllib.request.urlopen(base+'/vehicles.html?package=days-5',timeout=25) as response:
 vehicle_page=response.read()
assert hashlib.sha256(vehicle_page).digest()==hashlib.sha256((root/'dist/vehicles.html').read_bytes()).digest(),'Production vehicle page differs from the local build.'
assert '₹' not in page.decode('utf-8') and '₹' not in vehicle_page.decode('utf-8'),'Currency amount remains in active HTML.'
paths=['/assets/'+str(p.relative_to(root/'src/v3/assets')).replace('\\','/') for p in (root/'src/v3/assets').rglob('*') if p.is_file()]
def head(path):
 with urllib.request.urlopen(urllib.request.Request(base+path,method='HEAD'),timeout=25) as r:return {'path':path,'status':r.status,'type':r.headers.get('Content-Type')}
with ThreadPoolExecutor(max_workers=4) as pool:checks=list(pool.map(head,paths))
req=urllib.request.Request(base+'/assets/showreel.mp4',headers={'Range':'bytes=0-1023'})
with urllib.request.urlopen(req,timeout=25) as r:
 range_status=r.status;range_header=r.headers.get('Content-Range');assert len(r.read())==1024 and range_status==206
report={'url':base,'html_status':status,'html_matches_build':True,'vehicle_page_matches_build':True,'assets':checks,'video_range_status':range_status,'video_content_range':range_header}
(root/'output/vercel-live-check.json').write_text(json.dumps(report,indent=2));print(json.dumps({'html_matches_build':True,'assets_ok':len(checks),'video_range_status':range_status}))
s=json.loads((root/'output/rea-qa/v3/branding-mobile.json').read_text());s['start_url']['url']=base;s['actions']=[{'step_id':'live-mobile','action':'wait_for_timeout','duration_ms':3000}];s['capture']={'at_end':['screenshot','dom','accessibility'],'events':['page-errors']};(root/'output/rea-qa/v3/live-mobile.json').write_text(json.dumps(s))
