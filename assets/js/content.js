/* ============================================================
   Site content + small behaviors for leilaanderson.dev
   ------------------------------------------------------------
   TO ADD A WRITING ENTRY: add an object to the `writing` array
   below. Newest first. Fields:
     title  — the piece's title
     blurb  — one line on what it's about
     url    — external link (Substack, LinkedIn, etc.)
     source — short label shown on the right (e.g. "Substack")
   No HTML edits needed; the list re-renders from this array.
============================================================ */

// COPY: confirm the Substack URL for "Mostly, Though".
var SUBSTACK_URL = "https://mostlythough.substack.com";
var LINKEDIN_URL = "https://www.linkedin.com/in/leilaanderson/";

// COPY: replace these scaffold entries with real pieces.
var writing = [
  {
    title: "Placeholder essay title",
    blurb: "One line describing the piece and why it's worth the click.",
    url: SUBSTACK_URL,
    source: "Substack"
  },
  {
    title: "Another placeholder piece",
    blurb: "Short hook. Swap this out for a real post.",
    url: LINKEDIN_URL,
    source: "LinkedIn"
  }
];

(function () {
  // --- Writing feed -----------------------------------------------------
  var list = document.getElementById("writing-list");
  if (list) {
    var html = writing
      .map(function (item) {
        return [
          '<li class="writing-item">',
          '  <a class="writing-item__link" href="' +
            item.url +
            '" rel="noopener">',
          '    <span class="writing-item__top">',
          '      <span class="writing-item__title">' + item.title + "</span>",
          '      <span class="writing-item__source">' +
            (item.source || "") +
            "</span>",
          "    </span>",
          '    <span class="writing-item__blurb">' + item.blurb + "</span>",
          "  </a>",
          "</li>"
        ].join("");
      })
      .join("");
    list.innerHTML = html;
  }

  // --- Routing banner dismiss ------------------------------------------
  var banner = document.getElementById("route-banner");
  var dismiss = document.getElementById("route-banner-dismiss");
  if (banner && dismiss) {
    dismiss.addEventListener("click", function () {
      banner.hidden = true;
      try {
        localStorage.setItem("routeBannerDismissed", "1");
      } catch (e) {}
    });
  }

  // --- Footer year ------------------------------------------------------
  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
