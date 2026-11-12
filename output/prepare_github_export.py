from pathlib import Path
import subprocess,shutil,re,json
R=Path(__file__).resolve().parents[1];D=R.parent/'heavenly-github-publish'
assert (D/'.git').exists()
raw=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z'],cwd=R)
paths=sorted(set(raw.decode('utf-8').split('\0'))-{''})
excluded=[];included=[];sensitive=[]
patterns=[re.compile(x) for x in [r'gh[pousr]_[A-Za-z0-9]{30,}',r'github_pat_[A-Za-z0-9_]{30,}',r'sk-(?:proj-)?[A-Za-z0-9_-]{35,}',r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----']]
for rel in paths:
 p=Path(rel);src=R/p
 if not src.is_file():continue
 if any(x in ['.git','.vercel','.openai','node_modules','__pycache__','preview-v3'] for x in p.parts) or any(x.startswith('pre-') for x in p.parts if p.parts[0]=='output') or p.name.startswith('.env') or p.suffix in ['.log','.pyc']:
  excluded.append(rel);continue
 if src.stat().st_size>=100*1024*1024:raise SystemExit('Oversized file: '+rel)
 if p.suffix.lower() in ['.py','.js','.mjs','.cjs','.tsx','.ts','.json','.md','.html','.txt','.yml','.yaml','.toml'] and src.stat().st_size<5*1024*1024:
  txt=src.read_text(encoding='utf-8',errors='replace')
  if any(pattern.search(txt) for pattern in patterns):sensitive.append(rel)
 included.append(rel)
if sensitive:raise SystemExit('Potential credentials require inspection: '+json.dumps(sensitive))
for rel in included:
 dest=D/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(R/rel,dest)
extra='''
# Machine-specific state, dependencies and temporary working backups
.openai/
.env
.env.*
!.env.example
*.log
output/pre-*/
'''
for folder in [R,D]:
 p=folder/'.gitignore';s=p.read_text(encoding='utf-8');
 if '# Machine-specific state' not in s:p.write_text(s+extra,encoding='utf-8')
report={'included_files':len(included),'excluded_local_files':len(excluded),'bytes':sum((R/p).stat().st_size for p in included),'destination':str(D),'credential_pattern_matches':0}
(R/'output/github-export-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
