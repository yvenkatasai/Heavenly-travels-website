from pathlib import Path
import urllib.request,json
fonts=Path('src/v3/assets/fonts')
for name in ['manrope','inter','ibmplexmono']:
 url='https://raw.githubusercontent.com/google/fonts/main/ofl/'+name+'/OFL.txt'
 try:
  with urllib.request.urlopen(url,timeout=15) as r:(fonts/(name+'-OFL.txt')).write_bytes(r.read())
 except Exception as e:print(name,type(e).__name__)
Path('src/v3/assets/media-manifest.json').write_text(json.dumps({'film':{'file':'showreel.mp4','source':'Existing project mountain-dawn-smooth-v2.mp4','dimensions':[1920,1080],'fps':60,'description':'Smooth camera motion from AI-generated landscape still; not real location footage.'},'thumbnail':{'file':'showreel-loop.mp4','width':720,'fps':24,'codec':'H.264','generated_with':'FFmpeg 9.0.2, CRF 26, faststart'},'photos':{'temples':'Existing licensed project photographs; credits embedded in Privacy & credits.','landscapes':'Selected existing project AI landscape artwork.'}},indent=2),encoding='utf-8')
