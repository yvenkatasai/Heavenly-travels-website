import re,json,sys,base64
from pathlib import Path
p=Path(sys.argv[1]);s=p.read_text(encoding='utf-8-sig');decoder=json.JSONDecoder();found=set()
for match in re.finditer(r'\{"step_index"\s*:',s):
 try:step,end=decoder.raw_decode(s[match.start():])
 except ValueError:continue
 index=step['step_index'];found.add(index)
 (p.parent/(p.stem+'-step-'+str(index)+'.json')).write_text(json.dumps(step),encoding='utf-8')
 shot=step.get('artifacts',{}).get('screenshot',{}).get('value',{})
 if shot.get('data_base64'):(p.parent/(p.stem+'-step-'+str(index)+'.png')).write_bytes(base64.b64decode(shot['data_base64']))
print('Retained complete step objects:',sorted(found))
