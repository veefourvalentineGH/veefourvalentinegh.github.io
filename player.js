/* Vintage record-player audio widget.
   Progressive enhancement: without JavaScript the page shows the browser's own audio controls.
   No autoplay; only one player plays at a time. */
(function () {
  var players = [].slice.call(document.querySelectorAll("[data-player]"));
  if (!players.length) return;

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
    var title = root.getAttribute("data-title") || "track";
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
      root.style.setProperty("--arm", (root.classList.contains("is-playing") ? 30 + 12 * p : 4) + "deg");
    }

    function setPlaying(on) {
      root.classList.toggle("is-playing", on);
      btn.setAttribute("aria-label", (on ? "Pause " : "Play ") + title);
      render();
    }

    btn.addEventListener("click", function () {
      if (audio.paused) {
        players.forEach(function (other) {
          var a = other.querySelector("audio");
          if (a && a !== audio) a.pause();
        });
        var p = audio.play();
        if (p && p.catch) p.catch(function () { setPlaying(false); });
      } else {
        audio.pause();
      }
    });
    range.addEventListener("input", function () {
      var d = duration();
      if (d) audio.currentTime = (range.value / 1000) * d;
      render();
    });
    audio.addEventListener("play", function () { setPlaying(true); });
    audio.addEventListener("pause", function () { setPlaying(false); });
    audio.addEventListener("ended", function () { audio.currentTime = 0; setPlaying(false); });
    audio.addEventListener("timeupdate", render);
    audio.addEventListener("loadedmetadata", render);
    audio.addEventListener("durationchange", render);
    setPlaying(false);
  });
})();
