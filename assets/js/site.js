// Small progressive enhancements. The site works without this file.
(function () {
  "use strict";

  // "copy" button on every code block.
  if (navigator.clipboard) {
    document.querySelectorAll("pre.code").forEach(function (pre) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy";
      btn.textContent = "copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      btn.addEventListener("click", function () {
        var code = pre.querySelector("code");
        navigator.clipboard.writeText(code ? code.innerText : pre.innerText).then(
          function () { btn.textContent = "copied"; setTimeout(function () { btn.textContent = "copy"; }, 1600); },
          function () { btn.textContent = "failed"; }
        );
      });
      pre.appendChild(btn);
    });
  }

  // Disqus is loaded only after the reader asks for comments, so no
  // third-party requests are made just by reading a post.
  var load = document.querySelector("button[data-disqus]");
  if (load) {
    load.addEventListener("click", function () {
      var shortname = load.getAttribute("data-disqus");
      if (!/^[a-z0-9-]+$/i.test(shortname)) return;
      load.disabled = true;
      load.textContent = "$ loading comments…";
      var s = document.createElement("script");
      s.src = "https://" + shortname + ".disqus.com/embed.js";
      s.async = true;
      s.setAttribute("data-timestamp", String(+new Date()));
      s.onload = function () { load.hidden = true; if (load.nextElementSibling) load.nextElementSibling.hidden = true; };
      s.onerror = function () { load.disabled = false; load.textContent = "$ load comments (retry)"; };
      document.body.appendChild(s);
    });
  }
})();
