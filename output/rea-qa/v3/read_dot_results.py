from pathlib import Path
import json,re,html,subprocess
p=Path('output/rea-qa/v3')
for name in ['dot-field-checks','dot-field-reduced','dot-field-mobile']:
 source=p/(name+'-capture.json')
 subprocess.run(['python',str(p/'parse_capture.py'),str(source)],check=True)
 report=p/(name+'-capture-step-1.json')
 if report.exists():
  s=json.loads(report.read_text(encoding='utf-8'));t=s['artifacts']['dom']['value']['text']
  found=re.search(r'<pre id="results">(.*?)</pre>',t,re.S)
  if found:
   results=json.loads(html.unescape(found[1]));(p/(name+'-results.json')).write_text(json.dumps(results,indent=2),encoding='utf-8');print(name,results[-1]);print('Failures:',[v for v in results if v.get('pass') is False]);print('Measured work:',[v['detail'] for v in results if v.get('name')=='Frame work sampled'])
