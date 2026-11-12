from pathlib import Path
import argparse,shutil

ROOT=Path(__file__).resolve().parent
SRC=ROOT/'src/v3'
parser=argparse.ArgumentParser()
parser.add_argument('--output',default='dist')
args=parser.parse_args()
out=(ROOT/args.output).resolve()
if not out.is_relative_to(ROOT):raise SystemExit('Build output must stay in this project.')
page=(SRC/'page.html').read_text(encoding='utf-8')
for token,name in [('CSS','style.css'),('APP','app.js'),('EFFECTS','effects.js'),('DATA','data.js')]:
 page=page.replace('/*__'+token+'__*/',(SRC/name).read_text(encoding='utf-8'))
page=page.replace('/*__TOURS__*/',(ROOT/'src/tours.js').read_text(encoding='utf-8'))
page=page.replace('{{CREDITS}}',(ROOT/'src/credits.html').read_text(encoding='utf-8'))
assert '/*__' not in page and '{{' not in page
out.mkdir(parents=True,exist_ok=True)
(out/'index.html').write_text(page,encoding='utf-8')
shutil.copytree(SRC/'assets',out/'assets',dirs_exist_ok=True)
print(f'Heavenly 3.0.0 built: {out} ({len(page.encode()):,} HTML bytes)')
