# Starting estimates
Owner supplied Rs 4,999 base and Rs 249 per selected stop. Owner asked for market research for vehicle rates.
Suggested vehicle bases: Sedan 4999, SUV 6499, Tempo Traveller 7999, Mini bus / Bus 11999. These are proposed service rates, not competitor quotes. Bus tier is an extrapolation; route distance, duration, permits, tolls and actual vehicle must be confirmed before booking.
Reference tariffs checked 2026-11-04:
https://ushithatirupatitoursandtravels.com/vehicles/ — local 8h/80km sedan 2200, Innova 3200, Tempo 5000; outstation separate.
https://gotirupaticabs.com/packages — local sedan 2200, Innova Crysta 3500, Tempo 4500–5500.
Edit routePricing in src/site/tours.js. Calculation is per vehicle, not per passenger: vehicle base + selected stops * 249. Display is a starting estimate, not a final trip quote. No customer payment is collected.
Map photograph still needed from owner. Current left panel is a route outline, not a geographic map.
