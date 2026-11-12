from pathlib import Path
import json
p=Path(__file__).parent;html=(p/'pilgrimage-final-harness.html').read_text(encoding='utf-8')
needle="check('Other services keep individual travel available'"
extra="""$('#pickup').value='Bengaluru airport';$('#dropoff').value='';let flightHref='';const savedFlightClick=w.HTMLAnchorElement.prototype.click;w.HTMLAnchorElement.prototype.click=function(){flightHref=this.href};$('#enquiry-form').requestSubmit();w.HTMLAnchorElement.prototype.click=savedFlightClick;const flightText=new URL(flightHref).searchParams.get('text');check('Flight quote keeps service and city details',flightText.includes('Service requested: Domestic / international flights')&&flightText.includes('Departure: Bengaluru airport')&&flightText.includes('Destination: To be discussed'));check('Flight quote omits unrelated temple estimate',!flightText.includes('Temple stops:')&&!flightText.includes('Indicative starting estimate:')&&$('.trip-summary').hidden);"""
assert needle in html;html=html.replace(needle,extra+needle);(p/'pilgrimage-complete-harness.html').write_text(html,encoding='utf-8');Path('preview-v3/pilgrimage-complete-qa.html').write_text(html,encoding='utf-8')
s=json.loads((p/'pilgrimage-final-checks.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/pilgrimage-complete-qa.html';(p/'pilgrimage-complete-checks.json').write_text(json.dumps(s))
