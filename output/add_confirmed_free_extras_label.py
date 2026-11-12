from pathlib import Path
R=Path(__file__).resolve().parents[1];p=R/'src/v3/page.html';s=p.read_text(encoding='utf-8')
marker='<div class="signature-package-choice">'
extras='''<div class="signature-free-services"><h4>Free extras included</h4><p>This package also includes free extra services. Our team will explain the free extras before you book.</p></div>'''
assert s.count(marker)==1;s=s.replace(marker,extras+marker)
s=s.replace('This package covers all seven temples listed on the page. Choose your vehicle after selecting the package.','This package covers all seven temples listed on the page and includes free extra services. Our team will explain the free extras before you book.')
p.write_text(s,encoding='utf-8')
p=R/'src/booking/data.ts';s=p.read_text(encoding='utf-8').replace('All seven temples are included in this package. Choose a vehicle for your trip.','All seven temples and free extra services are included in this package. Our team will explain the free extras before you book.');p.write_text(s,encoding='utf-8')
