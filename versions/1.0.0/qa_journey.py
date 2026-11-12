"""Prepare REA scenarios for the refined journey; no external messages are sent."""
from pathlib import Path
import json,shutil
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'output/rea-qa/journey-v2'
OUT.mkdir(exist_ok=True)
shutil.copy2(ROOT/'output/rea-qa/journey-harness.html',ROOT/'dist/journey-qa.html')
shutil.copy2(ROOT/'output/rea-qa/playback-harness.html',ROOT/'dist/playback-qa.html')
def click(id,selector):return {'step_id':id,'action':'click','locator':{'kind':'css','selector':selector},'timeout_ms':10000}
def wait(id,ms=1000):return {'step_id':id,'action':'wait_for_timeout','duration_ms':ms}
def scenario(name,width,height,url,actions,motion='reduce',capture=None):
 d={'browser':{'mode':'launch','executable_path':'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'},'start_url':{'url':url},'environment':{'viewport':{'width':width,'height':height},'timezone':'Asia/Calcutta','reduced_motion':motion},'actions':actions,'capture':capture or {'at_end':['screenshot','dom','accessibility'],'events':['page-errors']}}
 (OUT/(name+'.json')).write_text(json.dumps(d,indent=2),encoding='utf-8')
scenario('functional',1440,900,'http://127.0.0.1:4188/journey-qa.html',[{'step_id':'checks-ready','action':'wait_for','locator':{'kind':'css','selector':'#results[data-state]'},'state':'visible','timeout_ms':30000}],motion='no-preference',capture={'at_end':['dom'],'events':['page-errors']})
scenario('desktop-hero',1440,1000,'http://127.0.0.1:4188',[wait('hero-visible',1800)],motion='no-preference')
scenario('desktop-packages',1440,1000,'http://127.0.0.1:4188/#packages',[wait('packages-visible',1200)])
scenario('mobile-journey',390,844,'http://127.0.0.1:4188',[click('explore-packages','.hero-actions a.button'),click('family-filter','[data-filter="family"]'),click('choose-family-tour','[data-tour="1"]'),wait('editor-ready',300),click('remove-one-temple','[data-stop="3"]'),click('continue-to-vehicles','#continue-vehicle'),click('choose-suv','[data-vehicle="1"]'),wait('review-visible',700)])
scenario('mobile-hero',390,844,'http://127.0.0.1:4188',[wait('hero-visible',1500)],motion='no-preference')
scenario('mobile-playback',1440,1000,'http://127.0.0.1:4188/playback-qa.html',[{'step_id':'playback-sample-ready','action':'wait_for','locator':{'kind':'css','selector':'#results[data-state]'},'state':'visible','timeout_ms':20000}],motion='no-preference',capture={'at_end':['dom'],'events':['page-errors']})
print('REA scenarios:',OUT)
