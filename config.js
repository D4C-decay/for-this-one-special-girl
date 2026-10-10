/* =========================================================================
   For This One Special Girl — personalización
   -------------------------------------------------------------------------
   Puedes cambiar estos valores, o sobrescribir "to" y "from" por la URL:
       index.html?to=Maria&from=Juan
   ========================================================================= */
window.LOVE_CONFIG = {
  title: "For This One Special Girl",

  /* Personalización (se puede sobrescribir con ?to=... y ?from=...) */
  to: "Mi amor",
  from: "Tuyo",

  /* Contador "juntos desde" (año, mes[0-11], día, hora, min) */
  since: "2024-10-27T00:00:00",

  /* Música: deja "" para no reproducir nada.
     Para tu copia LOCAL, pon tu archivo en private/song.mp3 y escribe
     songUrl: "private/song.mp3" (esa carpeta no se sube al repo). */
  songUrl: "",
  songLabel: "Nuestra canción",

  /* "Te amo" en muchos idiomas */
  languages: [
    { code: "es", text: "Te amo" },
    { code: "en", text: "I love you" },
    { code: "fr", text: "Je t'aime" },
    { code: "it", text: "Ti amo" },
    { code: "pt", text: "Eu te amo" },
    { code: "de", text: "Ich liebe dich" },
    { code: "ja", text: "愛してる" },
    { code: "ko", text: "사랑해" },
    { code: "zh", text: "我爱你" },
    { code: "ru", text: "Я тебя люблю" },
    { code: "el", text: "Σ'αγαπώ" },
    { code: "ar", text: "أحبك" },
    { code: "hi", text: "मैं तुमसे प्यार करता हूँ" },
    { code: "tr", text: "Seni seviyorum" }
  ],

  /* Carta de amor */
  letter:
    "Escribí esto pensando en ti. Gracias por cada momento, por tu paciencia " +
    "y por quererme incluso cuando no es fácil. Eres mi persona favorita.",

  /* Razones por las que la quieres */
  reasons: [
    "Por tu sonrisa, que me arregla el día entero",
    "Por cómo me escuchas de verdad",
    "Por tu forma de ver el mundo",
    "Porque contigo hasta lo simple se vuelve especial",
    "Por tu fuerza cuando las cosas se ponen difíciles",
    "Porque eres, simplemente, tú"
  ],

  /* Mensaje secreto (se revela al mantener pulsado / sacudir el móvil) */
  secret: "lo siento por herirte esta vez haré las cosas bien"
};
