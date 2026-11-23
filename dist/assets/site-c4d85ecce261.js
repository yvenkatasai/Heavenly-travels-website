(()=>{"use strict";const c=/\/vehicles(?:\.html)?\/?$/.test(location.pathname),a=document.createElement("nav");a.className="mobile-trip-nav",a.setAttribute("aria-label","Trip shortcuts");const o=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e}</svg>`,v=o('<path d="M4 21h16M7 21V10h10v11M9 10V7h6v3M10 7V4h4v3M12 2v2M10 21v-5h4v5M5 13h14"/>'),p=o('<path d="M4 17h16V11l-2-6H6l-2 6v6ZM4 11h16M5 17v3h3v-3m8 0v3h3v-3M7 14h2m6 0h2"/>'),m=o('<rect x="4" y="5" width="16" height="16" rx="1"/><path d="M8 3v4m8-4v4M4 10h16M8 14h3m-3 3h7"/>');a.innerHTML=`
    <a href="${c?"index.html":""}#package-types" data-shortcut="packages">
      ${v}
      <span class="shortcut-label">Trips</span>
    </a>
    <button type="button" id="quick-vehicles" data-shortcut="vehicles">
      ${p}
      <span class="shortcut-label">Vehicles</span>
    </button>
    <a href="${c?"index.html":""}#custom-trip" data-shortcut="plan">
      ${m}
      <span class="shortcut-label">Plan trip</span>
    </a>
  `,document.body.append(a),document.body.classList.add("has-heritage-shortcuts"),document.getElementById("quick-vehicles").onclick=()=>{c?document.getElementById("vehicle-selection")?.scrollIntoView({behavior:"instant"}):location.assign("vehicles.html")};let u,l=0;function i(e){e!==u&&(u=e,a.querySelectorAll("[data-shortcut]").forEach(t=>{const s=t.dataset.shortcut===e;t.classList.toggle("is-current",s),s?t.setAttribute("aria-current","location"):t.removeAttribute("aria-current")}))}function r(e,t){const s=document.getElementById(e);if(!s||s.hidden||s.closest("details:not([open])"))return!1;const h=s.getBoundingClientRect();return h.height>0&&h.top<=t&&h.bottom>t}function g(){if(l=0,document.body.classList.contains("modal-open"))return;if(c){i("vehicles");return}const e=Math.min(innerHeight*.35,220);if(r("vehicles-panel",e)||r("vehicle-selection",e)){i("vehicles");return}if(r("custom-trip",e)){i("plan");return}i(["package-types","pilgrimage","journeys","day-packages"].some(t=>r(t,e))?"packages":null)}function n(){l||(l=requestAnimationFrame(g))}addEventListener("scroll",n,{passive:!0}),addEventListener("resize",n,{passive:!0}),addEventListener("hashchange",n),addEventListener("popstate",n),document.addEventListener("click",n),document.addEventListener("toggle",n,!0);const d=document.getElementById("main-content");d&&new MutationObserver(n).observe(d,{childList:!0,subtree:!0}),n()})();
