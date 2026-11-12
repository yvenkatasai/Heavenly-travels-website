import json,urllib.request,urllib.error
from pathlib import Path
data=Path.home()/'AppData/Roaming/com.vercel.cli/Data'
auth=json.loads((data/'auth.json').read_text());config=json.loads((data/'config.json').read_text())
def get(path):
 req=urllib.request.Request('https://api.vercel.com'+path,headers={'Authorization':'Bearer '+auth['token']})
 try:
  with urllib.request.urlopen(req,timeout=25) as r:return json.load(r)
 except urllib.error.HTTPError as e:return {'http_error':e.code}
 except Exception as e:return {'error':type(e).__name__}
user=get('/v2/user');print('Account:',json.dumps({'username':user.get('user',{}).get('username'),'http_error':user.get('http_error'),'error':user.get('error')}))
team=config.get('currentTeam');q='?limit=100'+('&teamId='+team if isinstance(team,str) and team else '')
projects=get('/v9/projects'+q)
print('Projects:',json.dumps([{'name':p.get('name'),'id':p.get('id'),'framework':p.get('framework')} for p in projects.get('projects',[])],ensure_ascii=True));print('Project lookup status:',projects.get('http_error',projects.get('error','OK')))
Path('output/rea-qa/v3/vercel-context.json').write_text(json.dumps({'team':team,'projects':[{'name':p.get('name'),'id':p.get('id')} for p in projects.get('projects',[])]}),encoding='utf-8')
