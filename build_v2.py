from pathlib import Path
import base64,json,re,shutil
ROOT=Path(__file__).resolve().parent
SRC=ROOT/'src'
def uri(n):
 p=SRC/'assets'/n
 mime='image/jpeg' if p.suffix=='.jpg' else 'image/webp'
 return 'data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
page=(SRC/'page.html').read_text(encoding='utf-8')
logo='<svg viewBox="0 0 40 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 42h28M8 38h24V24H8v14Zm4-14V17h16v7m-12-7V9h8v8M20 9V4M10 29h20M10 34h20M17 38v-9h6v9M4 42v3h32v-3"/></svg>'
page=page.replace('{{LOGO}}',logo).replace('{{CREDITS}}',(SRC/'credits.html').read_text(encoding='utf-8'))
page=re.sub(r'\{\{IMAGE:([^}]+)\}\}',lambda m:uri(m[1]),page)
page=page.replace('/*__IMAGES__*/','const HEAVENLY_IMAGES='+json.dumps({n:uri(n) for n in ['tirumala.webp','padmavathi.webp','srikalahasti.webp','vellore.webp','srirangam.webp']})+';')
for token,name in [('CSS','cinematic.css'),('TOURS','tours.js'),('APP','app.js')]:page=page.replace('/*__'+token+'__*/',(SRC/name).read_text(encoding='utf-8'))
assert '{{' not in page
page=page.replace('</body>', '<script>\n'+(SRC/'cinematic.js').read_text(encoding='utf-8')+'\n</script></body>')
(ROOT/'dist').mkdir(exist_ok=True)
(ROOT/'dist/index.html').write_text(page,encoding='utf-8')
shutil.copytree(SRC/'assets/mountains',ROOT/'dist/assets/mountains',dirs_exist_ok=True)
print(f'Page assembled: {len(page.encode()):,} bytes; mountain assets copied separately')
