(()=>{"use strict";const r=/\/vehicles(?:\.html)?\/?$/.test(location.pathname),s=document.createElement("nav");s.className="mobile-trip-nav",s.setAttribute("aria-label","Trip shortcuts");const o=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e}</svg>`,v=o('<path d="M4 21h16M7 21V10h10v11M9 10V7h6v3M10 7V4h4v3M12 2v2M10 21v-5h4v5M5 13h14"/>'),m=o('<path d="M4 17h16V11l-2-6H6l-2 6v6ZM4 11h16M5 17v3h3v-3m8 0v3h3v-3M7 14h2m6 0h2"/>'),g=o('<rect x="4" y="5" width="16" height="16" rx="1"/><path d="M8 3v4m8-4v4M4 10h16M8 14h3m-3 3h7"/>'),f=o('<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>');function b(){try{const e=sessionStorage.getItem("heavenly-trip-name");if(e)return e;const t=JSON.parse(sessionStorage.getItem("heavenly-v3-trip")||"{}");return typeof t.tourName=="string"?t.tourName:""}catch{return""}}s.innerHTML=`
    <a href="${r?"index.html":""}#package-types" data-shortcut="packages">
      ${v}
      <span class="shortcut-label">Trips</span>
    </a>
    <button type="button" id="quick-vehicles" data-shortcut="vehicles">
      ${m}
      <span class="shortcut-label">Vehicles</span>
    </button>
    <a href="${r?"index.html":""}#custom-trip" data-shortcut="plan">
      ${g}
      <span class="shortcut-label">Plan trip</span>
    </a>
    <a
      href="https://wa.me/919700181493?text=Hello%20Heavenly%20Tours%20%26%20Travels%2C%20I%20would%20like%20to%20plan%20a%20temple%20trip."
      target="_blank"
      rel="noopener noreferrer"
      data-shortcut="whatsapp"
    >
      ${f}
      <span class="shortcut-label">Chat</span>
    </a>
  `,document.body.append(s),document.body.classList.add("has-heritage-shortcuts");const u=s.querySelector('[data-shortcut="whatsapp"]');u?.addEventListener("click",()=>{const e=b();e&&(u.href=`https://wa.me/919700181493?text=${encodeURIComponent(`Hello Heavenly Tours & Travels, I was looking at the ${e}.`)}`)}),document.getElementById("quick-vehicles").onclick=()=>{r?document.getElementById("vehicle-selection")?.scrollIntoView({behavior:"instant"}):location.assign("/vehicles")};let d,l=0;function c(e){e!==d&&(d=e,s.querySelectorAll("[data-shortcut]").forEach(t=>{const a=t.dataset.shortcut===e;t.classList.toggle("is-current",a),a?t.setAttribute("aria-current","location"):t.removeAttribute("aria-current")}))}function i(e,t){const a=document.getElementById(e);if(!a||a.hidden||a.closest("details:not([open])"))return!1;const h=a.getBoundingClientRect();return h.height>0&&h.top<=t&&h.bottom>t}function y(){if(l=0,document.body.classList.contains("modal-open"))return;if(r){c("vehicles");return}const e=Math.min(innerHeight*.35,220);if(i("vehicles-panel",e)||i("vehicle-selection",e)){c("vehicles");return}if(i("custom-trip",e)){c("plan");return}c(["package-types","pilgrimage","journeys","day-packages"].some(t=>i(t,e))?"packages":null)}function n(){l||(l=requestAnimationFrame(y))}addEventListener("scroll",n,{passive:!0}),addEventListener("resize",n,{passive:!0}),addEventListener("hashchange",n),addEventListener("popstate",n),document.addEventListener("click",n),document.addEventListener("toggle",n,!0);const p=document.getElementById("main-content");p&&new MutationObserver(n).observe(p,{childList:!0,subtree:!0}),n()})();
