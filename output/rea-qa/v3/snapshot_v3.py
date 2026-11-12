from pathlib import Path
import shutil,hashlib,json
root=Path('.').resolve();out=root/'versions/3.0.0'
if out.exists():raise SystemExit('Version 3 archive already exists; refusing to overwrite.')
out.mkdir(parents=True)
for name in ['build.py','build_v3.py','VERSION','version.json','README.md','README-V3.md']:
 shutil.copy2(root/name,out/name)
(out/'src').mkdir()
for name in ['tours.js','credits.html']:shutil.copy2(root/'src'/name,out/'src'/name)
shutil.copytree(root/'src/v3',out/'src/v3')
(out/'dist').mkdir();shutil.copy2(root/'dist/index.html',out/'dist/index.html');shutil.copytree(root/'src/v3/assets',out/'dist/assets')
files={str(p.relative_to(out)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.rglob('*')) if p.is_file()}
(out/'snapshot-sha256.json').write_text(json.dumps(files,indent=2),encoding='utf-8')
print('Saved 3.0.0:',len(files),'files.')
