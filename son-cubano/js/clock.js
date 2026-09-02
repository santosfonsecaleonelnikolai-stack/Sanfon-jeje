/* Reloj musical: convierte una posición en milisegundos a tiempo/paso.
   Puede alimentarse desde Spotify (update) o correr solo (start). */
window.SC = window.SC || {};

SC.Clock = function (opts) {
  opts = opts || {};
  this.bpm = opts.bpm || 100;
  this.offset = opts.offset || 0;      // ms donde cae el "1" del primer compás
  this.lastPos = 0;                    // última posición conocida (ms)
  this.lastAt = performance.now();     // instante en que se conoció
  this.running = false;
};

SC.Clock.prototype.setBpm = function (bpm) {
  bpm = Math.max(40, Math.min(200, Number(bpm) || 100));
  // Mantener el paso actual estable al cambiar el tempo en modo interno.
  var pos = this.position();
  var beatsSoFar = (pos - this.offset) / (60000 / this.bpm);
  this.bpm = bpm;
  if (this.source === 'internal') {
    this.lastPos = this.offset + beatsSoFar * (60000 / bpm);
    this.lastAt = performance.now();
  }
};

SC.Clock.prototype.setOffset = function (ms) { this.offset = Number(ms) || 0; };

/* Modo interno */
SC.Clock.prototype.start = function () {
  this.source = 'internal';
  this.posSource = null;
  this.lastPos = this.offset;
  this.lastAt = performance.now();
  this.running = true;
};
SC.Clock.prototype.stop = function () { this.running = false; };

/* Modo externo (Spotify): informa posición real */
SC.Clock.prototype.update = function (positionMs, isPaused) {
  this.source = 'external';
  this.lastPos = positionMs;
  this.lastAt = performance.now();
  this.running = !isPaused;
};

/* Fuente de posición exacta (p. ej. audio.currentTime); anula la interpolación. */
SC.Clock.prototype.setPositionSource = function (fn) { this.posSource = fn || null; };

SC.Clock.prototype.position = function () {
  if (this.posSource) return this.posSource();
  if (!this.running) return this.lastPos;
  return this.lastPos + (performance.now() - this.lastAt);
};

SC.Clock.prototype.beatLength = function () { return 60000 / this.bpm; };

/* Devuelve el estado musical actual */
SC.Clock.prototype.now = function () {
  var pos = this.position();
  var beatLen = this.beatLength();
  var beat = (pos - this.offset) / beatLen;          // tiempos transcurridos (float)
  var stepF = beat * 2;                              // corcheas (float)
  var step16 = ((Math.floor(stepF) % 16) + 16) % 16; // paso 0..15
  var phase = stepF - Math.floor(stepF);             // 0..1 dentro del paso
  return { position: pos, beat: beat, step16: step16, phase: phase, stepF: stepF };
};

/* Desfase (ms) de una posición respecto al contratiempo ("y") más cercano.
   Negativo = adelantado, positivo = atrasado. */
SC.Clock.prototype.offbeatError = function (positionMs) {
  var beatLen = this.beatLength();
  var half = beatLen / 2;
  var rel = positionMs - this.offset - half;   // los "y" están a media negra del "1"
  var k = Math.round(rel / beatLen);
  return rel - k * beatLen;
};
