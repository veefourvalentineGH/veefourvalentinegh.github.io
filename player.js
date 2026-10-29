/* Vintage record-player audio widget with a small track list ("sides").
   Press play: the needle lowers onto the record (~1s), then the audio and the spinning start together.
   Progressive enhancement: without JavaScript the page shows the browser's own audio controls.
   No autoplay; only one player plays at a time. */
(function () {
  var players = [].slice.call(document.querySelectorAll("[data-player]"));
  if (!players.length) return;

  var NEEDLE_MS = 1000; // keep in sync with the .arm transition in style.css
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  players.forEach(function (root) {
    var audio = root.querySelector("audio");
    var btn = root.querySelector(".play");
    var range = root.querySelector(".scrub-range");
    var time = root.querySelector(".time");
    var titleEl = root.querySelector(".track-title");
    var creditEl = root.querySelector(".track-credit");
    var labelEl = root.querySelector(".label-title");
    var tracks = [].slice.call(root.querySelectorAll(".tracklist button"));
    var title = (titleEl && titleEl.textContent) || "track";
    var timer = null;
    if (!audio || !btn || !range || !time) return;

    audio.removeAttribute("controls");
    root.classList.add("is-ready");

    function duration() { return isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0; }

    function render() {
      var d = duration(), t = audio.currentTime || 0;
      var p = d ? t / d : 0;
      range.value = Math.round(p * 1000);
      range.style.setProperty("--pct", (p * 100).toFixed(1) + "%");
      range.setAttribute("aria-valuetext", fmt(t) + " of " + fmt(d));
      time.textContent = fmt(t) + " / " + fmt(d);
      root.style.setProperty("--arm", (root.classList.contains("is-engaging") ? 30 + 12 * p : 4) + "deg");
    }

    function setLong() { root.classList.toggle("is-long", title.length > 16); }

    function setEngaged(on) {
      root.classList.toggle("is-engaging", on);
      btn.setAttribute("aria-label", (on ? "Pause " : "Play ") + title);
      range.setAttribute("aria-label", "Seek within " + title);
      render();
    }

    // Stop everything: cancel a pending start, pause, lift the needle, stop the spin.
    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
      audio.pause();
      root.classList.remove("is-playing");
      setEngaged(false);
    }
    root._stop = stop;

    function start() {
      players.forEach(function (other) { if (other !== root && other._stop) other._stop(); });
      audio.preload = "auto"; // buffer while the needle is moving
      setEngaged(true);       // needle lowers onto the record
      timer = setTimeout(function () {
        timer = null;
        var p = audio.play();
        if (p && p.catch) p.catch(stop);
      }, reduceMotion ? 0 : NEEDLE_MS);
    }

    // Switch to another track on the same turntable.
    function selectTrack(button) {
      stop();
      title = button.getAttribute("data-title") || title;
      if (titleEl) titleEl.textContent = title;
      if (creditEl) creditEl.textContent = button.getAttribute("data-credit") || "";
      if (labelEl) labelEl.textContent = title;
      root.setAttribute("data-title", title);
      setLong();
      tracks.forEach(function (b) { b.setAttribute("aria-current", b === button ? "true" : "false"); });
      audio.src = button.getAttribute("data-src");
      audio.load();
      audio.currentTime = 0;
      setEngaged(false);
    }
    tracks.forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("aria-current") !== "true") selectTrack(b);
      });
    });

    btn.addEventListener("click", function () {
      if (root.classList.contains("is-engaging")) stop(); else start();
    });
    range.addEventListener("input", function () {
      var d = duration();
      if (d) audio.currentTime = (range.value / 1000) * d;
      render();
    });
    // The record starts spinning exactly when sound actually starts.
    audio.addEventListener("playing", function () { root.classList.add("is-playing"); });
    audio.addEventListener("pause", function () { root.classList.remove("is-playing"); });
    audio.addEventListener("ended", function () { audio.currentTime = 0; stop(); });
    audio.addEventListener("timeupdate", render);
    audio.addEventListener("loadedmetadata", render);
    audio.addEventListener("durationchange", render);
    setLong();
    setEngaged(false);
  });
})();
