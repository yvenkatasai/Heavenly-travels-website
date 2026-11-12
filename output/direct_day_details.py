from pathlib import Path
R=Path(__file__).resolve().parents[1];p=R/'src/booking/main.tsx';s=p.read_text(encoding='utf-8');start=s.index('function DayRail(){');end=s.index('function VehicleArt(',start)
component='''function DayRail(){
 const scroller=useRef<HTMLDivElement>(null),track=useRef<HTMLUListElement>(null),[index,setIndex]=useState(0);
 const {goTo}=useMomentumRail(scroller,track,setIndex);
 const [details,setDetails]=useState<TravelPackage|null>(null),dialog=useRef<HTMLDialogElement>(null),content=useRef<HTMLDivElement>(null),trigger=useRef<HTMLElement|null>(null);
 function openDetails(item:TravelPackage,button:HTMLElement){trigger.current=button;setDetails(item)}
 function closeDetails(){setDetails(null);document.body.classList.toggle('modal-open',!!document.querySelector('dialog[open]:not(#day-package-details)'));trigger.current?.focus({preventScroll:true})}
 useEffect(()=>{const el=dialog.current;if(!el)return;if(details&&!el.open){el.showModal();document.body.classList.add('modal-open');if(content.current)content.current.scrollTop=0}else if(!details&&el.open)el.close()},[details]);
 return <section id="day-packages" className="day-packages" aria-labelledby="day-category day-packages-title">
  <div className="package-chapter flow-container"><span className="chapter-number" aria-hidden="true">03</span><p id="day-category" className="chapter-name">Day-wise Packages</p><span className="chapter-note">1–5 days · Choose your duration</span></div>
  <header className="flow-section-heading flow-container"><div><p className="flow-eyebrow">CHOOSE BY TRIP LENGTH</p><h2 id="day-packages-title">One day or five.<br/><em>A journey for your time.</em></h2></div><div><p>Swipe to browse. Open any card to see its itinerary and choose your trip.</p><div className="fleet-arrows"><button type="button" aria-label="Previous day package" aria-disabled={index===0} onClick={()=>goTo(index-1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Next day package" aria-disabled={index===DAY_PACKAGES.length-1} onClick={()=>goTo(index+1)}><ArrowRight size={18}/></button><span>{index+1} / 5 · SWIPE TO EXPLORE</span></div></div></header>
  <div ref={scroller} className="momentum-rail" tabIndex={0} role="region" aria-label="One to five day travel packages. Use arrow keys to browse."><ul ref={track} className="momentum-track">{DAY_PACKAGES.map((item,i)=><li key={item.id} className="momentum-card" data-current={index===i}><div className="momentum-card-tilt"><img src={item.image} alt="" loading="lazy" width="700" height="850" draggable={false}/><div className="momentum-card-shade"/><span className="momentum-duration">0{item.duration} {item.duration===1?'DAY':'DAYS'}</span><div className="momentum-card-copy"><h3>{item.name}</h3><p>{item.note}</p><button className="day-view-details" type="button" data-day-details={item.id} aria-haspopup="dialog" aria-controls="day-package-details" aria-label={`View itinerary for ${item.name}`} onClick={event=>openDetails(item,event.currentTarget)}>View itinerary</button></div></div></li>)}</ul></div>
  <div className="day-rail-dots" aria-label="Choose a duration">{DAY_PACKAGES.map((p,i)=><button type="button" key={p.id} aria-label={`Show ${p.name}`} aria-pressed={index===i} onClick={()=>goTo(i)}><span/>{i+1}</button>)}</div>
  <dialog ref={dialog} id="day-package-details" className="day-package-dialog" aria-labelledby="day-details-title" aria-describedby="day-details-note" onClose={closeDetails} onClick={event=>{if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)setDetails(null)}}}>
   <button type="button" className="day-details-close" aria-label="Close package itinerary" onClick={()=>setDetails(null)}><X size={20}/></button>
   <header className="day-dialog-header"><p className="flow-eyebrow">DAY-WISE PACKAGE · {details?.duration} {details?.duration===1?'DAY':'DAYS'}</p><h2 id="day-details-title">{details?.name}</h2><p id="day-details-note">{details?.note}</p></header>
   <div ref={content} className="day-dialog-content">{details&&<PackagePlan item={details}/ >}{details?.id==='days-2'&&<p className="day-order-note">The two-day order is arranged around your darshan slot.</p>}</div>
   <footer className="day-dialog-footer"><p>Darshan assistance is subject to official availability.</p>{details&&<a className="flow-button" data-day-select={details.id} href={'vehicles.html?package='+details.id}>Select package &amp; choose vehicle</a>}<button type="button" className="day-dialog-back" onClick={()=>setDetails(null)}>Back to packages</button></footer>
  </dialog>
 </section>;
}
'''
s=s[:start]+component+s[end:];p.write_text(s,encoding='utf-8')
print('All five day cards now open their own exact itinerary; detached details section removed.')
