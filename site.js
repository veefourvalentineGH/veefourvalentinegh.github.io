/* Accessible photo viewer. Progressive enhancement: without JavaScript the thumbnails
   simply open the full-size image. Uses the native <dialog> element, which provides
   focus trapping, Esc to close, and focus return to the thumbnail. */
(function () {
  var links = [].slice.call(document.querySelectorAll("a[data-lightbox]"));
  var dlg = document.getElementById("lightbox");
  if (!links.length || !dlg || typeof dlg.showModal !== "function") return;
  var img = dlg.querySelector("img");
  var cap = dlg.querySelector("figcaption");
  var count = dlg.querySelector(".lb-count");
  var index = 0;

  function show(n) {
    index = (n + links.length) % links.length;
    var a = links[index];
    var alt = (a.querySelector("img") || {}).alt || "";
    img.src = a.href;
    img.alt = alt;
    cap.textContent = alt;
    count.textContent = index + 1 + " / " + links.length;
  }

  links.forEach(function (a, n) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      show(n);
      dlg.showModal();
    });
  });
  dlg.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  dlg.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  dlg.querySelector(".lb-close").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
  });
})();
