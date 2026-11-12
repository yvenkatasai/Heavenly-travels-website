from pathlib import Path
import json
p=Path(__file__).parent
file=Path('src/v3/page.html');s=file.read_text(encoding='utf-8').replace('Tirupati Balaji<br><em>Darshan?','Tirupati Balaji <br><em>Darshan?')
needle='<p>From flight bookings and hotel arrangements'
s=s.replace(needle,'<p class="services-intro-note">Make your pilgrimage comfortable, memorable and hassle-free with our complete Tirupati travel and pilgrimage services.</p>'+needle)
file.write_text(s,encoding='utf-8')
html=(p/'pilgrimage-harness.html').read_text(encoding='utf-8');html=html.replace("check('Group minimum is three'","check('Enquiry remains scroll locked after dialog transition',d.body.classList.contains('modal-open'));check('Group minimum is three'")
html=html.replace("check('Other services keep individual travel available'","check('Flight enquiry uses departure-city fields',$('#pickup').placeholder.includes('Departure city')&&$('#dropoff').placeholder.includes('Destination city'));check('Other services keep individual travel available'")
(p/'pilgrimage-final-harness.html').write_text(html,encoding='utf-8');Path('preview-v3/pilgrimage-final-qa.html').write_text(html,encoding='utf-8')
s=json.loads((p/'pilgrimage-checks.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/pilgrimage-final-qa.html';(p/'pilgrimage-final-checks.json').write_text(json.dumps(s));s['environment']['reduced_motion']='reduce';(p/'pilgrimage-final-reduced.json').write_text(json.dumps(s))
s=json.loads((p/'travel-theme-mobile.json').read_text());s['start_url']['url']='http://127.0.0.1:4191/#pilgrimage';s['actions']=[{'step_id':'mobile-temples','action':'wait_for_timeout','duration_ms':1300}];(p/'pilgrimage-final-mobile.json').write_text(json.dumps(s))
