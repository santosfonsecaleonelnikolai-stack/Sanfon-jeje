/* Lógica de la página: demos por lección, sección con Spotify, calibración y juego. */
(function () {
  var P = SC.PATTERNS;
  var STORE_KEY = 'son-cubano-calib';

  /* ---------- Demos con reloj interno (lecciones 1–5) ---------- */
  var demos = {};

  function makeDemo(name, bpm, renderers) {
    var clock = new SC.Clock({ bpm: bpm, offset: 0 });
    demos[name] = { clock: clock, renderers: renderers, playing: false };
    return demos[name];
  }

  // 1. Pulso
  var pulse1 = new SC.Pulse(document.getElementById('pulse1'));
  var grid1 = new SC.Grid(document.getElementById('grid1'), [
    { key: 'pulso', pattern: P.pulso, label: 'Tiempos' }
  ]);
  makeDemo('pulso', 96, [pulse1, grid1]);

  // 2. El "y"
  var pulse2 = new SC.Pulse(document.getElementById('pulse2'), { showOffbeats: true });
  var grid2 = new SC.Grid(document.getElementById('grid2'), [
    { key: 'pulso', pattern: P.pulso, label: 'Tiempos' },
    { key: 'contra', pattern: P.contra, label: 'Contratiempos' }
  ]);
  makeDemo('y', 90, [pulse2, grid2]);

  // 3. Clave
  var grid3 = new SC.Grid(document.getElementById('grid3'), [
    { key: 'pulso', pattern: P.pulso, label: 'Tiempos' },
    { key: 'clave', pattern: P.clave23, label: 'Clave 2-3' }
  ]);
  makeDemo('clave', 96, [grid3]);
  document.querySelectorAll('[data-clave]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('[data-clave]').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var pat = P[b.dataset.clave];
      grid3.replaceLayer('clave', pat);
      grid3.rows[1].el.querySelector('.grid-label').textContent = pat.nombre;
    });
  });

  // 4. Bajo
  var grid4 = new SC.Grid(document.getElementById('grid4'), [
    { key: 'pulso', pattern: P.pulso, label: 'Tiempos' },
    { key: 'bajoNormal', pattern: P.bajoNormal, label: 'Bajo normal (en 1)' },
    { key: 'bajoSon', pattern: P.bajoSon, label: 'Bajo de son (antic.)' }
  ]);
  makeDemo('bajo', 96, [grid4]);

  // 5. Baile
  var feet5 = new SC.Feet(document.getElementById('feet5'), SC.PIES.son);
  var grid5 = new SC.Grid(document.getElementById('grid5'), [
    { key: 'pulso', pattern: P.pulso, label: 'Tiempos' },
    { key: 'bajo', pattern: P.bajoSon, label: 'Bajo de son' },
    { key: 'paso', pattern: P.pasoSon, label: 'Pasos (son)' }
  ]);
  makeDemo('baile', 90, [feet5, grid5]);
  document.querySelectorAll('[data-paso]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('[data-paso]').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var son = b.dataset.paso === 'son';
      feet5.setSeq(son ? SC.PIES.son : SC.PIES.salsa);
      grid5.replaceLayer('paso', son ? P.pasoSon : P.pasoSalsa);
      grid5.rows[2].el.querySelector('.grid-label').textContent = son ? 'Pasos (son)' : 'Pasos (salsa)';
    });
  });

  // Botones ▶ y sliders de velocidad
  document.querySelectorAll('.btn.play[data-demo]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var d = demos[btn.dataset.demo];
      if (d.playing) {
        d.clock.stop(); d.playing = false;
        btn.textContent = '▶ Reproducir';
        d.renderers.forEach(function (r) { r.render(null); });
      } else {
        // Solo una demo a la vez
        Object.keys(demos).forEach(function (k) {
          if (demos[k].playing) {
            demos[k].clock.stop(); demos[k].playing = false;
            demos[k].renderers.forEach(function (r) { r.render(null); });
            var ob = document.querySelector('.btn.play[data-demo="' + k + '"]');
            if (ob) ob.textContent = '▶ Reproducir';
          }
        });
        d.clock.start(); d.playing = true;
        btn.textContent = '⏸ Pausar';
      }
    });
  });
  document.querySelectorAll('input.bpm[data-demo]').forEach(function (inp) {
    inp.addEventListener('input', function () {
      demos[inp.dataset.demo].clock.setBpm(inp.value);
      inp.parentElement.querySelector('.bpm-val').textContent = inp.value;
    });
  });

  /* ---------- Sección 6: Spotify ---------- */
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) {}
  var clock6 = new SC.Clock({ bpm: saved.bpm || 100, offset: saved.offset || 0 });
  var bpmInput = document.getElementById('bpm6');
  var offsetVal = document.getElementById('offset-val');
  var status = document.getElementById('sync-status');

  function saveCalib() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ bpm: clock6.bpm, offset: clock6.offset })); } catch (e) {}
    bpmInput.value = Math.round(clock6.bpm * 10) / 10;
    offsetVal.textContent = Math.round(clock6.offset);
  }
  saveCalib();

  var pulse6 = new SC.Pulse(document.getElementById('pulse6'), { showOffbeats: true });
  var grid6 = new SC.Grid(document.getElementById('grid6'), [
    { key: 'pulso', pattern: P.pulso, label: 'Tiempos' },
    { key: 'contra', pattern: P.contra, label: 'Contratiempos' },
    { key: 'clave', pattern: P.clave23, label: 'Clave 2-3' },
    { key: 'bajo', pattern: P.bajoSon, label: 'Bajo' },
    { key: 'bongo', pattern: P.bongo, label: 'Bongó' },
    { key: 'paso', pattern: P.pasoSon, label: 'Pasos' }
  ]);
  grid6.setLayerVisible('bongo', false);
  document.querySelectorAll('#layer-toggles input').forEach(function (cb) {
    cb.addEventListener('change', function () { grid6.setLayerVisible(cb.dataset.layer, cb.checked); });
  });

  /* Fuentes de tiempo para la sección 6: archivo local > Spotify > manual. */
  var manual = false;
  var manualStart = document.getElementById('manual-start');
  var manualStop = document.getElementById('manual-stop');
  var audioEl = document.getElementById('audio-el');
  var audioStatus = document.getElementById('audio-status');
  var audioClear = document.getElementById('audio-clear');

  function setStatus(txt, cls) { status.textContent = txt; status.className = 'status' + (cls ? ' ' + cls : ''); }

  function stopManual(silent) {
    if (!manual) return;
    manual = false;
    clock6.stop();
    renderers6.forEach(function (r) { r.render(null); });
    manualStart.hidden = false; manualStop.hidden = true;
    if (!silent) setStatus('Modo manual detenido.');
  }

  var localAudio = new SC.LocalAudio(document.getElementById('audio-file'), audioEl, clock6, {
    onLoad: function (file, isNew) {
      audioStatus.textContent = '🎵 ' + file.name + (isNew ? '' : ' · recordada de la última vez');
      audioClear.hidden = false;
      if (isNew) setStatus('Archivo cargado. Dale play al reproductor de arriba.', 'ok');
    },
    onStored: function (ok) { if (ok) audioStatus.textContent += ' · guardada en este navegador'; },
    onPlay: function () {
      // El archivo pasa a ser la fuente exacta de tiempo.
      stopManual(true);
      if (spotify.controller) spotify.pause();
      clock6.setPositionSource(function () { return localAudio.position(); });
    },
    onSync: function (playing) {
      if (playing) setStatus('Sonando tu archivo · ' + (localAudio.position() / 1000).toFixed(1) + ' s', 'ok');
      else setStatus('Archivo en pausa.');
    },
    onClear: function () {
      clock6.setPositionSource(null);
      renderers6.forEach(function (r) { r.render(null); });
      audioStatus.textContent = '';
      audioClear.hidden = true;
      setStatus('Canción quitada de este navegador.');
    }
  });
  audioClear.addEventListener('click', function () { localAudio.clear(); });

  var spotify = new SC.Spotify(document.getElementById('spotify-player'), clock6, {
    onReady: function () { if (!localAudio.file) setStatus('Reproductor de Spotify listo. Dale play y mira la cuadrícula.', 'ok'); },
    onUpdate: function (d) {
      if (manual) return false;
      if (localAudio.active && !audioEl.paused) return false;   // el archivo manda mientras suena
      if (d.isPaused) { if (localAudio.active) return false; setStatus('Spotify en pausa.'); return; }
      if (localAudio.active) { audioEl.pause(); localAudio.active = false; clock6.setPositionSource(null); }
      setStatus('Sonando en Spotify · ' + (d.position / 1000).toFixed(1) + ' s', 'ok');
    },
    onError: function () {
      setStatus('Aquí no se puede cargar el reproductor de Spotify. Usa la opción A (tu archivo) o la C (sin reproductor).', 'err');
      document.getElementById('spotify-player').hidden = true;
    }
  });

  // Modo manual: la cuadrícula corre sola desde el momento en que se pulsa el botón (en un "1").
  manualStart.addEventListener('click', function () {
    manual = true;
    if (spotify.controller) spotify.pause();
    if (localAudio.file) { audioEl.pause(); localAudio.active = false; }
    clock6.setPositionSource(null);
    clock6.setOffset(0);
    clock6.start();
    saveCalib();
    manualStart.hidden = true; manualStop.hidden = false;
    setStatus('Modo manual: la cuadrícula sigue el ritmo por su cuenta a ' + Math.round(clock6.bpm) + ' BPM.', 'ok');
  });
  manualStop.addEventListener('click', function () { stopManual(false); });

  // Calibración
  document.getElementById('mark-one').addEventListener('click', function () {
    if (!clock6.running) { setStatus('Primero pon la canción (o el modo manual) en marcha.'); return; }
    clock6.setOffset(clock6.position());
    saveCalib();
    flash(this);
  });
  var taps = [];
  document.getElementById('tap-tempo').addEventListener('click', function () {
    var t = performance.now();
    if (taps.length && t - taps[taps.length - 1] > 2500) taps = [];
    taps.push(t);
    if (taps.length >= 3) {
      var intervals = [];
      for (var i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1]);
      var avg = intervals.reduce(function (a, b) { return a + b; }, 0) / intervals.length;
      clock6.setBpm(60000 / avg);
      saveCalib();
    }
    this.textContent = 'Tap tempo (' + taps.length + ')';
    flash(this);
  });
  document.getElementById('off-minus').addEventListener('click', function () { clock6.setOffset(clock6.offset - 20); saveCalib(); });
  document.getElementById('off-plus').addEventListener('click', function () { clock6.setOffset(clock6.offset + 20); saveCalib(); });
  bpmInput.addEventListener('change', function () { clock6.setBpm(bpmInput.value); saveCalib(); });
  document.getElementById('calib-reset').addEventListener('click', function () {
    clock6.setBpm(100); clock6.setOffset(0); taps = [];
    document.getElementById('tap-tempo').textContent = 'Tap tempo';
    saveCalib();
  });

  function flash(el) { el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 150); }

  // Juego
  var result = document.getElementById('game-result');
  var score = document.getElementById('game-score');
  var hits = 0, total = 0;
  function tap() {
    if (!clock6.running) { result.textContent = 'Primero dale play a la canción.'; result.className = 'game-result'; return; }
    var err = clock6.offbeatError(clock6.position());
    var tol = clock6.beatLength() * 0.15; // ±15 % del tiempo cuenta como acierto
    total++;
    var cls, txt;
    if (Math.abs(err) <= tol) { hits++; cls = 'good'; txt = '¡A contratiempo! (' + Math.round(err) + ' ms)'; }
    else if (err < 0) { cls = 'early'; txt = 'Adelantado ' + Math.round(-err) + ' ms'; }
    else { cls = 'late'; txt = 'Atrasado ' + Math.round(err) + ' ms'; }
    result.textContent = txt;
    result.className = 'game-result ' + cls;
    score.textContent = hits + ' / ' + total + ' aciertos (' + Math.round(100 * hits / total) + ' %)';
    flash(document.getElementById('tap-game'));
  }
  document.getElementById('tap-game').addEventListener('click', tap);
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !/INPUT|BUTTON|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); tap(); }
  });

  /* ---------- Bucle de animación ---------- */
  var renderers6 = [pulse6, grid6];
  function frame() {
    Object.keys(demos).forEach(function (k) {
      var d = demos[k];
      if (d.playing) { var s = d.clock.now(); d.renderers.forEach(function (r) { r.render(s); }); }
    });
    if (clock6.running) {
      var s6 = clock6.now();
      renderers6.forEach(function (r) { r.render(s6); });
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
