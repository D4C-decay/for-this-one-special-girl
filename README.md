# For This One Special Girl ❤️

Una web-app romántica de una sola página: al abrirla, un corazón se dibuja
poco a poco escrito con **"Te amo" en varios idiomas**, con música, un contador
del tiempo juntos, una carta, razones, un mensaje secreto y más.

- **Pensada para móvil y computador** (responsive).
- **Compartible por link** (GitHub Pages).
- **Personalizable** sin tocar el diseño.

## Ver en línea

https://d4c-decay.github.io/for-this-one-special-girl/

## Personalizar

1. Abre `config.js` y edita los valores (nombre, firma, fecha, idiomas,
   carta, razones y el mensaje secreto).
2. También puedes generar un link personalizado:
   `…/for-this-one-special-girl/?to=Su%20Nombre&from=Tu%20Nombre`

## Música

Por derechos de autor, el repo **no** incluye la canción real. Deja
`songUrl: ""` o usa una pista libre de derechos. Para tu copia local, coloca
tu archivo en `private/song.mp3` (esa carpeta está ignorada por git) y pon:

```js
songUrl: "private/song.mp3"
```

## Desarrollo local

No necesita build. Basta con abrir `index.html`, o servirlo:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Estructura

```
index.html   estructura y secciones
styles.css   diseño y animaciones
main.js      corazón en canvas + interacciones
config.js    personalización
assets/      recursos (iconos, corazones)
```
