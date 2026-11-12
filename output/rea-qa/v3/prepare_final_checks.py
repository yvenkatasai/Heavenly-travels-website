from pathlib import Path
import json,shutil
p=Path(__file__).resolve().parent;root=p.parents[2]
shutil.copy2(p/'final-journey-qa.html',root/'preview-v3/final-journey-qa.html')
s=json.loads((p/'final-journey.json').read_text());(p/'final-journey-verified.json').write_text(json.dumps(s));s['environment']['reduced_motion']='reduce';(p/'final-journey-verified-reduced.json').write_text(json.dumps(s))
s['environment']={'viewport':{'width':390,'height':844},'reduced_motion':'no-preference'};s['start_url']['url']='http://127.0.0.1:4191/#pilgrimage'
s['actions']=[{'step_id':'signature','action':'wait_for_timeout','duration_ms':2500},{'step_id':'days','action':'goto','destination':{'url':'http://127.0.0.1:4191/#day-packages'},'wait_until':'load'},{'step_id':'day-rail','action':'wait_for_timeout','duration_ms':900},{'step_id':'vehicles','action':'goto','destination':{'url':'http://127.0.0.1:4191/vehicles.html?package=days-5'},'wait_until':'load'},{'step_id':'choose-vehicle','action':'click','locator':{'kind':'css','selector':'[data-vehicle="suv"]'}},{'step_id':'review','action':'wait_for_timeout','duration_ms':500}]
s['capture']={'after_each_step':['screenshot'],'at_end':['dom','accessibility'],'events':['page-errors']};(p/'final-journey-visual-mobile.json').write_text(json.dumps(s))
s['environment']['viewport']={'width':1440,'height':1000};s['start_url']['url']='http://127.0.0.1:4191/#journeys';s['actions']=s['actions'][:1]+s['actions'][1:];s['actions'][0]['step_id']='individual-packages';(p/'final-journey-visual-desktop.json').write_text(json.dumps(s))
