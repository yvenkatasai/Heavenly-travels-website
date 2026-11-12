from pathlib import Path
p=Path('src/v3/page.html');s=p.read_text(encoding='utf-8').replace('height="941" fetchpriority="high" decoding="async"','height="941" fetchpriority="high" decoding="sync"');p.write_text(s,encoding='utf-8')
for name in ['dot-field.js','dot-field-runtime.js']:
 p=Path('src/v3')/name;s=p.read_text(encoding='utf-8').replace("function resetPhysics(){for(","function resetPhysics(){root.classList.remove('dot-awake');for(").replace("function wake(){if(!awake)","function wake(){root.classList.add('dot-awake');if(!awake)");p.write_text(s,encoding='utf-8')
p=Path('src/v3/effects.js');s=p.read_text(encoding='utf-8').replace('gl_FragColor=vec4(vec3(shade),1.);','gl_FragColor=vec4(vec3(shade)*mix(vec3(1.,.995,.96),vec3(.6,1.22,.96),dark),1.);');p.write_text(s,encoding='utf-8')
