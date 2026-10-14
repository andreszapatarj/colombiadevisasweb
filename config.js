/* =====================================================================
   CONFIGURACIÓN GENERAL — edita solo este archivo para cambiar datos.
   Lo usan la web, el landing (/landing) y la política de datos.
   ===================================================================== */
const SITE_CONFIG = {
  /* ---- Contacto ---- */
  whatsapp: "https://wa.me/573161316010",
  calendly: "https://calendly.com/TU-USUARIO/asesoria",
  email: "contacto@colombiadevisas.com",
  phone: "+57 XXX XXX XXXX",

  /* ---- Responsable del tratamiento de datos (Ley 1581 de 2012) ----
     Estos datos aparecen en el formulario de registro y en la
     política de tratamiento. COMPLÉTALOS con los datos legales reales. */
  empresa: {
    razonSocial: "[RAZÓN SOCIAL DE LA EMPRESA]",
    nit: "[NIT]",
    direccion: "[DIRECCIÓN, CIUDAD, COLOMBIA]",
    /* Correo y teléfono del canal de datos personales; si se dejan vacíos
       se usan los de contacto de arriba. */
    emailDatos: "",
    telefonoDatos: ""
  },

  /* ---- Autorización de datos ----
     Si cambias el texto de la política, sube la versión y la fecha:
     queda guardada junto con cada autorización como prueba. */
  politica: {
    version: "1.0",
    fecha: "14 de octubre de 2026"
  },

  /* ---- Envío del registro ----
     URL de tu backend (PHP/Node/etc.) que reciba el registro por POST (JSON)
     y lo guarde junto con la autorización. Mientras esté vacío el formulario
     valida pero NO envía ni guarda nada. */
  endpointRegistro: ""
};
