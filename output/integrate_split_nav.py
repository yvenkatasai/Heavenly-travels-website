from pathlib import Path
import re,shutil
R=Path(__file__).resolve().parents[1];V=R/'src/v3';B=R/'output/pre-split-nav'
if not B.exists():
 for name in ['src/v3/page.html','src/booking/main.tsx']:
  dest=B/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(R/name,dest)
src=Path('C:/Users/jkvam/.codex/attachments/943846ec-a0ed-4834-b554-86122aee040b/Pasted text.txt').read_text(encoding='utf-8-sig')
src=src.replace('from "motion/react"','from "framer-motion"').replace('import Link from "next/link";','').replace('import { usePathname } from "next/navigation";','import {useDecorativeMotion} from "@/components/ui/parallax-scroll-feature-section";')
src=src.replace('const pathname = usePathname();','const pathname = usePackageLocation();')
src=src.replace('const NavLink = isHash ? "a" : Link;','const NavLink = "a";')
src=src.replace('const reduceMotion = useReducedMotion();','const reduceMotion = !useDecorativeMotion();').replace('  useReducedMotion,\n','')
src=src.replace('aria-current={current ? "page" : undefined}','aria-current={current ? "location" : undefined}')
src=src.replace('aria-label="Main"','aria-label="Choose a package type"')
src=src.replace('  target.scrollIntoView();','  target.scrollIntoView({behavior:"instant"});')
src=src.replace('    window.history.pushState(null, "", href);','    window.history.pushState(null, "", href);\n    window.dispatchEvent(new Event("heavenly:package-navigation"));')
src=re.sub(r'const DEFAULT_NAV_ITEMS: Record<string, NavItem> = \{.*?\n\};','''const DEFAULT_NAV_ITEMS: Record<string, NavItem> = {
 "#pilgrimage":{name:"Complete Package"},
 "#journeys":{name:"Individual Packages"},
 "#day-packages":{name:"Day-wise Packages"},
};''',src,flags=re.S)
# Keep the supplied spring, split caps, drag projection and keyboard logic.
# Scope presentation with project classes instead of a second Tailwind reset.
mapping={
 'bg-zinc-900 dark:bg-zinc-100':'split-surface',
 'outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset':'split-focus',
 'size-4':'split-chevron-icon',
 'relative flex h-9 items-center rounded-xl px-4 font-medium text-sm transition-colors duration-150':'split-link',
 'text-white dark:text-zinc-950':'split-highlighted',
 'text-zinc-400 hover:text-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-800':'split-muted',
 'absolute inset-y-0 -left-px w-3 origin-left':'split-cap split-cap-left',
 'absolute inset-y-0 -right-px w-3 origin-right':'split-cap split-cap-right',
 'absolute bottom-1.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-orange-500 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none':'split-marker',
 'scale-x-100':'split-marker-on','scale-x-0':'split-marker-off',
 'flex justify-center px-4 py-2':'split-nav',
 'relative flex touch-pan-y select-none items-center':'split-row',
 'absolute top-0 left-0 flex size-9 items-center justify-center rounded-xl text-zinc-400 transition-colors duration-150 hover:text-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-800':'split-chevron',
 'pointer-events-none z-0':'split-hidden',
 'pointer-events-none':'split-hidden',
 'z-30':'split-pinned','z-20':'split-pinned','z-10':'split-rest',
}
for old,new in sorted(mapping.items(),key=lambda x:-len(x[0])):src=src.replace('"'+old+'"','"'+new+'"')
src=src.replace('        "relative",','        "split-segment",').replace('<span className="relative">{name}</span>','<span className="split-link-label">{name}</span>')
hook='''
// Keep the selected category in sync with real sections, hashes and Back.
function usePackageLocation(){
 const [path,setPath]=useState(()=>location.hash||"#pilgrimage");
 useEffect(()=>{
  const update=()=>setPath(location.hash||"#pilgrimage");
  const names=["hashchange","popstate","heavenly:package-navigation"];
  names.forEach(name=>window.addEventListener(name,update));
  const observer=new IntersectionObserver(entries=>{
   const current=entries.find(entry=>entry.isIntersecting);
   if(current)setPath("#"+current.target.id);
  },{rootMargin:"-18% 0px -65% 0px"});
  ["pilgrimage","journeys","day-packages"].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});
  return()=>{names.forEach(name=>window.removeEventListener(name,update));observer.disconnect()};
 },[]);
 return path;
}
'''
src=src.replace('export function MorphicNavbar({',hook+'\nexport function MorphicNavbar({')
(R/'components/ui/split-nav.tsx').write_text(src,encoding='utf-8')
license=(V/'assets/momentum-rail.LICENSE.txt').read_text(encoding='utf-8').replace('Momentum Rail','Split Nav')
(V/'assets/split-nav.LICENSE.txt').write_text(license,encoding='utf-8')
p=V/'page.html';s=p.read_text(encoding='utf-8');start=s.index('<nav id="package-types"');end=s.index('</nav>',start)+6
s=s[:start]+'''<section id="package-types" class="package-category-nav" aria-labelledby="package-types-title"><div class="category-nav-intro"><span class="section-overline">FIND YOUR PILGRIMAGE</span><h2 id="package-types-title">Choose your kind of journey</h2></div><div id="package-split-nav"></div><noscript><p><a href="#pilgrimage">Complete Package</a> · <a href="#journeys">Individual Packages</a> · <a href="#day-packages">Day-wise Packages</a></p></noscript></section>'''+s[end:]
s=s.replace('Hero Dot Field and Momentum Rail adapted','Hero Dot Field, Momentum Rail and Split Nav adapted')
s=s.replace('/*__HIERARCHY_CSS__*/','/*__HIERARCHY_CSS__*/\n/*__DIRECT_FLOW_CSS__*/');p.write_text(s,encoding='utf-8')
p=V/'vehicles.html';s=p.read_text(encoding='utf-8').replace('/*__HIERARCHY_CSS__*/','/*__HIERARCHY_CSS__*/\n/*__DIRECT_FLOW_CSS__*/');p.write_text(s,encoding='utf-8')
p=R/'build_v3.py';s=p.read_text(encoding='utf-8').replace("('HIERARCHY_CSS','package-hierarchy.css')","('HIERARCHY_CSS','package-hierarchy.css'),('DIRECT_FLOW_CSS','direct-package-flow.css')");p.write_text(s,encoding='utf-8')
p=R/'src/booking/main.tsx';s=p.read_text(encoding='utf-8');s=s.replace("import SlideCommit from '@/components/ui/SlideCommit';","import SlideCommit from '@/components/ui/SlideCommit';\nimport SplitNav from '@/components/ui/split-nav';")
s=s.replace("const inside=document.getElementById('gateway-service-picker'),below=document.getElementById('below-gateway-service-picker');","const inside=document.getElementById('gateway-service-picker'),below=document.getElementById('below-gateway-service-picker'),categoryNav=document.getElementById('package-split-nav');")
s=s.replace('if(!vehiclePage)return <MotionConfig reducedMotion="user"><div className="booking-flow">','if(!vehiclePage)return <MotionConfig reducedMotion="user"><div className="booking-flow">{categoryNav&&createPortal(<SplitNav/>,categoryNav)}')
p.write_text(s,encoding='utf-8')
print('Supplied Split Nav ported to the existing static React island.')
