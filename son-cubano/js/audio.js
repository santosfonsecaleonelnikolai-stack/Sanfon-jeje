/* Archivo de audio local: se reproduce con <audio>, se recuerda en IndexedDB y
   entrega la posición exacta al reloj. El archivo nunca sale del dispositivo. */
window.SC = window.SC || {};

SC.LocalAudio = function (fileInput, audioEl, clock, callbacks) {
  var self = this;
  this.input = fileInput;
  this.audio = audioEl;
  this.clock = clock;
  this.cb = callbacks || {};
  this.file = null;
  this.active = false;   // true mientras el archivo es la fuente de tiempo
  this.url = null;

  fileInput.addEventListener('change', function () {
    var f = fileInput.files && fileInput.files[0];
    if (f) self.load(f, true);
  });

  ['play', 'pause', 'seeked', 'timeupdate', 'ended'].forEach(function (ev) {
    audioEl.addEventListener(ev, function () { self.sync(ev); });
  });

  this.restore();
};

SC.LocalAudio.prototype.position = function () { return this.audio.currentTime * 1000; };

SC.LocalAudio.prototype.sync = function (ev) {
  if (!this.file) return;
  var playing = !this.audio.paused && !this.audio.ended;
  if (ev === 'play' && this.cb.onPlay) this.cb.onPlay();
  this.active = true;
  this.clock.update(this.position(), !playing);
  if (this.cb.onSync) this.cb.onSync(playing, ev);
};

SC.LocalAudio.prototype.load = function (file, save) {
  var self = this;
  this.file = file;
  if (this.url) URL.revokeObjectURL(this.url);
  this.url = URL.createObjectURL(file);
  this.audio.src = this.url;
  this.audio.hidden = false;
  if (this.cb.onLoad) this.cb.onLoad(file, !!save);
  if (save) this.store(file).then(function (ok) { if (self.cb.onStored) self.cb.onStored(ok); });
};

SC.LocalAudio.prototype.clear = function () {
  this.audio.pause();
  this.audio.removeAttribute('src');
  this.audio.load();
  this.audio.hidden = true;
  this.file = null;
  this.active = false;
  this.input.value = '';
  this.clock.stop();
  this.remove();
  if (this.cb.onClear) this.cb.onClear();
};

/* --- IndexedDB (con fallos silenciosos) --- */
SC.LocalAudio.prototype.db = function () {
  return new Promise(function (resolve) {
    try {
      var req = indexedDB.open('son-cubano', 1);
      req.onupgradeneeded = function () { req.result.createObjectStore('files'); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { resolve(null); };
    } catch (e) { resolve(null); }
  });
};

SC.LocalAudio.prototype.store = function (file) {
  return this.db().then(function (db) {
    if (!db) return false;
    return new Promise(function (resolve) {
      try {
        var tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').put(file, 'cancion');
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      } catch (e) { resolve(false); }
    });
  });
};

SC.LocalAudio.prototype.remove = function () {
  return this.db().then(function (db) {
    if (!db) return;
    try { db.transaction('files', 'readwrite').objectStore('files').delete('cancion'); } catch (e) {}
  });
};

SC.LocalAudio.prototype.restore = function () {
  var self = this;
  return this.db().then(function (db) {
    if (!db) return;
    try {
      var req = db.transaction('files', 'readonly').objectStore('files').get('cancion');
      req.onsuccess = function () { if (req.result) self.load(req.result, false); };
    } catch (e) {}
  });
};
