from pathlib import Path
import json
p=Path(__file__).parent
s=json.loads((p/'mobile.json').read_text());s['actions']=[{'step_id':'hero','action':'wait_for_timeout','duration_ms':1200},{'step_id':'tours','action':'click','locator':{'kind':'css','selector':'.mobile-trip-nav a:first-child'}},{'step_id':'tour-grid','action':'wait_for_timeout','duration_ms':600},{'step_id':'choose-tour','action':'click','locator':{'kind':'css','selector':'.tour-mini:nth-child(2)'}},{'step_id':'planner','action':'wait_for_timeout','duration_ms':1500},{'step_id':'quote','action':'click','locator':{'kind':'css','selector':'#request-plan'}},{'step_id':'drawer','action':'wait_for_timeout','duration_ms':300},{'step_id':'close','action':'click','locator':{'kind':'css','selector':'#contact-close'}},{'step_id':'business-checks','action':'goto','url':'http://127.0.0.1:4191/qa-v3.html'},{'step_id':'completed','action':'wait_for_timeout','duration_ms':7000}]
(p/'final-mobile.json').write_text(json.dumps(s))
p2=Path('src/v3/app.js');text=p2.read_text(encoding='utf-8');text=text.replace("behavior:motion()?'smooth':'instant'","behavior:'instant'");p2.write_text(text,encoding='utf-8')
