# El contratiempo del son cubano

Aplicación web independiente (HTML + CSS + JS, sin dependencias ni build) que explica de forma visual
el contratiempo del son cubano, tomando como base la canción **"De Camino a la Vereda"**
(Buena Vista Social Club).

## Cómo abrirla

**Lo más fácil:** abre `dist/son-cubano-contratiempo.html` con doble clic. Es toda la app en un solo
archivo y funciona sin servidor ni instalaciones.

**Sirviéndola:** desde cualquier servidor estático, por ejemplo:

```
npx serve son-cubano
```

y abrir la URL que indique. Hace falta si quieres usar el reproductor incrustado de Spotify.

Para regenerar el archivo único después de editar el código:

```
./build-single.sh
```

## Contenido

1. El pulso (1-2-3-4).
2. El "y": el contratiempo.
3. La clave de son (3-2 y 2-3).
4. El bajo anticipado (tumbao).
5. El paso de baile: salsa en 1 vs. son a contratiempo.
6. Práctica con la canción, capas activables, calibración y un juego de precisión.

Las lecciones 1 a 5 funcionan siempre, sin audio externo: llevan su propio reloj interno.

## Cómo hacer que suene la canción (sección 6)

Tres opciones, y puedes cambiar de una a otra cuando quieras:

- **A · Tu archivo de la canción.** Carga un MP3, M4A o WAV que tengas en el dispositivo. Es la
  opción con mejor sincronía, porque la cuadrícula lee la posición exacta del audio. El archivo
  **no se sube a ningún sitio**: se reproduce en tu navegador y se guarda en el almacenamiento
  local (IndexedDB) para que la app lo recuerde la próxima vez. "Quitar canción" lo borra.
  Spotify no permite descargar sus pistas como archivo, así que necesitas una copia propia
  (por ejemplo un MP3 comprado o extraído de un CD tuyo).
- **B · Reproductor de Spotify.** Requiere que la página se sirva por HTTP y que Spotify no esté
  bloqueado. Sin sesión iniciada solo suenan 30 segundos.
- **C · Sin reproductor.** Pon la canción donde quieras (la app de Spotify, por ejemplo) y pulsa
  "Empezar en el 1" justo en un tiempo fuerte. La cuadrícula sigue el ritmo por su cuenta.

## Calibración

La app sabe en qué segundo va la canción, pero no dónde cae el "1" ni el tempo exacto:

- **Marcar el 1**: pulsa cuando sientas el tiempo fuerte; fija el desfase.
- **Tap tempo**: pulsa varias veces al ritmo para ajustar el BPM.
- **±20 ms**: ajuste fino.

Los valores se guardan en el navegador. Si cambias de fuente de audio (por ejemplo de Spotify a tu
archivo), vuelve a pulsar "Marcar el 1": cada versión puede empezar con un silencio distinto.
