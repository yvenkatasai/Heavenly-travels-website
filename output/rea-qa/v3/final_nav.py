from pathlib import Path
import json
p=Path('src/v3/page.html');s=p.read_text(encoding='utf-8').replace('id="journeys" class="work-section"','id="travel-story" class="work-section"').replace('class="delivery-card"','id="journeys" class="delivery-card"');p.write_text(s,encoding='utf-8')
p=Path('output/rea-qa/v3/final-mobile.json');s=json.loads(p.read_text());a=s['actions'][8];a['destination']={'url':a.pop('url')};a['wait_until']='load';p.write_text(json.dumps(s))
