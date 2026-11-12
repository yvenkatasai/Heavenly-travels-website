from pathlib import Path
import json
p=Path(__file__).parent;s=json.loads((p/'desktop.json').read_text());s['start_url']['url']='http://127.0.0.1:4188/#our-approach';s['actions']=[{'step_id':'heading','action':'wait_for_timeout','duration_ms':1200}]
for i in range(4):s['actions'] += [{'step_id':'scroll-'+str(i),'action':'press','key':'PageDown','locator':{'kind':'css','selector':'body'}},{'step_id':'card-'+str(i),'action':'wait_for_timeout','duration_ms':500}]
(p/'art.json').write_text(json.dumps(s))
