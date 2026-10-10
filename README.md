# For This One Special Girl ❤️

Una web-app romántica de una sola página. Al abrirla, un **corazón palpitante**
aparece poco a poco detrás del texto mientras unas **mariposas siguen el
cursor**; dentro hay un contador del tiempo juntos, una carta, tres secciones de
razones interactivas, un mensaje secreto, la canción y un jardín de tulipanes.

- **Pensada para móvil y computador** (responsive).
- **Compartible por link** (GitHub Pages).
- **Personalizable** sin tocar el diseño.

## Ver en línea

https://d4c-decay.github.io/for-this-one-special-girl/

## Qué incluye

- **Hero**: corazón palpitante (SVG) que se revela gradualmente detrás del
  título + "Te amo" en varios idiomas con efecto de escritura.
- **Mariposas** dibujadas en canvas que revolotean alrededor del cursor/dedo.
- **Contador** "juntos desde…".
- **Razones por las que te amo**, en tres bloques con interacción propia:
  1. **Cosas que amo de ti** — tarjetas que se voltean al tocar/rozar.
  2. **Momentos que atesoro** — mazo deslizable (arrastra o usa las flechas).
  3. **Secretos de mi corazón** — tarjetas de **rasca y gana**.
- **Carta** que se escribe sola al abrir el sobre.
- **Mensaje secreto** (mantén pulsado o sacude el móvil).
- **Botón esquivo** "¿Me amas?".
- **Nuestra canción**: botón que abre la canción en YouTube (pestaña nueva).
- **Jardín de tulipanes** que se abren al acercar el cursor, con dedicatoria.

## Personalizar

1. Abre `config.js` y edita los valores (nombre, firma, fecha, idiomas, canción,
   carta, los tres grupos de razones y el mensaje secreto).
2. También puedes generar un link personalizado:
   `…/for-this-one-special-girl/?to=Su%20Nombre&from=Tu%20Nombre`

### Canción

El botón abre el video de YouTube definido en `config.js`:

```js
song: {
  title: "The Wonder of You",
  artist: "Elvis Presley",
  youtubeUrl: "https://www.youtube.com/watch?v=F5eEvfOyb7k"
}
```

Cambia `youtubeUrl` por cualquier otro video.

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
main.js      mariposas en canvas + interacciones (razones, rasca, jardín)
config.js    personalización
```
