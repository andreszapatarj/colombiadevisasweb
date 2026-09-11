document.addEventListener("DOMContentLoaded",()=>{
 const toggle=document.querySelector(".menu-toggle"), nav=document.querySelector(".nav-links");
 if(toggle&&nav){toggle.addEventListener("click",()=>{nav.classList.toggle("open");toggle.setAttribute("aria-expanded",nav.classList.contains("open"))});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")))}
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});
 document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
 if(typeof SITE_CONFIG!=="undefined"){
  document.querySelectorAll("[data-whatsapp]").forEach(a=>a.href=SITE_CONFIG.whatsapp);
  document.querySelectorAll("[data-calendly]").forEach(a=>a.href=SITE_CONFIG.calendly);
  document.querySelectorAll("[data-email]").forEach(a=>{a.href="mailto:"+SITE_CONFIG.email;a.textContent=SITE_CONFIG.email});
  document.querySelectorAll("[data-phone]").forEach(a=>{a.href="tel:"+SITE_CONFIG.phone.replace(/\s/g,"");a.textContent=SITE_CONFIG.phone});
 }
 const form=document.querySelector("#contact-form");
 if(form&&typeof SITE_CONFIG!=="undefined")form.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(form);const msg=`Hola, quiero una asesoría de Colombia de Visas.%0ANombre: ${d.get("name")}%0ACorreo: ${d.get("email")}%0AMensaje: ${d.get("message")}`;if(SITE_CONFIG.whatsapp.includes("XXXXXXXXXX")){alert("Configura tu WhatsApp en config.js.");return}window.open(SITE_CONFIG.whatsapp+"?text="+encodeURIComponent(msg),"_blank")});
});