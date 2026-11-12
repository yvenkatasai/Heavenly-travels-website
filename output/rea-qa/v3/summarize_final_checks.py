from pathlib import Path
import json,html,re,sys
for arg in sys.argv[1:]:
 p=Path(arg);raw=p.read_text(encoding='utf-8-sig');dec=json.JSONDecoder();steps=[]
 for match in re.finditer(r'\{"step_index"\s*:',raw):
  try:step,_=dec.raw_decode(raw[match.start():]);steps.append(step)
  except ValueError:pass
 if not steps:print(p.name,'No complete steps yet');continue
 values=[s['artifacts']['dom']['value']['text'] for s in steps if s.get('artifacts',{}).get('dom',{}).get('state')=='captured']
 results=[]
 for value in values:
  match=re.search(r'<pre id=.results.>(.*?)</pre>',value,re.S)
  if match:
   try:results=json.loads(html.unescape(match[1]))
   except ValueError:pass
 if results:
  (p.parent/(p.stem+'-results.json')).write_text(json.dumps(results,indent=2))
  print(p.name,json.dumps({'summary':results[-1],'failures':[r for r in results if r.get('pass') is False]}))
 else:print(p.name,'steps:',len(steps))
