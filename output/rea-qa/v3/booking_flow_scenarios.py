from pathlib import Path
import json,shutil
p=Path(__file__).parent;shutil.copy2(p/'booking-flow-harness.html','preview-v3/booking-flow-qa.html')
s=json.loads((p/'checks.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/booking-flow-qa.html';s['actions'][0]['duration_ms']=14000;(p/'booking-flow-checks.json').write_text(json.dumps(s));s['environment']['reduced_motion']='reduce';(p/'booking-flow-reduced.json').write_text(json.dumps(s))
s=json.loads((p/'travel-theme-mobile.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/#package-options';s['actions']=[{'step_id':'levels','action':'wait_for_timeout','duration_ms':2200},{'step_id':'select-deluxe','action':'click','locator':{'kind':'css','selector':'[data-level-select="deluxe"]'}},{'step_id':'fleet','action':'wait_for_timeout','duration_ms':700},{'step_id':'choose-suv','action':'click','locator':{'kind':'css','selector':'[data-vehicle="suv"]'}},{'step_id':'review','action':'wait_for_timeout','duration_ms':500}];(p/'booking-flow-mobile.json').write_text(json.dumps(s))
s['environment']['viewport']={'width':1440,'height':1000};(p/'booking-flow-desktop.json').write_text(json.dumps(s))
