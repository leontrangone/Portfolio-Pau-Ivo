# León Trangone — Portfolio de básquet

Página simple y animada que cuenta una pasión: jugar al básquet desde los 5 años.
HTML + CSS + JavaScript, sin build. Animaciones con GSAP y Lenis (cargados por CDN).

## Estructura

```
index.html        contenido y textos
css/styles.css    estilos (paleta del moodboard: asfalto, naranja, madera, tiza)
js/main.js        animaciones
images/           foto-1.jpg, foto-2.jpg, foto-3.jpg
favicon.svg
```

## Cambiar las fotos

Reemplazá `images/foto-1.jpg`, `foto-2.jpg` y `foto-3.jpg` por las originales **con el mismo nombre**.
Recomendado: JPG de unos 1000–1400 px de alto. Si cambia la proporción, ajustá `--ar` en el `<figure>` de `index.html`
(por ejemplo `--ar:3/4`) y el texto `alt`.

## Cambiar textos

Todo está en `index.html`. Los textos que más conviene personalizar: el párrafo de la sección *Mi historia*
y las frases de *Lo que me dejó el básquet*.

## Verla en tu compu

Abrí `index.html` en el navegador (necesita internet para las librerías y tipografías), o:

```
npx serve .
```

## Publicación

El sitio es estático: Vercel lo publica tal cual desde la raíz del repo. Cada `git push` a `main` genera un deploy nuevo.
