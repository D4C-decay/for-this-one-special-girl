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

  /* Canción: el botón abre YouTube en una pestaña nueva. */
  song: {
    title: "The Wonder of You",
    artist: "Elvis Presley",
    youtubeUrl: "https://www.youtube.com/watch?v=F5eEvfOyb7k"
  },

  /* "Te amo" en muchos idiomas (máquina de escribir del hero) */
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

  /* Carta de amor (se escribe sola al abrir el sobre) */
  letter:
    "Escribí esto pensando en ti. Gracias por cada momento, por tu paciencia " +
    "y por quererme incluso cuando no es fácil. Eres mi persona favorita.",

  /* Razones: 3 grupos, cada uno con su propia interacción. */
  reasons: {
    /* Grupo 1 — tarjetas que se voltean (toca/roza para leer) */
    flip: [
      "Por tu sonrisa, que me arregla el día entero",
      "Por cómo me escuchas de verdad",
      "Por tu forma de ver el mundo",
      "Por tu ternura incluso en los días grises",
      "Por lo fuerte que eres sin darte cuenta",
      "Porque contigo hasta lo simple se vuelve especial"
    ],
    /* Grupo 2 — mazo deslizable (arrastra o usa las flechas) */
    deck: [
      "La primera vez que reímos hasta llorar",
      "Nuestras conversaciones de madrugada",
      "Cuando me cuentas tus sueños sin miedo",
      "Los silencios que nunca incomodan",
      "Cada abrazo que dice más que mil palabras",
      "La forma en que me miras sin hablar"
    ],
    /* Grupo 3 — rasca y gana (rasca con el dedo/cursor) */
    scratch: [
      "Me enamoré de ti antes de saberlo",
      "Pienso en ti apenas despierto",
      "Eres mi lugar favorito en el mundo",
      "Quiero envejecer a tu lado",
      "Eres la casualidad más bonita de mi vida",
      "Te elegiría una y otra vez"
    ]
  },

  /* Tarjeta final del mazo */
  reasonFinal: "…y mil razones más ❤",

  /* Mensaje secreto (se revela al mantener pulsado / sacudir el móvil) */
  secret: "lo siento por herirte esta vez haré las cosas bien"
};
