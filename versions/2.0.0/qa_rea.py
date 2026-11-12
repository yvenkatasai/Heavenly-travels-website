"""Write reproducible REA-only browser scenarios for the rebuilt frontend."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'output/rea-qa'
OUT.mkdir(exist_ok=True)
def wait(id,ms=800):return {'step_id':id,'action':'wait_for_timeout','duration_ms':ms}
def click(id,selector):return {'step_id':id,'action':'click','locator':{'kind':'css','selector':selector},'timeout_ms':5000}
def fill(id,selector,value):return {'step_id':id,'action':'fill','locator':{'kind':'css','selector':selector},'value':{'source':'literal','value':value},'timeout_ms':5000}
def scenario(name,width,height,actions,capture,motion='reduce'):
 d={'browser':{'mode':'launch','executable_path':'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'},'start_url':{'url':'http://127.0.0.1:4188'},'environment':{'viewport':{'width':width,'height':height},'timezone':'Asia/Calcutta','reduced_motion':motion},'actions':actions,'capture':capture}
 (OUT/(name+'.json')).write_text(json.dumps(d,indent=2),encoding='utf-8')
scenario('desktop',1440,900,[wait('hero',1800),click('menu','#menu-toggle'),wait('menu-view'),click('close-menu','#menu-close'),click('journeys','.round-link'),wait('packages'),click('next-package','[data-next="package-list"]'),wait('second-package'),click('choose-package','[data-tour="1"]'),wait('fleet'),click('next-vehicle','[data-next="fleet-list"]'),click('choose-vehicle','[data-vehicle="1"]'),click('check-trip','#confirm-scroll'),wait('booking')],{'after_each_step':['dom','screenshot'],'at_end':['accessibility','url'],'events':['console','page-errors']})
scenario('mobile',390,844,[wait('ready'),click('plan','.nav-plan'),fill('pickup','#pickup','Tirupati Railway Station'),fill('dropoff','#dropoff','Tirupati hotel'),fill('name','#name','Frontend QA'),click('flexible','#flexible-date'),click('people-plus','#people-plus'),click('change-tour','[data-change="tour"]'),click('choose-tour','[data-change-type="tour"][data-index="2"]'),wait('selection'),click('calendar-unlock','#flexible-date'),click('open-calendar','.calendar-open'),wait('calendar')],{'after_each_step':['dom'],'at_end':['screenshot','accessibility','url'],'events':['console','page-errors']})
scenario('mobile-hero',390,844,[wait('mobile-hero',1500)],{'at_end':['dom','screenshot','accessibility'],'events':['page-errors']},'no-preference')
scenario('harness',1440,900,[{'step_id':'checks-complete','action':'wait_for','locator':{'kind':'css','selector':'#results[data-state]'},'state':'visible','timeout_ms':15000}],{'at_end':['dom'],'events':['page-errors']})
p=OUT/'harness.json'
d=json.loads(p.read_text(encoding='utf-8'));d['start_url']['url']='http://127.0.0.1:4188/qa.html';p.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('REA scenario files written to',OUT)
