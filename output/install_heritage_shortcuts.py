from pathlib import Path
import shutil
R=Path(__file__).resolve().parents[1];V=R/'src/v3';B=R/'output/pre-heritage-shortcuts';B.mkdir(exist_ok=True)
for name in ['app.js','page.html','vehicles.html']:
 if not (B/name).exists():shutil.copy2(V/name,B/name)
p=V/'app.js';s=p.read_text(encoding='utf-8');start=s.index('const quickNav=');end=s.index("$('#quick-vehicles').onclick",start);s=s[:start]+s[end:];p.write_text(s,encoding='utf-8')
p=V/'page.html';s=p.read_text(encoding='utf-8').replace('/*__SIMPLE_CLOSING_CSS__*/','/*__SIMPLE_CLOSING_CSS__*/\n/*__MOBILE_NAV_CSS__*/').replace('/*__APP__*/','/*__MOBILE_NAV_JS__*/\n/*__APP__*/');p.write_text(s,encoding='utf-8')
p=V/'vehicles.html';s=p.read_text(encoding='utf-8').replace('/*__SIMPLE_CLOSING_CSS__*/','/*__SIMPLE_CLOSING_CSS__*/\n/*__MOBILE_NAV_CSS__*/').replace('<script src="assets/booking-flow.js"','<script>/*__MOBILE_NAV_JS__*/</script><script src="assets/booking-flow.js"');p.write_text(s,encoding='utf-8')
p=R/'build_v3.py';s=p.read_text(encoding='utf-8').replace("('SIMPLE_CLOSING_CSS','simple-closing.css')","('SIMPLE_CLOSING_CSS','simple-closing.css'),('MOBILE_NAV_CSS','mobile-nav.css'),('MOBILE_NAV_JS','mobile-nav.js')");p.write_text(s,encoding='utf-8')
