# MayorKing Logistic — sitio web

Sitio estático (HTML + CSS + JS, sin build) de mudanzas y transporte de carga. Las cotizaciones se arman en el navegador y salen por WhatsApp; no hay backend ni base de datos.

## Estructura

- `index.html` — página única (íconos como sprite SVG inline), con SEO (meta, Open Graph, Twitter, JSON-LD `MovingCompany`).
- `politica-datos.html` — política de tratamiento de datos (Ley 1581 de 2012).
- `404.html` — página de error para Cloudflare Pages.
- `css/style.css` — estilos y fuente autoalojada.
- `js/cotizacion.js` — formulario → mensaje de WhatsApp (validación, consentimiento, sanitización).
- `js/main.js` — menú móvil, nav activo, botón flotante, aparición al scroll y carrusel de reseñas en móvil.
- `assets/` — imágenes WebP, fuente `.woff2`, logo (`logo-mayorking.webp`), favicon e ícono de Apple.
- `_headers` — cabeceras de seguridad (CSP estricta) y caché para Cloudflare Pages.
- `robots.txt` y `sitemap.xml` — indexación.

## Probar en local

```
npx serve .
```

## Reglas al editar

- Sin recursos externos: la CSP solo permite `'self'`. No agregar CDNs, fuentes remotas, scripts ni estilos inline (los atributos `style` y las etiquetas `<style>` quedan bloqueados).
- Las imágenes nuevas van en WebP (servicios 800 px de ancho, hero 1200 px) con `width` y `height`.
- Al cambiar `css/` o `js/`, sube el número de versión (`?v=`) en los enlaces de los HTML para que el celular no use archivos viejos en caché.
- Si cambias una imagen o fuente conservando el nombre, la caché (7 días) puede tardar en actualizarse: usa un nombre nuevo.
- Mantén `sitemap.xml` (`lastmod`) al día cuando cambie el contenido.
