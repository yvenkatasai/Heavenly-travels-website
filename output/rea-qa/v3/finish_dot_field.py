from pathlib import Path
root=Path('.')
p=root/'src/v3/style.css';s=p.read_text(encoding='utf-8');s+='''
/* The user-supplied spring dot field replaces the hero's WebGL layer. */
.hero.dot-field-surface{background:#f1f1f1;background-image:none}.dot-field-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity .35s ease;mask-image:radial-gradient(ellipse 85% 80% at 50% 45%,#000 38%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 85% 80% at 50% 45%,#000 38%,transparent 100%)}.dot-field-surface:not([data-dot-field-ready]){background-image:radial-gradient(#bbb8 1px,transparent 1.4px);background-size:18px 18px}.hero.dot-field-surface .hero-inner{z-index:1}.hero.dot-field-surface .hero-title{transform:none;transition:none}.dot-field-surface .hero-description{background:#f1f1f12e;border-radius:12px}
@media(prefers-reduced-motion:reduce){.dot-field-canvas{transition:none}}
''';p.write_text(s,encoding='utf-8')
p=root/'src/v3/page.html';s=p.read_text(encoding='utf-8');s=s.replace('Fonts: Manrope, Inter and IBM Plex Mono, served locally under their open font licences.','Fonts: Manrope, Inter and IBM Plex Mono, served locally under their open font licences. Hero Dot Field adapted from the user-supplied MIT component by Dorian Baffier / Kokonut UI.');p.write_text(s,encoding='utf-8')
license='''MIT License

Dot Field, by Dorian Baffier (@dorianbaffier), Kokonut UI.
Source supplied by the website owner; component header declares MIT, version 1.0.0, 2026-10-14.
https://kokonutui.com
https://github.com/kokonut-labs/kokonutui

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
'''
(root/'src/v3/assets/dot-field-NOTICE.txt').write_text(license,encoding='utf-8')
p=root/'deploy_vercel.py';s=p.read_text(encoding='utf-8').replace("'change':'Heavenly branded hero and curtain opening'","'change':'Interactive Dot Field hero with adaptive mobile rendering'");p.write_text(s,encoding='utf-8')
print('Styled the dot-field hero and retained source attribution.')
