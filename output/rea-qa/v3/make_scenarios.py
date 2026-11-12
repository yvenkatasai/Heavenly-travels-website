import json
from pathlib import Path
p=Path(__file__).parent
base=json.loads((p/'mobile.json').read_text())
base['capture']={'after_each_step':['screenshot'],'at_end':['dom','accessibility','url'],'events':['page-errors']}
base['actions']=[{'step_id':'hero','action':'wait_for_timeout','duration_ms':1600},{'step_id':'pricing','action':'click','locator':{'kind':'css','selector':'.hero-actions a:nth-child(2)'}},{'step_id':'plan','action':'wait_for_timeout','duration_ms':800},{'step_id':'contact','action':'click','locator':{'kind':'css','selector':'.site-header [data-contact]'}},{'step_id':'drawer','action':'wait_for_timeout','duration_ms':500}]
(p/'mobile.json').write_text(json.dumps(base))
base['environment']['viewport']={'width':1440,'height':1000}
(p/'desktop.json').write_text(json.dumps(base))
check=json.loads((p/'checks.json').read_text());check['browser']['executable_path']='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';check['environment']['reduced_motion']='reduce';(p/'edge-reduced-checks.json').write_text(json.dumps(check))
