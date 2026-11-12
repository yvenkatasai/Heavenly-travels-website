from pathlib import Path
import json,shutil
p=Path(__file__).parent;shutil.copy2(p/'travel-image-harness.html','preview-v3/travel-image-qa.html')
s=json.loads((p/'checks.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/travel-image-qa.html';s['actions'][0]['duration_ms']=5000;s['capture']['at_end']=['dom','screenshot'];(p/'travel-image-checks.json').write_text(json.dumps(s))
s=json.loads((p/'travel-theme-mobile.json').read_text());s['actions']=[{'step_id':'loaded-hero','action':'wait_for_timeout','duration_ms':3500}];(p/'travel-image-mobile.json').write_text(json.dumps(s))
