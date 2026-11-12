from pathlib import Path
import shutil,json
from PIL import Image
root=Path('.');source=Path('C:/Users/jkvam/.codex/generated_images/01a1ab74-6da2-71e2-af1c-4676d9bac211/exec-67829c04-0670-448a-99e8-5bc11f6ddb6f.png')
saved=root/'output/imagegen/tirumala-hills-cinematic-v1.png';saved.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source,saved)
im=Image.open(source).convert('RGB');assets=root/'src/v3/assets'
im.save(assets/'tirumala-hills-cinematic-v1.webp','WEBP',quality=89,method=6)
small=im.copy();small.thumbnail((960,960),Image.Resampling.LANCZOS);small.save(assets/'tirumala-hills-cinematic-mobile-v1.webp','WEBP',quality=85,method=6)
p=root/'src/v3/page.html';s=p.read_text(encoding='utf-8');s=s.replace('<meta name="theme-color" content="#f1f1f1">','<meta name="theme-color" content="#183c31">');s=s.replace('/*__CSS__*/','/*__CSS__*/\n/*__THEME__*/')
picture='<picture class="hero-scene" aria-hidden="true"><source media="(max-width: 767px)" srcset="assets/tirumala-hills-cinematic-mobile-v1.webp"><img src="assets/tirumala-hills-cinematic-v1.webp" alt="" width="1672" height="941" fetchpriority="high" decoding="async"></picture>'
s=s.replace('data-dot-field><canvas','data-dot-field>'+picture+'<canvas',1)
preloads='<link rel="preload" as="image" href="assets/tirumala-hills-cinematic-mobile-v1.webp" media="(max-width: 767px)"><link rel="preload" as="image" href="assets/tirumala-hills-cinematic-v1.webp" media="(min-width: 768px)">'
s=s.replace('<style>/*__CSS__*/',preloads+'<style>/*__CSS__*/',1)
s=s.replace('Mountain landscapes are AI-created artwork.','The hero is newly generated Tirumala-inspired landscape artwork, not a documentary photograph. Mountain landscapes are AI-created artwork.')
p.write_text(s,encoding='utf-8')
p=root/'build_v3.py';s=p.read_text(encoding='utf-8').replace("('CSS','style.css')","('CSS','style.css'),('THEME','travel-theme.css')");p.write_text(s,encoding='utf-8')
for name in ['style.css','app.js']:
 p=root/'src/v3'/name;s=p.read_text(encoding='utf-8')
 for a,b in [('#ffbfd2','#e8d9b8'),('#fc4778','#bc9658'),('#2b2b2b','#183c31')]:s=s.replace(a,b)
 p.write_text(s,encoding='utf-8')
for name in ['dot-field.js','dot-field-runtime.js']:
 p=root/'src/v3'/name;s=p.read_text(encoding='utf-8').replace("color:'#2b2b2b'","color:'#eee3c9'");p.write_text(s,encoding='utf-8')
p=root/'deploy_vercel.py';s=p.read_text(encoding='utf-8').replace("'change':'Interactive Dot Field hero with adaptive mobile rendering'","'change':'Cinematic hills-only hero and professional forest/ivory/gold travel theme'");p.write_text(s,encoding='utf-8')
meta={'generation':'Built-in image_gen','description':'AI-generated Tirumala-inspired hills, no roads or buildings. Cinematic forest greens, mist and warm dawn light.','original_size':list(im.size),'original_file':str(saved),'desktop':{'file':'tirumala-hills-cinematic-v1.webp','bytes':(assets/'tirumala-hills-cinematic-v1.webp').stat().st_size},'mobile':{'file':'tirumala-hills-cinematic-mobile-v1.webp','size':list(small.size),'bytes':(assets/'tirumala-hills-cinematic-mobile-v1.webp').stat().st_size}}
(assets/'tirumala-hills-generation.json').write_text(json.dumps(meta,indent=2),encoding='utf-8');print(json.dumps(meta))
