# Colombia de Visas — Web + Landing unificados

```
index.html · precios.html · testimonios.html   → página web
politica-datos.html                            → Política de tratamiento de datos (Ley 1581/2012)
landing/index.html · landing/registro.html     → landing (subsección de la web)
config.js                                      → TODOS los datos editables (WhatsApp, correo, empresa, endpoint)
assets/images · assets/videos                  → TODAS las imágenes y videos (carpeta única)
```

## Cambiar imágenes y videos (copiar y reemplazar, mismo nombre)

| Archivo | Dónde aparece | Medida sugerida |
|---|---|---|
| assets/images/hero-empresa.jpg | Portada de la web | 1920×900 |
| assets/images/foto-perfil.jpg | Foto circular del landing | 600×600 |
| assets/images/logo.jpg · logo-monogram.png | Logos web / landing | — |
| assets/images/poster-hero-landing.jpg | Portada del video del landing | 1920×850 |
| assets/images/poster-video-principal.jpg | Portada del video de la web | 1280×720 |
| assets/images/poster-testimonio-01…04.jpg | Portadas de testimonios | 1280×800 |
| assets/videos/landing-hero.mp4 | Video principal del landing | MP4 (H.264) |
| assets/videos/video-principal.mp4 | Video "Conócenos" de la web | MP4 (H.264) |
| assets/videos/testimonio-01…04.mp4 | Testimonios (landing muestra 01–03, web 01–04) | MP4 (H.264) |

`testimonio-04.mp4` aún no existe: copia tu video con ese nombre.

## Datos personales (Ley 1581 de 2012)
1. Completa en `config.js` → `empresa` (razón social, NIT, dirección) y el correo para datos. Los campos marcados en amarillo en la página son los que faltan.
2. El formulario exige la casilla de autorización (no viene premarcada) y ofrece una casilla opcional para comunicaciones comerciales.
3. Cada registro se envía con la prueba de autorización (fecha, versión de política, texto aceptado). Para que se guarde, pon la URL de tu backend en `config.js` → `endpointRegistro`. Mientras esté vacío, el formulario solo valida.
4. Si cambias la política, sube `politica.version` y `politica.fecha`.
