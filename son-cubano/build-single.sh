#!/bin/sh
# Genera dist/son-cubano-contratiempo.html: toda la app en un solo archivo
# (se abre con doble clic, sin servidor). Ejecutar desde la carpeta son-cubano.
set -e
cd "$(dirname "$0")"
mkdir -p dist
{
  echo '<!DOCTYPE html>'
  echo '<html lang="es">'
  echo '<head>'
  echo '<meta charset="UTF-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
  echo '<title>El contratiempo del son cubano</title>'
  echo '<style>'
  cat styles.css
  echo '</style>'
  echo '</head>'
  echo '<body>'
  sed -n '/^<body>$/,/^<script src=/p' index.html | sed '1d;$d'
  echo '<script>'
  cat js/patterns.js js/clock.js js/visuals.js js/spotify.js js/audio.js js/app.js
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > dist/son-cubano-contratiempo.html
echo "Generado dist/son-cubano-contratiempo.html ($(wc -c < dist/son-cubano-contratiempo.html) bytes)"
