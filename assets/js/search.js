// Client-side search over /search.json (title and categories).
// Results are built with DOM methods and textContent, never innerHTML.
(function () {
  "use strict";
  var input = document.getElementById("q");
  var list = document.getElementById("search-results");
  var status = document.getElementById("search-status");
  if (!input || !list || !status) return;

  var posts = null;
  var initial = status.textContent;

  function render(query) {
    var q = query.trim().toLowerCase();
    while (list.firstChild) list.removeChild(list.firstChild);
    if (!q) { status.textContent = initial; return; }
    var terms = q.split(/\s+/);
    var hits = posts.filter(function (p) {
      var hay = (p.title + " " + p.category).toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    });
    hits.forEach(function (p) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "row";
      a.href = p.url;
      var d = document.createElement("span");
      d.className = "row-date";
      d.textContent = p.date;
      var t = document.createElement("span");
      t.className = "row-title";
      t.textContent = p.title;
      var c = document.createElement("span");
      c.className = "row-tags";
      c.textContent = p.category ? "#" + p.category.split(", ").join(" #") : "";
      a.appendChild(d); a.appendChild(t); a.appendChild(c);
      li.appendChild(a);
      list.appendChild(li);
    });
    status.textContent = hits.length + (hits.length === 1 ? " match" : " matches") + " for “" + query.trim() + "”";
  }

  function update() {
    var url = new URL(window.location.href);
    if (input.value.trim()) url.searchParams.set("q", input.value.trim()); else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
    render(input.value);
  }

  fetch("/search.json", { credentials: "same-origin" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      posts = Array.isArray(data) ? data : [];
      var q = new URL(window.location.href).searchParams.get("q") || "";
      input.value = q.slice(0, 200);
      render(input.value);
      input.addEventListener("input", update);
      input.closest("form").addEventListener("submit", function (e) { e.preventDefault(); update(); });
    })
    .catch(function () { status.textContent = "Search is unavailable right now. Browse the archive instead."; });
})();
