/* Componentes visuales: cuadrícula de 16 pasos, círculo de pulso y pies de baile. */
window.SC = window.SC || {};

/* Cuadrícula: filas = capas (patrones), columnas = 16 pasos. */
SC.Grid = function (container, layers, opts) {
  opts = opts || {};
  this.el = container;
  this.layers = layers;          // [{ key, pattern, label }]
  this.showLabels = opts.showLabels !== false;
  this.build();
};

SC.Grid.prototype.build = function () {
  var self = this;
  this.el.innerHTML = '';
  this.el.classList.add('grid');
  this.cols = [];

  // Fila de etiquetas 1 y 2 y 3 y 4 y
  var head = document.createElement('div');
  head.className = 'grid-row grid-head';
  var hl = document.createElement('div'); hl.className = 'grid-label'; head.appendChild(hl);
  for (var i = 0; i < SC.STEPS; i++) {
    var c = document.createElement('div');
    c.className = 'cell head ' + (SC.isOffbeat(i) ? 'offbeat' : 'onbeat');
    if (i % 8 === 0) c.classList.add('bar-start');
    c.textContent = SC.stepLabel(i);
    head.appendChild(c);
  }
  this.el.appendChild(head);
  this.head = head;

  this.rows = this.layers.map(function (layer) {
    var row = document.createElement('div');
    row.className = 'grid-row layer-' + layer.pattern.color;
    row.dataset.key = layer.key;
    var label = document.createElement('div');
    label.className = 'grid-label';
    label.textContent = layer.label || layer.pattern.nombre;
    row.appendChild(label);
    var cells = [];
    for (var i = 0; i < SC.STEPS; i++) {
      var c = document.createElement('div');
      c.className = 'cell ' + (SC.isOffbeat(i) ? 'offbeat' : 'onbeat');
      if (i % 8 === 0) c.classList.add('bar-start');
      if (layer.pattern.pasos[i]) c.classList.add('on');
      if (layer.pattern.acento && layer.pattern.acento[i]) c.classList.add('accent');
      var dot = document.createElement('span'); dot.className = 'dot';
      c.appendChild(dot);
      row.appendChild(c);
      cells.push(c);
    }
    self.el.appendChild(row);
    return { layer: layer, el: row, cells: cells };
  });
  this.current = -1;
};

SC.Grid.prototype.setLayerVisible = function (key, visible) {
  this.rows.forEach(function (r) { if (r.layer.key === key) r.el.hidden = !visible; });
};

SC.Grid.prototype.replaceLayer = function (key, pattern) {
  this.layers.forEach(function (l) { if (l.key === key) l.pattern = pattern; });
  var hidden = {};
  this.rows.forEach(function (r) { hidden[r.layer.key] = r.el.hidden; });
  this.build();
  var self = this;
  Object.keys(hidden).forEach(function (k) { self.setLayerVisible(k, !hidden[k]); });
};

SC.Grid.prototype.render = function (state) {
  var step = state ? state.step16 : -1;
  if (step === this.current) return;
  var prev = this.current;
  this.current = step;
  var self = this;
  var heads = this.head.children;
  if (prev >= 0) heads[prev + 1].classList.remove('active');
  if (step >= 0) heads[step + 1].classList.add('active');
  this.rows.forEach(function (r) {
    if (prev >= 0) r.cells[prev].classList.remove('active', 'hit');
    if (step >= 0) {
      r.cells[step].classList.add('active');
      if (r.cells[step].classList.contains('on')) {
        r.cells[step].classList.add('hit');
      }
    }
  });
};

SC.Grid.prototype.clear = function () { this.render(null); };

/* Círculo que late con el pulso; muestra el número de tiempo o "y". */
SC.Pulse = function (el, opts) {
  opts = opts || {};
  this.el = el;
  this.showOffbeats = !!opts.showOffbeats;
  this.el.classList.add('pulse');
  this.num = document.createElement('div'); this.num.className = 'pulse-num';
  this.el.appendChild(this.num);
  this.last = -1;
};

SC.Pulse.prototype.render = function (state) {
  if (!state) { this.num.textContent = ''; this.el.style.transform = ''; return; }
  var step = state.step16;
  var isOff = SC.isOffbeat(step);
  if (step !== this.last) {
    this.last = step;
    if (!isOff || this.showOffbeats) {
      this.num.textContent = SC.stepLabel(step);
      this.el.classList.toggle('is-off', isOff);
      this.el.classList.toggle('is-one', step % 8 === 0);
    }
  }
  // Tamaño: "respira" con cada tiempo (o cada paso si se muestran los "y")
  var phase = this.showOffbeats ? state.phase : ((state.stepF / 2) % 1 + 1) % 1;
  var scale = 1 + 0.18 * (1 - phase);
  this.el.style.transform = 'scale(' + scale.toFixed(3) + ')';
};

/* Pies de baile: dos huellas que se iluminan cuando ese pie pisa. */
SC.Feet = function (el, seq) {
  this.el = el;
  this.seq = seq;
  this.el.classList.add('feet');
  this.el.innerHTML =
    '<div class="foot foot-i"><span>IZQ</span></div>' +
    '<div class="foot foot-d"><span>DER</span></div>' +
    '<div class="foot-msg"></div>';
  this.fi = this.el.querySelector('.foot-i');
  this.fd = this.el.querySelector('.foot-d');
  this.msg = this.el.querySelector('.foot-msg');
  this.last = -1;
};

SC.Feet.prototype.setSeq = function (seq) { this.seq = seq; };

SC.Feet.prototype.render = function (state) {
  if (!state) { this.fi.classList.remove('step'); this.fd.classList.remove('step'); this.msg.textContent = ''; return; }
  var step = state.step16;
  if (step === this.last) return;
  this.last = step;
  var pie = this.seq[step];
  this.fi.classList.toggle('step', pie === 'I');
  this.fd.classList.toggle('step', pie === 'D');
  if (pie) this.msg.textContent = 'Paso en el ' + SC.stepLabel(step);
  else if (!SC.isOffbeat(step)) this.msg.textContent = 'Pausa en el ' + SC.stepLabel(step);
};
