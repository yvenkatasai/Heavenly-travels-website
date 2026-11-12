from pathlib import Path
R=Path(__file__).resolve().parents[1]
for name in ['src/v3/page.html','src/v3/app.js','src/booking/main.tsx','src/booking/data.ts']:
 p=R/name;s=p.read_text(encoding='utf-8')
 s=s.replace('3–200','2–200').replace('3 to a maximum of 200','2 to a maximum of 200').replace('From 3 to','From 2 to')
 s=s.replace("group?'3':'1'","group?'2':'1'").replace('group?3:1','group?2:1').replace("group&&Number($('#people').value)<3)$('#people').value='3'","group&&Number($('#people').value)<2)$('#people').value='2'")
 s=s.replace("group&&Number(state.customer.people)<3","group&&Number(state.customer.people)<2").replace("customer:{...s.customer,people:'3'}","customer:{...s.customer,people:'2'}")
 s=s.replace('Can you help with Tirumala darshan tickets?','Will you book Tirumala darshan tickets?')
 s=s.replace('Darshan tickets depend on official availability. Ask us what help is available. Tickets and entry times are not guaranteed.','We only guide you on how to book Tirumala darshan tickets. We do not book tickets for you.')
 s=s.replace('Darshan tickets depend on official availability.','We guide you on how to book darshan tickets. We do not book tickets.')
 s=s.replace('Darshan assistance','Darshan booking guidance').replace('Help with Darshan Tickets','Guidance for Booking Darshan Tickets')
 s=s.replace('Only when tickets are officially available','Guidance only. We do not book tickets for you.')
 p.write_text(s,encoding='utf-8')
