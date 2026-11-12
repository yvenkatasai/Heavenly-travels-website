from pathlib import Path
R=Path(__file__).resolve().parents[1];p=R/'src/v3/page.html';s=p.read_text(encoding='utf-8')
s=s.replace('<p class="temple-directory-label">TEMPLES INCLUDED IN THIS PACKAGE</p>','<p class="temple-directory-label signature-inclusion-statement">All 7 temples are included.</p>')
s=s.replace('<p class="signature-inclusion-statement">All 7 temples above are included in this package.</p>','')
s=s.replace('This package also includes free extra services. Our team will explain the free extras before you book.','Our team will explain the free services included before you book.')
p.write_text(s,encoding='utf-8')
p=R/'output/rea-qa/v3/check_complete_package.cjs';s=p.read_text(encoding='utf-8').replace("includes('All 7 temples above are included')","includes('All 7 temples are included')");p.write_text(s,encoding='utf-8')
