/* Rellena los datos de la empresa (config.js → empresa) en el formulario de
   registro y en la política. Cualquier elemento con data-empresa="campo"
   recibe ese valor. Campos: razonSocial, nit, direccion, email, telefono,
   version, fecha. */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof SITE_CONFIG === "undefined") return;
  const e = SITE_CONFIG.empresa || {};
  const valores = {
    razonSocial: e.razonSocial,
    nit: e.nit,
    direccion: e.direccion,
    email: e.emailDatos || SITE_CONFIG.email,
    telefono: e.telefonoDatos || SITE_CONFIG.phone,
    version: (SITE_CONFIG.politica || {}).version,
    fecha: (SITE_CONFIG.politica || {}).fecha
  };
  document.querySelectorAll("[data-empresa]").forEach(el => {
    const v = valores[el.dataset.empresa];
    if (!v) return;
    el.textContent = v;
    if (el.tagName === "A" && el.dataset.empresa === "email") el.href = "mailto:" + v;
    el.classList.toggle("pendiente", /^\[|XXX/.test(v));
  });
});
