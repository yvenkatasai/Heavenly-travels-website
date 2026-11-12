import json
from pathlib import Path
p=Path(__file__).parent;s=json.loads((p/'branding-checks.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/dot-field-qa.html';s['actions'][0]['duration_ms']=8000
(p/'dot-field-checks.json').write_text(json.dumps(s))
s['environment']['reduced_motion']='reduce';(p/'dot-field-reduced.json').write_text(json.dumps(s))
s=json.loads((p/'branding-mobile.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/#home';s['actions']=[{'step_id':'hero','action':'wait_for_timeout','duration_ms':1000}];s['capture']={'at_end':['dom','screenshot'],'events':['page-errors']};(p/'dot-field-mobile.json').write_text(json.dumps(s))
