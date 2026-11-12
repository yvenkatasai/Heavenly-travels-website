from pathlib import Path
import re
R=Path(__file__).resolve().parents[1];p=R/'src/v3/page.html';s=p.read_text(encoding='utf-8')
s,count=re.subn(r'(<div class="traveller-needs">.*?</table></div>)',r'<details class="audience-details"><summary>Travel for families, seniors &amp; groups</summary>\1</details>',s,count=1,flags=re.S);assert count==1
start=s.index('<section id="custom-trip"');end=s.index('</section>',start)+10
s=s[:start]+'<details class="custom-plan-fold"><summary>Need a different route? Build a custom trip</summary>'+s[start:end]+'</details>'+s[end:]
p.write_text(s,encoding='utf-8')
p=R/'src/v3/app.js';s=p.read_text(encoding='utf-8');s=s.replace("if(!target)return;e.preventDefault();history.pushState", "if(!target)return;const fold=target.closest('details');if(fold)fold.open=true;e.preventDefault();history.pushState")
s=s.replace("setTab(0);$('#custom-trip').scrollIntoView();", "setTab(0);$('#custom-trip').closest('details').open=true;$('#custom-trip').scrollIntoView();")
p.write_text(s,encoding='utf-8')
p=R/'src/booking/main.tsx';s=p.read_text(encoding='utf-8');s=s.replace("function jump(id:string){document.getElementById(id)?.scrollIntoView({behavior:'instant'})}","function jump(id:string){const target=document.getElementById(id);const fold=target?.closest('details');if(fold)fold.open=true;target?.scrollIntoView({behavior:'instant'})}")
p.write_text(s,encoding='utf-8')
