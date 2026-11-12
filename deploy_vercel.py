"""Deploy the built V3 assets only, using the current Vercel CLI login in memory."""
from pathlib import Path
import argparse,json,hashlib,urllib.request,urllib.error,time
from concurrent.futures import ThreadPoolExecutor

ROOT=Path(__file__).resolve().parent
REPORT=ROOT/'output/vercel-deployment.json'
parser=argparse.ArgumentParser();parser.add_argument('--status',action='store_true');args=parser.parse_args()
data=Path.home()/'AppData/Roaming/com.vercel.cli/Data'
token=json.loads((data/'auth.json').read_text())['token']
team=json.loads((data/'config.json').read_text()).get('currentTeam')
PROJECT='heavenly-tours'
def request(path,method='GET',body=None,headers=None):
 separator='&' if '?' in path else '?'
 url='https://api.vercel.com'+path+(separator+'teamId='+team if team else '')
 h={'Authorization':'Bearer '+token,**(headers or {})}
 if isinstance(body,dict):body=json.dumps(body).encode();h['Content-Type']='application/json'
 req=urllib.request.Request(url,data=body,method=method,headers=h)
 try:
  with urllib.request.urlopen(req,timeout=60) as response:
   raw=response.read();return json.loads(raw) if raw else {}
 except urllib.error.HTTPError as error:
  try:info=json.loads(error.read());message=info.get('error',{}).get('message','Request failed')
  except Exception:message='Request failed'
  raise RuntimeError(f'Vercel HTTP {error.code}: {message}') from None

if args.status:
 previous=json.loads(REPORT.read_text());deployment=request('/v13/deployments/'+previous['id'])
 summary={key:deployment.get(key) for key in ['id','url','readyState','alias','aliasAssigned','errorCode','errorMessage','target']}
 summary['project']=PROJECT;REPORT.write_text(json.dumps(summary,indent=2));print(json.dumps(summary));raise SystemExit()

project=request('/v9/projects/'+PROJECT)
if project.get('accountId')!=team:raise SystemExit('Authenticated team does not match the intended project.')
if project.get('id')!='prj_c6IfMxCmaOxhnzUOBCdXSYppZ1ho':raise SystemExit('Unexpected project: refusing to deploy.')
page=(ROOT/'dist/index.html').read_text(encoding='utf-8')
if 'brand-intro' not in page or 'hero-business-name' not in page:raise SystemExit('Build the latest branding first.')
assets=ROOT/'src/v3/assets'
paths=[ROOT/'dist/index.html',ROOT/'dist/vehicles.html',ROOT/'vercel.json']
paths += [ROOT/'dist/assets'/p.relative_to(assets) for p in sorted(assets.rglob('*')) if p.is_file()]
files=[]
for p in paths:
 content=p.read_bytes();files.append({'file':str(p.relative_to(ROOT)).replace('\\','/'),'sha':hashlib.sha1(content).hexdigest(),'size':len(content),'path':p})
print(f'Uploading {len(files)} static files ({sum(f["size"] for f in files):,} bytes) to {PROJECT}.',flush=True)
def upload(f):
 for attempt in range(3):
  try:
   request('/v2/files','POST',f['path'].read_bytes(),{'Content-Type':'application/octet-stream','Content-Length':str(f['size']),'x-vercel-digest':f['sha']})
   break
  except (TimeoutError,urllib.error.URLError,ConnectionError,OSError):
   if attempt==2:raise
   print('Retrying content-addressed upload:',f['file'],flush=True);time.sleep(attempt+1)
 return {k:f[k] for k in ['file','sha','size']}
with ThreadPoolExecutor(max_workers=3) as pool:references=list(pool.map(upload,files))
payload={'name':PROJECT,'project':project['id'],'target':'production','files':references,'projectSettings':{'framework':None,'buildCommand':'','installCommand':'','outputDirectory':'dist'},'meta':{'version':'3.0.0','change':'Complete package free extras: pickup and drop for the booked trip, plus temple-visit planning help; short list with no free hotel/flight/ticket claims'}}
deployment=request('/v13/deployments','POST',payload)
summary={key:deployment.get(key) for key in ['id','url','readyState','alias','aliasAssigned','errorCode','errorMessage','target']};summary['project']=PROJECT
REPORT.parent.mkdir(parents=True,exist_ok=True);REPORT.write_text(json.dumps(summary,indent=2))
(ROOT/'.vercel').mkdir(exist_ok=True);(ROOT/'.vercel/project.json').write_text(json.dumps({'orgId':team,'projectId':project['id'],'projectName':PROJECT},indent=2))
print(json.dumps(summary),flush=True)






