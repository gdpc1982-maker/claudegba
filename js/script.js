// Gurgaon Bengalee Association Website
console.log("Website Loaded");

// Durga Puja 2027 full Days/Hours/Minutes/Seconds countdown (home page)
// Dates are tentative and vary by almanac; confirm before September 2027.
// Maha Shashthi (start) = 5 Oct 2027, 00:00 IST
// Bijoya Dashami end (festival close) = 10 Oct 2027, 23:59:59 IST
document.addEventListener("DOMContentLoaded", function () {
  var daysEl = document.getElementById("cdDays");
  var hoursEl = document.getElementById("cdHours");
  var minutesEl = document.getElementById("cdMinutes");
  var secondsEl = document.getElementById("cdSeconds");
  var captionEl = document.getElementById("dhmsCaption");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  var pujaStart = new Date("2027-10-05T00:00:00+05:30");
  var pujaEnd = new Date("2027-10-10T23:59:59+05:30");

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function updateCountdown() {
    var now = new Date();
    var target;

    if (now < pujaStart) {
      target = pujaStart;
      if (captionEl) captionEl.textContent = "Until Durga Puja 2027 Begins · Maha Shashthi, 5 October (tentative)";
    } else if (now <= pujaEnd) {
      target = pujaEnd;
      if (captionEl) captionEl.textContent = "Until Durga Puja 2027 Celebrations End";
    } else {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      if (captionEl) captionEl.textContent = "Durga Puja 2027 Has Concluded — See You Next Year!";
      return;
    }

    var diffMs = target - now;
    var totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// Cultural Programme Audition popup — align its bottom edge with the
// bottom edge of the "Cultural Programme Auditions" card that opened
// it, so it appears anchored to the tile rather than floating oddly.
document.addEventListener("DOMContentLoaded", function () {
  var auditionModal = document.getElementById("auditionModal");
  var triggerCard = document.getElementById("culturalAuditionCard");
  var dialog = auditionModal ? auditionModal.querySelector(".audition-modal-dialog") : null;

  if (!auditionModal || !triggerCard || !dialog) return;

  function getViewportHeight() {
    // window.innerHeight is unreliable on mobile right around the
    // moment the address bar collapses/expands (which often happens
    // exactly when a modal opens and locks page scroll). visualViewport
    // reflects the actual visible area on mobile browsers that support it.
    if (window.visualViewport) {
      return window.visualViewport.height;
    }
    return window.innerHeight;
  }

  function positionDialog() {
    var cardRect = triggerCard.getBoundingClientRect();
    var dialogHeight = dialog.offsetHeight;
    var margin = 12;
    var viewportHeight = getViewportHeight();

    var top = cardRect.bottom - dialogHeight;

    // Keep it fully on screen even if the card is scrolled near an edge
    var maxTop = viewportHeight - dialogHeight - margin;
    var minTop = margin;
    if (top > maxTop) top = maxTop;
    if (top < minTop) top = minTop;

    dialog.style.position = "fixed";
    dialog.style.top = top + "px";
    dialog.style.left = "50%";
    dialog.style.transform = "translateX(-50%)";
    dialog.style.margin = "0";
  }

  // Bootstrap sets display:block asynchronously as part of its own
  // backdrop-fade sequence — by "show.bs.modal" time (or even one
  // animation frame later) the dialog may still not be laid out yet,
  // so measuring its height too early returns 0 and breaks the maths.
  // "shown.bs.modal" fires only once Bootstrap's own transition has
  // fully completed, guaranteeing an accurate measurement. Keep the
  // dialog hidden until then so there's no wrong-position flash, and
  // fade it in ourselves for a smooth reveal.
  auditionModal.addEventListener("show.bs.modal", function () {
    dialog.style.visibility = "hidden";
    dialog.style.opacity = "0";
  });

  auditionModal.addEventListener("shown.bs.modal", function () {
    // On some mobile browsers the address bar's own collapse animation
    // runs slightly after Bootstrap's transitionend fires, so re-measure
    // a beat later too in case the viewport height shifted underneath us.
    positionDialog();
    dialog.style.transition = "opacity .2s ease";
    dialog.style.visibility = "";
    // Force a reflow so the opacity transition actually plays
    // eslint-disable-next-line no-unused-expressions
    dialog.offsetHeight;
    dialog.style.opacity = "1";
    setTimeout(positionDialog, 120);
  });

  window.addEventListener("resize", function () {
    if (auditionModal.classList.contains("show")) positionDialog();
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
      if (auditionModal.classList.contains("show")) positionDialog();
    });
  }
});

// "Contribute to This Event" popup (events.html) — position it just
// below the sticky nav bar instead of using default centering, since
// centering within the full page can land the popup's top edge behind
// the nav (which sits above it in stacking order). Unlike the audition
// popup above, this only needs the nav bar's height — which is always
// rendered and measurable immediately, with no display-timing issue.
document.addEventListener("DOMContentLoaded", function () {
  var contributeModal = document.getElementById("eventContributeModal");
  var siteTop = document.querySelector(".site-top");
  var dialog = contributeModal ? contributeModal.querySelector(".audition-modal-dialog") : null;

  if (!contributeModal || !siteTop || !dialog) return;

  function positionBelowNav() {
    var navHeight = siteTop.offsetHeight;
    var margin = 16;

    dialog.style.position = "fixed";
    dialog.style.top = (navHeight + margin) + "px";
    dialog.style.left = "50%";
    dialog.style.transform = "translateX(-50%)";
    dialog.style.margin = "0";
  }

  contributeModal.addEventListener("show.bs.modal", positionBelowNav);
  window.addEventListener("resize", function () {
    if (contributeModal.classList.contains("show")) positionBelowNav();
  });
});

// "Translate" buttons on Bengali quotes/reflections — opens the exact
// text in Google Translate (source: Bengali) in a new tab, rather than
// embedding a page-wide translator widget that would translate the
// entire site and depends on a third-party script staying available.
document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll(".js-translate");

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sourceId = btn.getAttribute("data-source");
      var sourceEl = document.getElementById(sourceId);
      if (!sourceEl) return;

      var text = sourceEl.textContent.trim().replace(/\s+/g, " ");
      var url = "https://translate.google.com/?sl=bn&tl=en&text=" + encodeURIComponent(text) + "&op=translate";
      window.open(url, "_blank", "noopener");
    });
  });
});

// Highlights / Connect pullout tabs + their popups — the sticky nav's
// real height varies by screen size (wraps differently, banner image
// scales, etc), so a fixed CSS percentage for "below the nav" isn't
// reliable — on some screens it lands the tab (or popup) partly behind
// the nav, since the nav renders on top of anything positioned there.
// Instead, measure the nav's actual live height and centre things
// within the genuinely visible space underneath it.
document.addEventListener("DOMContentLoaded", function () {
  var siteTop = document.querySelector(".site-top");
  var highlightsTab = document.getElementById("highlightsTab");
  var connectTab = document.getElementById("connectTab");

  if (!siteTop) return;

  function getViewportHeight() {
    return window.visualViewport ? window.visualViewport.height : window.innerHeight;
  }

  function positionTabs() {
    var navHeight = siteTop.offsetHeight;
    var viewportHeight = getViewportHeight();
    var centerY = navHeight + (viewportHeight - navHeight) / 2;

    if (highlightsTab) highlightsTab.style.top = (centerY - 32) + "px";
    if (connectTab) connectTab.style.top = (centerY + 32) + "px";
  }

  positionTabs();
  window.addEventListener("resize", positionTabs);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", positionTabs);
  }

  // Popups: centre each one within the space below the nav, not the
  // full page. Hidden until measured+positioned (avoids a flash at
  // the wrong spot), matching the working pattern used elsewhere.
  document.querySelectorAll(".highlights-connect-dialog").forEach(function (dialog) {
    var modalEl = dialog.closest(".modal");
    if (!modalEl) return;

    function positionCentered() {
      var navHeight = siteTop.offsetHeight;
      var viewportHeight = getViewportHeight();
      var availableHeight = viewportHeight - navHeight;
      var dialogHeight = dialog.offsetHeight;
      var margin = 16;

      var top = navHeight + Math.max(margin, (availableHeight - dialogHeight) / 2);
      var maxTop = viewportHeight - dialogHeight - margin;
      if (top > maxTop) top = maxTop;

      dialog.style.position = "fixed";
      dialog.style.top = top + "px";
      dialog.style.left = "50%";
      dialog.style.transform = "translateX(-50%)";
      dialog.style.margin = "0";
    }

    modalEl.addEventListener("show.bs.modal", function () {
      dialog.style.visibility = "hidden";
      dialog.style.opacity = "0";
    });

    modalEl.addEventListener("shown.bs.modal", function () {
      positionCentered();
      dialog.style.transition = "opacity .2s ease";
      dialog.style.visibility = "";
      // eslint-disable-next-line no-unused-expressions
      dialog.offsetHeight;
      dialog.style.opacity = "1";
    });

    window.addEventListener("resize", function () {
      if (modalEl.classList.contains("show")) positionCentered();
    });
  });
});


// Durgotsav 2026 souvenir flipbook (durga-puja.html, #fbBook)
// Pages are built from data attributes on #fbBook, so the HTML stays small.
// Only the leaves next to the open page load their images.
document.addEventListener("DOMContentLoaded", function () {
  var book = document.getElementById("fbBook");
  if (!book) return;

  var TOTAL = parseInt(book.getAttribute("data-pages"), 10) || 0;
  var SRC = book.getAttribute("data-src") || "";
  var NAME = book.getAttribute("data-title") || "Souvenir";
  if (!TOTAL || !SRC) return;

  // Section bookmarks (page numbers as printed, 1-based)
  var SECTIONS = [
    { page: 1, label: "Cover" },
    { page: 4, label: "Invitation" },
    { page: 5, label: "Puja Schedule" },
    { page: 6, label: "President's Desk" },
    { page: 25, label: "Going Digital" },
    { page: 33, label: "Accounts" },
    { page: 40, label: "Memories" },
    { page: 78, label: "Sports & Games" },
    { page: 105, label: "Children's Art" },
    { page: 138, label: "Payment Details" }
  ];

  function pad(n) { return ("00" + n).slice(-3); }
  function srcOf(i) { return SRC.replace("{n}", pad(i + 1)); }
  function sectionOf(i) {
    var s = SECTIONS[0];
    for (var k = 0; k < SECTIONS.length; k++) { if (SECTIONS[k].page - 1 <= i) s = SECTIONS[k]; }
    return s;
  }
  function labelOf(i) { return NAME + ", page " + (i + 1) + " (" + sectionOf(i).label + ")"; }

  /* ---------- build the leaves ---------- */
  var LEAVES = Math.ceil(TOTAL / 2);
  var RATIO = 0.7071;   // A4 portrait
  var frag = document.createDocumentFragment();
  for (var L = 0; L < LEAVES; L++) {
    var leaf = document.createElement("div");
    leaf.className = "fb-leaf";
    [L * 2, L * 2 + 1].forEach(function (p, k) {
      var face = document.createElement("div");
      face.className = "fb-face " + (k === 0 ? "fb-front" : "fb-back");
      if (p < TOTAL) {
        var img = document.createElement("img");
        img.setAttribute("data-page", p);
        img.setAttribute("decoding", "async");
        img.setAttribute("draggable", "false");
        img.alt = "";
        face.appendChild(img);
      } else {
        face.classList.add("fb-blank");
      }
      var sheen = document.createElement("div");
      sheen.className = "fb-sheen";
      face.appendChild(sheen);
      leaf.appendChild(face);
    });
    frag.appendChild(leaf);
  }
  book.appendChild(frag);

  var section = document.getElementById("invitation");
  var viewport = document.getElementById("fbViewport");
  var bookrow = document.getElementById("fbBookrow");
  var leafEls = Array.prototype.slice.call(book.querySelectorAll(".fb-leaf"));
  var imgEls = Array.prototype.slice.call(book.querySelectorAll(".fb-face img"));
  var prevBtn = document.getElementById("fbPrev");
  var nextBtn = document.getElementById("fbNext");
  var counter = document.getElementById("fbCounter");
  var chipsBox = document.getElementById("fbChips");
  var edgesR = document.getElementById("fbEdgesR");
  var edgesL = document.getElementById("fbEdgesL");
  var lb = document.getElementById("fbLightbox");
  var lbImg = document.getElementById("fbLbImg");
  var lbCap = document.getElementById("fbLbCap");
  var lbPrev = document.getElementById("fbLbPrev");
  var lbNext = document.getElementById("fbLbNext");
  var gotoForm = document.getElementById("fbGoto");
  var gotoInput = document.getElementById("fbGotoInput");

  var mq = window.matchMedia("(min-width: 860px)");
  var spread = mq.matches;
  var flipped = 0;   // spread mode: leaves turned (0..LEAVES)
  var idx = 0;       // single mode: page index (0..TOTAL-1)
  var busy = false;
  var lbIndex = 0;

  if (gotoInput) gotoInput.max = TOTAL;

  /* ---------- lazy images: load only the leaves near the open page ---------- */
  function loadLeaf(L) {
    var el = leafEls[L];
    if (!el) return;
    Array.prototype.forEach.call(el.querySelectorAll("img"), function (img) {
      if (img.getAttribute("src")) return;
      var p = parseInt(img.getAttribute("data-page"), 10);
      img.alt = labelOf(p);
      img.src = srcOf(p);
    });
  }

  /* ---------- sizing ---------- */
  function size() {
    var rowW = bookrow.clientWidth || window.innerWidth;
    var top = document.querySelector(".site-top");
    var headH = top ? top.offsetHeight : 0;     // the header is sticky, so keep the page clear of it
    var availH = Math.max(420, Math.min(window.innerHeight - headH - 24, 860));
    var pw, ph;
    if (spread) {
      var availW = Math.max(240, rowW - (prevBtn.offsetWidth * 2 + 40));
      ph = availH; pw = ph * RATIO;
      if (pw * 2 > availW) { pw = availW / 2; ph = pw / RATIO; }
    } else {
      pw = Math.min(rowW * 0.94, window.innerWidth * 0.94);
      ph = pw / RATIO;
      if (ph > availH) { ph = availH; pw = ph * RATIO; }
    }
    viewport.classList.toggle("fb-single", !spread);
    viewport.style.setProperty("--pw", pw.toFixed(2) + "px");
    viewport.style.setProperty("--ph", ph.toFixed(2) + "px");
    viewport.style.width = (spread ? pw * 2 : pw).toFixed(2) + "px";
    viewport.style.height = ph.toFixed(2) + "px";
    render();
  }

  /* ---------- state ---------- */
  function leavesTurned() { return spread ? flipped : Math.floor((idx + 1) / 2); }

  function visiblePages() {
    if (!spread) return [idx];
    if (flipped === 0) return [0];
    var left = flipped * 2 - 1, right = flipped * 2;
    return right < TOTAL ? [left, right] : [left];
  }

  function atStart() { return spread ? flipped === 0 : idx === 0; }
  function atEnd() { return spread ? flipped === LEAVES : idx === TOTAL - 1; }

  function render() {
    var f = leavesTurned();
    leafEls.forEach(function (el, i) {
      var isF = i < f;
      el.classList.toggle("fb-flipped", isF);
      el.style.zIndex = isF ? (i + 1) : (LEAVES - i);
      // keep only the leaves around the open page in play; the rest are hidden
      var near = i >= f - 2 && i <= f + 1;
      el.style.visibility = near || el.classList.contains("fb-turning") ? "" : "hidden";
      if (i >= f - 2 && i <= f + 2) loadLeaf(i);
    });

    var pw = parseFloat(viewport.style.getPropertyValue("--pw")) || 0;
    var shift = 0;
    if (!spread) {
      shift = (idx % 2 === 0) ? -pw / 2 : pw / 2;
    } else if (f === 0) {
      shift = -pw / 2;            // closed: cover centred
    } else if (f === LEAVES) {
      shift = pw / 2;             // finished: last page centred
    }
    viewport.style.setProperty("--shift", shift.toFixed(2) + "px");
    viewport.classList.toggle("fb-solo", !spread || f === 0 || f === LEAVES);

    var remaining = LEAVES - f;
    edgesR.style.opacity = remaining > 0 ? Math.min(1, remaining / 2 + 0.25) : 0;
    edgesR.style.transform = "scaleX(" + Math.max(0.35, remaining / LEAVES) + ")";
    edgesL.style.opacity = f > 0 ? Math.min(1, f / 2 + 0.25) : 0;
    edgesL.style.transform = "scaleX(" + Math.max(0.35, f / LEAVES) + ")";

    prevBtn.disabled = atStart();
    nextBtn.disabled = atEnd();

    var vis = visiblePages();
    counter.innerHTML = vis.length > 1
      ? "Page <b>" + (vis[0] + 1) + "–" + (vis[1] + 1) + "</b> of " + TOTAL
      : "Page <b>" + (vis[0] + 1) + "</b> of " + TOTAL;

    var cur = sectionOf(vis[vis.length - 1]);
    Array.prototype.forEach.call(chipsBox.children, function (c, i) {
      c.setAttribute("aria-current", SECTIONS[i] === cur ? "true" : "false");
    });
  }

  function mark(i) {
    var el = leafEls[i];
    if (!el) return;
    el.classList.add("fb-turning");
    el.style.zIndex = LEAVES + 2;
    busy = true;
    setTimeout(function () { el.classList.remove("fb-turning"); busy = false; render(); }, 920);
  }

  function go(dir) {
    if (busy) return;
    if (spread) {
      var t = flipped + dir;
      if (t < 0 || t > LEAVES) return;
      mark(dir > 0 ? flipped : flipped - 1);
      flipped = t;
    } else {
      var n = idx + dir;
      if (n < 0 || n > TOTAL - 1) return;
      var before = leavesTurned();
      idx = n;
      var after = leavesTurned();
      if (after !== before) mark(Math.min(before, after));
    }
    render();
  }

  function jump(page) {
    if (busy) return;
    page = Math.max(0, Math.min(TOTAL - 1, page));
    if (spread) { flipped = page === 0 ? 0 : Math.floor((page + 1) / 2); }
    else { idx = page; }
    render();
  }

  /* ---------- section chips ---------- */
  SECTIONS.forEach(function (s) {
    var b = document.createElement("button");
    b.className = "fb-chip";
    b.type = "button";
    b.textContent = s.label;
    b.title = "Go to page " + s.page;
    b.addEventListener("click", function () { jump(s.page - 1); });
    chipsBox.appendChild(b);
  });

  /* ---------- go to page ---------- */
  if (gotoForm) {
    gotoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = parseInt(gotoInput.value, 10);
      if (n >= 1 && n <= TOTAL) { jump(n - 1); gotoInput.blur(); }
    });
  }

  /* ---------- interactions ---------- */
  nextBtn.addEventListener("click", function () { go(1); });
  prevBtn.addEventListener("click", function () { go(-1); });

  viewport.addEventListener("click", function (e) {
    if (busy) return;
    var r = viewport.getBoundingClientRect();
    go(e.clientX - r.left > r.width / 2 ? 1 : -1);
  });

  // Keyboard: only while focus is inside the flipbook, so the page's own
  // arrow / Home / End scrolling is never hijacked.
  section.addEventListener("keydown", function (e) {
    if (lb.classList.contains("fb-open")) return;
    if (e.target && e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") { go(1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); }
  });

  // Horizontal swipe turns the page; vertical movement is left to the browser,
  // so the page keeps scrolling normally on phones.
  var tsx = 0, tsy = 0;
  viewport.addEventListener("touchstart", function (e) {
    tsx = e.changedTouches[0].clientX; tsy = e.changedTouches[0].clientY;
  }, { passive: true });
  viewport.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - tsx;
    var dy = e.changedTouches[0].clientY - tsy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) { go(dx < 0 ? 1 : -1); }
  }, { passive: true });

  /* ---------- lightbox (read full size, with its own page arrows) ---------- */
  function showLb(i) {
    lbIndex = Math.max(0, Math.min(TOTAL - 1, i));
    lbImg.src = srcOf(lbIndex);
    lbImg.alt = labelOf(lbIndex);
    lbImg.classList.remove("fb-zoomed");
    lbCap.textContent = sectionOf(lbIndex).label + " · page " + (lbIndex + 1) + " of " + TOTAL;
    if (lbPrev) lbPrev.disabled = lbIndex === 0;
    if (lbNext) lbNext.disabled = lbIndex === TOTAL - 1;
    if (lbIndex + 1 < TOTAL) new Image().src = srcOf(lbIndex + 1);
  }
  function openLb(i) {
    showLb(i);
    lb.classList.add("fb-open");
    document.documentElement.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("fb-open");
    document.documentElement.style.overflow = "";
    jump(lbIndex);   // the book follows the page that was being read
  }
  document.getElementById("fbLbClose").addEventListener("click", closeLb);
  if (lbPrev) lbPrev.addEventListener("click", function (e) { e.stopPropagation(); showLb(lbIndex - 1); });
  if (lbNext) lbNext.addEventListener("click", function (e) { e.stopPropagation(); showLb(lbIndex + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  lbImg.addEventListener("click", function () { lbImg.classList.toggle("fb-zoomed"); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("fb-open")) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowRight") { showLb(lbIndex + 1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { showLb(lbIndex - 1); e.preventDefault(); }
  });
  var lsx = 0, lsy = 0;
  lb.addEventListener("touchstart", function (e) {
    lsx = e.changedTouches[0].clientX; lsy = e.changedTouches[0].clientY;
  }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (lbImg.classList.contains("fb-zoomed")) return;
    var dx = e.changedTouches[0].clientX - lsx;
    var dy = e.changedTouches[0].clientY - lsy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) { showLb(lbIndex + (dx < 0 ? 1 : -1)); }
  }, { passive: true });

  document.getElementById("fbZoom").addEventListener("click", function (e) {
    e.stopPropagation();
    var vis = visiblePages();
    openLb(vis[vis.length - 1]);
  });

  viewport.addEventListener("dblclick", function (e) {
    e.preventDefault(); e.stopPropagation();
    var r = viewport.getBoundingClientRect();
    var vis = visiblePages();
    var right = e.clientX - r.left > r.width / 2;
    openLb(vis.length > 1 ? (right ? vis[1] : vis[0]) : vis[0]);
  });

  /* ---------- mode switching and resize ---------- */
  function onMode() {
    var wasSpread = spread;
    spread = mq.matches;
    if (wasSpread !== spread) {
      if (spread) { flipped = idx === 0 ? 0 : Math.floor((idx + 1) / 2); }
      else { idx = flipped === 0 ? 0 : flipped * 2 - 1; }
    }
    size();
  }
  if (mq.addEventListener) mq.addEventListener("change", onMode); else mq.addListener(onMode);
  window.addEventListener("resize", size);
  window.addEventListener("orientationchange", function () { setTimeout(size, 250); });

  onMode();
});
