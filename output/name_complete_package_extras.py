from pathlib import Path
R=Path(__file__).resolve().parents[1];p=R/'src/v3/page.html';s=p.read_text(encoding='utf-8')
old='<div class="signature-free-services"><h4>Free extras included</h4><p>Our team will explain the free services included before you book.</p></div>'
new='<div class="signature-free-services"><h4>Free extras included</h4><ul><li>Pickup &amp; drop for your trip</li><li>Help planning your temple visits</li></ul></div>'
assert old in s;s=s.replace(old,new)
s=s.replace('This package covers all seven temples listed on the page and includes free extra services. Our team will explain the free extras before you book.','This package covers all seven temples listed on the page. Free extras include pickup and drop for your trip, plus help planning your temple visits.')
p.write_text(s,encoding='utf-8')
p=R/'src/booking/data.ts';s=p.read_text(encoding='utf-8');old='All seven temples and free extra services are included in this package. Our team will explain the free extras before you book.';new='All seven temples are included. Free extras: pickup and drop for your trip, plus help planning your temple visits.';assert old in s;s=s.replace(old,new);p.write_text(s,encoding='utf-8')
