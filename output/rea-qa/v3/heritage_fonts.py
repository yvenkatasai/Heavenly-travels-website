from pathlib import Path
import urllib.request,re,json,shutil
root=Path('.');backup=root/'output/pre-heritage-unification'
if not backup.exists():
 shutil.copytree(root/'src/v3',backup/'src/v3');shutil.copy2(root/'build_v3.py',backup/'build_v3.py')
folder=root/'src/v3/assets/fonts'
url='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400..600&family=DM+Sans:wght@400..600&display=swap'
request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})
with urllib.request.urlopen(request,timeout=25) as r:css=r.read().decode()
(folder/'heritage-fonts-source.css').write_text(css,encoding='utf-8');records=[]
for block in re.findall(r'/\* latin \*/\s*(@font-face\s*\{.*?\})',css,re.S):
 family=re.search(r"font-family:\s*'([^']+)'",block)[1];src=re.search(r'url\(([^)]+)\)',block)[1]
 file={'Cormorant Garamond':'cormorant-garamond.woff2','DM Sans':'dm-sans.woff2'}[family]
 with urllib.request.urlopen(src,timeout=25) as r:content=r.read()
 (folder/file).write_bytes(content);records.append({'family':family,'file':file,'source':src,'bytes':len(content)})
for family in ['cormorantgaramond','dmsans']:
 with urllib.request.urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/'+family+'/OFL.txt',timeout=25) as r:(folder/(family+'-OFL.txt')).write_bytes(r.read())
assert {r['family'] for r in records}=={'Cormorant Garamond','DM Sans'}
(folder/'heritage-sources.json').write_text(json.dumps(records,indent=2));print(json.dumps(records))
