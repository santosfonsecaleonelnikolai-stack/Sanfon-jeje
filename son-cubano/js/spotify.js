/* Integración con la Spotify iFrame API: crea el reproductor y sincroniza el reloj. */
window.SC = window.SC || {};

SC.TRACK_ID = '7n53166Bqza1EF4vMjMU4x';

SC.Spotify = function (el, clock, callbacks) {
  this.el = el;
  this.clock = clock;
  this.cb = callbacks || {};
  this.controller = null;
  this.ready = false;
  this.loadApi();
};

SC.Spotify.prototype.loadApi = function () {
  var self = this;
  window.onSpotifyIframeApiReady = function (IFrameAPI) {
    IFrameAPI.createController(self.el, {
      uri: 'spotify:track:' + SC.TRACK_ID,
      width: '100%',
      height: 152
    }, function (controller) {
      self.controller = controller;
      controller.addListener('ready', function () {
        self.ready = true;
        if (self.cb.onReady) self.cb.onReady();
      });
      controller.addListener('playback_update', function (e) {
        var d = e.data || {};
        if (self.cb.onUpdate && self.cb.onUpdate(d) === false) return;
        self.clock.update(d.position || 0, !!d.isPaused);
      });
    });
  };
  var s = document.createElement('script');
  s.src = 'https://open.spotify.com/embed/iframe-api/v1';
  s.async = true;
  s.onerror = function () { if (self.cb.onError) self.cb.onError(); };
  document.head.appendChild(s);
};

SC.Spotify.prototype.play = function () { if (this.controller) this.controller.play(); };
SC.Spotify.prototype.pause = function () { if (this.controller) this.controller.pause(); };
SC.Spotify.prototype.toggle = function () { if (this.controller) this.controller.togglePlay(); };
SC.Spotify.prototype.restart = function () { if (this.controller) this.controller.restart(); };
