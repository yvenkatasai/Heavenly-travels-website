from pathlib import Path
import json,hashlib,shutil,urllib.request
root=Path('.').resolve();v2=root/'versions/2.0.0';inventory=json.loads((v2/'snapshot-sha256.json').read_text(encoding='utf-8'))
bad=[name for name,digest in inventory.items() if not (v2/name).is_file() or hashlib.sha256((v2/name).read_bytes()).hexdigest()!=digest]
if bad:raise SystemExit('V2 archive integrity failure: '+str(bad))
for name in ['src/page.html','src/app.js','src/cinematic.css','src/cinematic.js','src/tours.js','build.py','dist/index.html']:
 if hashlib.sha256((root/name).read_bytes()).hexdigest()!=inventory[name]:raise SystemExit('Active V2 differs: '+name)
shutil.copy2(root/'build.py',root/'build_v2.py')
(root/'build.py').write_text('from pathlib import Path\nimport runpy\nrunpy.run_path(str(Path(__file__).resolve().parent / "build_v3.py"), run_name="__main__")\n',encoding='utf-8')
(root/'VERSION').write_text('3.0.0\n')
(root/'version.json').write_text(json.dumps({'version':'3.0.0','description':'REA reconstruction of Incredibles adapted to Heavenly temple travel, with plain copy and mobile trip shortcuts.','build':'python build.py','static_directory':'dist','source':'src/v3','preserved_previous_as':'2.0.0'},indent=2))
(root/'versions/manifest.json').write_text(json.dumps({'active_version':'3.0.0','versions':[{'version':'1.0.0','directory':'versions/1.0.0','preview':'http://127.0.0.1:4189/','description':'Preserved user-friendly redesign'},{'version':'2.0.0','directory':'versions/2.0.0','preview':'http://127.0.0.1:4190/','description':'Preserved cinematic design with smooth video'},{'version':'3.0.0','directory':'versions/3.0.0','preview':'http://127.0.0.1:4188/','description':'Incredibles reference reconstruction adapted to Heavenly, simpler copy and mobile shortcuts'}]},indent=2))
print('Version 2.0.0 verified:',len(inventory),'unchanged archived files. Version 3.0.0 activated.')
