const tours=[
 {name:'Tirupati Express',tag:'A short temple trip',category:'short',art:'',route:'Tirupati · Tirumala',best:'Short visits',description:'We pick you up, take you to Tirumala and drop you back.',includes:['Tirupati arrival and pickup','Tirumala transport','Visit nearby temples if there is time','Return drop']},
 {name:'Family Temple Tour',tag:'For the whole family',category:'family',art:'family',route:'Tirumala · Tiruchanur · Tirupati',best:'Families & seniors',description:'Visit temples with your family. We help with travel and hotel plans.',includes:['Tirupati and Tirumala','Sri Padmavathi Ammavari Temple','Govindaraja Swamy Temple and Kapila Theertham','Help with hotels and local travel']},
 {name:'Andhra Temple Tour',tag:'Visit more temples',category:'short multi',art:'multi',route:'Tirumala · Srikalahasti · Kanipakam',best:'People visiting several temples',description:'Visit Tirumala, Srikalahasti, Kanipakam and Tiruchanur in one trip.',includes:['Tirumala','Srikalahasti','Kanipakam and Tiruchanur','Visit times planned with our team']},
 {name:'Tirupati & Vellore Tour',tag:'From Tirupati to Vellore',category:'multi',art:'long',route:'Tirupati · Srikalahasti · Vellore',best:'Longer trips',description:'Visit Tirupati, Srikalahasti and the Golden Temple in Vellore.',includes:['Tirupati and Tirumala','Srikalahasti','Golden Temple, Vellore','Ask us to add Kanchipuram']},
 {name:'South India Temple Tour',tag:'A longer temple trip',category:'multi',art:'yatra',route:'Kanchipuram · Madurai · Rameswaram',best:'Longer trips',description:'Visit well-known temples across South India. We help plan your route.',includes:['Tirupati and Kanchipuram','Tiruvannamalai and Srirangam','Madurai and Rameswaram','Travel and route plans for a longer trip']}
];

// Owner base/stop fee; suggested vehicle starting estimates informed by local tariff tiers.
const routePricing={base:4999,stopFee:249,vehicleBases:[4999,6499,7999,11999]};
