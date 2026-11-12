from pathlib import Path
p=Path('src/v3/app.js');s=p.read_text(encoding='utf-8')
needle="function chooseTour(value){state.tour=value;"
replacement="function ensureTempleContext(){const request=$('#service-request');if(!['Temple tour','Group package','Custom multi-day South India tour'].includes(request.value)){request.value='Temple tour';request.dispatchEvent(new Event('change',{bubbles:true}))}}\nfunction chooseTour(value){ensureTempleContext();state.tour=value;"
assert needle in s;s=s.replace(needle,replacement)
s=s.replace("el.querySelector('button').onclick=()=>{state.vehicle=String(i)","el.querySelector('button').onclick=()=>{ensureTempleContext();state.vehicle=String(i)")
s=s.replace("$('#request-plan').onclick=()=>{if(!state.stops.length)","$('#request-plan').onclick=()=>{ensureTempleContext();if(!state.stops.length)")
p.write_text(s,encoding='utf-8')
