// Google Analytics 4. Loaded only in production builds; the measurement id
// comes from the script tag so no inline script is needed.
(function () {
  var id = document.currentScript && document.currentScript.getAttribute("data-ga4");
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", id);
})();
