import json,urllib.request
from pathlib import Path
data=Path.home()/'AppData/Roaming/com.vercel.cli/Data';auth=json.loads((data/'auth.json').read_text());team=json.loads((data/'config.json').read_text()).get('currentTeam')
for name in ['heavenly-tours','heavenly-tours-travels']:
 url='https://api.vercel.com/v9/projects/'+name+('?teamId='+team if team else '')
 with urllib.request.urlopen(urllib.request.Request(url,headers={'Authorization':'Bearer '+auth['token']}),timeout=25) as r:p=json.load(r)
 out={key:p.get(key) for key in ['id','name','createdAt','updatedAt','accountId','framework','rootDirectory','buildCommand','outputDirectory']};out['production']={key:p.get('targets',{}).get('production',{}).get(key) for key in ['url','alias','createdAt','readyState','id']}
 print(json.dumps(out));Path('output/rea-qa/v3/'+name+'-vercel-project.json').write_text(json.dumps(out,indent=2))
