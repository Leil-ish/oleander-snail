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

var SUBSTACK_URL = "https://leilaanderson.substack.com";
var LINKEDIN_URL = "https://www.linkedin.com/in/leilaanderson/";

// "Mostly, Though" on Substack. Newest first. Refresh by re-pulling
// <SUBSTACK_URL>/feed and updating this list.
var writing = [
  {
    title: "The Authority Problem",
    blurb:
      "What therapists have, what clients consent to, and what neither court will say.",
    url: "https://leilaanderson.substack.com/p/the-authority-problem",
    source: "Substack"
  },
  {
    title: "The Clients I Don't Quite Remember",
    blurb:
      "On memory, grief, and the ethical tenderness of time-bounded relationships.",
    url: "https://leilaanderson.substack.com/p/the-clients-i-dont-quite-remember",
    source: "Substack"
  },
  {
    title: "The Adjacent Possible",
    blurb: "On the gap between what's possible and what's actually next.",
    url: "https://leilaanderson.substack.com/p/the-adjacent-possible",
    source: "Substack"
  },
  {
    title: "Low",
    blurb: "On Apple Health, bargaining, and the cost of arguing with a number.",
    url: "https://leilaanderson.substack.com/p/low",
    source: "Substack"
  },
  {
    title: "How to Do Things with Therapy",
    blurb:
      "And why it matters that your therapist is doing them to you.",
    url: "https://leilaanderson.substack.com/p/how-to-do-things-with-therapy",
    source: "Substack"
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
