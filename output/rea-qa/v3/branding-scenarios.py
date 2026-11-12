from pathlib import Path
import json
p=Path(__file__).parent
s=json.loads((p/'checks.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/branding-qa.html';s['actions'][0]['duration_ms']=9000
(p/'branding-checks.json').write_text(json.dumps(s))
s['environment']['reduced_motion']='reduce';(p/'branding-reduced-checks.json').write_text(json.dumps(s))
s=json.loads((p/'mobile.json').read_text());s['actions']=[{'step_id':'intro','action':'wait_for_timeout','duration_ms':200},{'step_id':'hero','action':'wait_for_timeout','duration_ms':2500}];s['capture']={'after_each_step':['screenshot'],'at_end':['dom','url'],'events':['page-errors']};(p/'branding-mobile.json').write_text(json.dumps(s))
