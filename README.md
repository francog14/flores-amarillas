# Flores amarillas

Una dedicatoria interactiva: abre el regalo para descubrir un jardín animado de flores amarillas. Compatible con celulares, con modo claro/oscuro según el dispositivo y respeto por la preferencia de movimiento reducido.

## Ver la página

Abre `index.html` en tu navegador. No requiere instalaciones ni compilación.

## Personalizar

Edita los textos directamente en `index.html`, incluidos el destinatario (`recipient`), mensaje (`message`) y firma (`signature`). Los colores están en `styles.css`; las animaciones y la interacción están en `script.js`.

## Publicar en GitHub Pages

1. Sube `index.html`, `styles.css`, `script.js`, `petals.js`, `.nojekyll` y la carpeta `assets` a la raíz de tu repositorio.
2. En GitHub, entra a **Settings > Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Selecciona tu rama (normalmente `main`) y la carpeta **/ (root)**. Guarda.
5. Cuando termine la publicación, abre la dirección que muestra GitHub Pages: `https://TU-USUARIO.github.io/flores-amarillas/`.

Todos los recursos son locales y usan rutas relativas, compatibles con repositorios de GitHub Pages. No hay analítica, fuentes externas ni servicios de terceros.

La página es una interpretación propia del concepto de flores amarillas para dedicar; no una reproducción exacta del video de referencia.

El fondo de `petals.js` muestra pétalos y pequeñas flores que caen y reaccionan al mouse o al tacto. No bloquea los botones ni el desplazamiento. Se pausa cuando la pestaña está oculta y queda estático con movimiento reducido.

## Ilustración

`assets/hello-kitty-flores.png` fue creada con la herramienta integrada de generación de imágenes. Prompt: Hello Kitty de cuerpo completo, con lazo y vestido rosa, sosteniendo un ramo de flores amarillas con ambas manos; ilustración 2D con fondo transparente, sin texto ni corazones, como regalo de amistad. La imagen aparece suavemente y se balancea; la preferencia de movimiento reducido desactiva la animación.

La versión animada utiliza `assets/hello-kitty-tallos.png`, editada con la misma herramienta. Prompt de edición: eliminar únicamente las cabezas de las flores y conservar a Hello Kitty, las manos, los tallos, las hojas, la composición y la transparencia. Los pétalos se dibujan en canvas y se despliegan por separado durante unos cinco segundos. «Volver a florecer» reinicia la apertura. Con movimiento reducido, el ramo aparece completamente abierto.
