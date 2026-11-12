from pathlib import Path
import json
p=Path(__file__).parent
s=json.loads((p/'mobile.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/#home';s['actions']=[{'step_id':'hero','action':'wait_for_timeout','duration_ms':1000},{'step_id':'pricing','action':'click','locator':{'kind':'css','selector':'.hero-actions a:nth-child(2)'}},{'step_id':'planner','action':'wait_for_timeout','duration_ms':500}];s['capture']['after_each_step']=['screenshot'];(p/'travel-theme-mobile.json').write_text(json.dumps(s))
s['environment']['viewport']={'width':1440,'height':1000};s['actions']=[{'step_id':'hero','action':'wait_for_timeout','duration_ms':1000}];(p/'travel-theme-desktop.json').write_text(json.dumps(s))
# Reuse the existing browser harness for the responsive planner and business logic.
s=json.loads((p/'checks.json').read_text());(p/'travel-theme-checks.json').write_text(json.dumps(s))
