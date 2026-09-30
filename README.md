# MayorKing Logistic — sitio web

Sitio estático (HTML + CSS + JS, sin build) de mudanzas y transporte de carga. Las cotizaciones se arman en el navegador y salen por WhatsApp; no hay backend ni base de datos.

## Estructura

- `index.html` — página única (íconos como sprite SVG inline).
- `politica-datos.html` — política de tratamiento de datos (Ley 1581 de 2012).
- `css/style.css` — estilos y fuentes autoalojadas.
- `js/cotizacion.js` — formulario → mensaje de WhatsApp (validación, consentimiento, sanitización).
- `js/main.js` — menú móvil, nav activo, botón flotante.
- `assets/` — imágenes WebP, fuentes `.woff2`, logo y licencia de los íconos ([Phosphor Icons](https://phosphoricons.com), MIT, en `assets/icons/LICENSE-phosphor.txt`; los íconos van como SVG inline en `index.html`).txt`).
- `_headers` — cabeceras de seguridad (CSP estricta) y caché para Cloudflare Pages.

## Probar en local

```
npx serve .
```

## Reglas al editar

- Sin recursos externos: la CSP solo permite `'self'`. No agregar CDNs, fuentes remotas, scripts ni estilos inline.
- Las imágenes nuevas van en WebP (servicios 800 px de ancho, hero 1200 px) con `width` y `height`.
- Si cambias una imagen o fuente conservando el nombre, la caché (7 días) puede tardar en actualizarse: usa un nombre nuevo.
