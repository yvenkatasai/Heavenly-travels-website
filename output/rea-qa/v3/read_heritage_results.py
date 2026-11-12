from pathlib import Path
import json,re,html
p=Path(__file__).parent
for name in ['heritage-final','heritage-reduced']:
 file=p/(name+'-capture-step-1.json')
 if not file.exists():continue
 step=json.loads(file.read_text(encoding='utf-8'));text=step['artifacts']['dom']['value']['text'];match=re.search(r'<pre id="results">(.*?)</pre>',text,re.S)
 results=json.loads(html.unescape(match[1]));(p/(name+'-results.json')).write_text(json.dumps(results,indent=2));print(name,results[-1]);print('Failures:',[x for x in results if x.get('pass') is False])
