import json,re,base64,sys
from pathlib import Path
p=Path(sys.argv[1]);s=p.read_text(encoding='utf-8-sig');dec=json.JSONDecoder();out=p.parent
try:
 root=json.loads(s)
 def extract(v):
  if isinstance(v,dict):
   if 'steps' in v and 'events' in v:
    (out/(p.stem+'-observation.json')).write_text(json.dumps(v,ensure_ascii=False),encoding='utf-8')
    for i,step in enumerate(v['steps']):
     (out/(p.stem+'-step-'+str(i)+'.json')).write_text(json.dumps(step,ensure_ascii=False),encoding='utf-8')
     def images(x):
      if isinstance(x,dict):
       if x.get('media_type')=='image/png' and 'data_base64' in x:(out/(p.stem+'-step-'+str(i)+'.png')).write_bytes(base64.b64decode(x['data_base64']))
       for key,val in x.items():
        if isinstance(val,str) and val.startswith('data:image/png;base64,'):(out/(p.stem+'-step-'+str(i)+'.png')).write_bytes(base64.b64decode(val.split(',',1)[1]))
        if key in ['html','text','content'] and isinstance(val,str) and 'V3 browser checks' in val:(out/(p.stem+'-report.txt')).write_text(val,encoding='utf-8')
        images(val)
      elif isinstance(x,list):
       for y in x:images(y)
     images(step)
    print('Extracted',len(v['steps']),'steps; events',str(v['events'])[:500])
    return True
   for val in v.values():
    if extract(val):return True
  return False
 extract(root)
except ValueError:pass
found=[]
for m in re.finditer(r'\{"step_id"\s*:',s):
 try:obj,end=dec.raw_decode(s[m.start():])
 except ValueError:continue
 if obj.get('step_id') in found:continue
 found.append(obj.get('step_id'))
 (out/(p.stem+'-'+str(obj.get('step_id'))+'.json')).write_text(json.dumps(obj),encoding='utf-8')
 def walk(v):
  if isinstance(v,dict):
   for k,x in v.items():
    if isinstance(x,str) and x.startswith('data:image/png;base64,'):(out/(p.stem+'-'+str(obj.get('step_id'))+'.png')).write_bytes(base64.b64decode(x.split(',',1)[1]))
    if k in ['html','text','content'] and isinstance(x,str) and ('V3 browser checks' in x or 'RUNNING' in x):(out/(p.stem+'-report.txt')).write_text(x,encoding='utf-8')
    walk(x)
  elif isinstance(v,list):
   for x in v:walk(x)
 walk(obj)
print(found)
