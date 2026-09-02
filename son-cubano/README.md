# El contratiempo del son cubano

Aplicación web independiente (HTML + CSS + JS, sin dependencias ni build) que explica de forma visual
el contratiempo del son cubano usando la canción **"De Camino a la Vereda"** (Buena Vista Social Club)
a través del reproductor incrustado de Spotify.

## Cómo abrirla

Opción 1: doble clic en `index.html`. Las lecciones 1 a 5 funcionan así; el reproductor de Spotify
necesita que la página se sirva por HTTP.

Opción 2 (recomendada): servir la carpeta con cualquier servidor estático, por ejemplo:

```
npx serve son-cubano
```

y abrir la URL que indique (normalmente http://localhost:3000).

## Contenido

1. El pulso (1-2-3-4).
2. El "y": el contratiempo.
3. La clave de son (3-2 y 2-3).
4. El bajo anticipado (tumbao).
5. El paso de baile: salsa en 1 vs. son a contratiempo.
6. Práctica con la canción real, capas activables, calibración y un juego de precisión.

## Calibración con la canción

Spotify informa la posición de la canción, pero no dónde cae el "1" ni el tempo exacto.
En la sección 6:

- **Marcar el 1**: pulsa cuando sientas el tiempo fuerte; fija el desfase inicial.
- **Tap tempo**: pulsa varias veces al ritmo para ajustar el BPM.
- **±20 ms**: ajuste fino del desfase.

Los valores se guardan en el navegador (localStorage). Sin sesión iniciada en Spotify solo
suenan 30 segundos de la canción.
