// Gurgaon Bengalee Association Website
console.log("Website Loaded");

// Durga Puja 2026 full Days/Hours/Minutes/Seconds countdown
// Panchami (start) = 15 Oct 2026, 00:00
// Vijaya Dashami end (festival close) = 21 Oct 2026, 23:59:59
document.addEventListener("DOMContentLoaded", function () {
  var daysEl = document.getElementById("cdDays");
  var hoursEl = document.getElementById("cdHours");
  var minutesEl = document.getElementById("cdMinutes");
  var secondsEl = document.getElementById("cdSeconds");
  var captionEl = document.getElementById("dhmsCaption");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  var pujaStart = new Date("2026-10-15T00:00:00");
  var pujaEnd = new Date("2026-10-21T23:59:59");

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function updateCountdown() {
    var now = new Date();
    var target;

    if (now < pujaStart) {
      target = pujaStart;
      if (captionEl) captionEl.textContent = "Until Durga Puja 2026 Begins";
    } else if (now <= pujaEnd) {
      target = pujaEnd;
      if (captionEl) captionEl.textContent = "Until Durga Puja 2026 Celebrations End";
    } else {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      if (captionEl) captionEl.textContent = "Durga Puja 2026 Has Concluded — See You Next Year!";
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


// Durgotsav 2026 invitation flipbook (durga-puja.html, #fbBook)
document.addEventListener("DOMContentLoaded", function () {
  var book = document.getElementById("fbBook");
  if (!book) return;

  var PAGES = [
    { src: "images/invitation-2026-p1.jpg", label: "Cover" },
    { src: "images/invitation-2026-p2.jpg", label: "Invitation",
      hotspot: { x: 49.64, y: 90.85, w: 36.43, h: 6.06,
        href: "https://maps.app.goo.gl/xi2QhFZogh8ZSVWZ8",
        title: "Tap to open location in Google Maps",
        toast: "Opening location in Google Maps…", kind: "map" } },
    { src: "images/invitation-2026-p3.jpg", label: "Puja Schedule" },
    { src: "images/invitation-2026-p4.jpg", label: "Payment Details",
      hotspot: { x: 51.24, y: 53.45, w: 35.2, h: 24.9,
        href: "upi://pay?pa=begaleeassociation%40indianbk&pn=Gurgaon%20Bengalee%20Association&cu=INR&tn=GBA%20Durgotsav%202026",
        vpa: "begaleeassociation@indianbk",
        title: "Tap to pay via UPI",
        toast: "Opening UPI app… if nothing happens, pay to begaleeassociation@indianbk", kind: "pay" } }
  ];
  var LEAVES = Math.ceil(PAGES.length / 2);
  var RATIO = 0.7076;

  var section = document.getElementById("invitation");
  var viewport = document.getElementById("fbViewport");
  var bookrow = document.getElementById("fbBookrow");
  var leafEls = Array.prototype.slice.call(book.querySelectorAll(".fb-leaf"));
  var prevBtn = document.getElementById("fbPrev");
  var nextBtn = document.getElementById("fbNext");
  var counter = document.getElementById("fbCounter");
  var chipsBox = document.getElementById("fbChips");
  var edgesR = document.getElementById("fbEdgesR");
  var edgesL = document.getElementById("fbEdgesL");
  var lb = document.getElementById("fbLightbox");
  var lbImg = document.getElementById("fbLbImg");
  var lbCap = document.getElementById("fbLbCap");
  var toast = document.getElementById("fbToast");

  var mq = window.matchMedia("(min-width: 860px)");
  var spread = mq.matches;
  var flipped = 0;   // spread mode: leaves turned (0..LEAVES)
  var idx = 0;       // single mode: page index (0..N-1)
  var busy = false;

  /* ---------- hotspots (map link, UPI pay) ---------- */
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("fb-show");
    clearTimeout(toast._h);
    toast._h = setTimeout(function () { toast.classList.remove("fb-show"); }, 3600);
  }

  Array.prototype.forEach.call(book.querySelectorAll(".fb-face img"), function (img) {
    var i = parseInt(img.getAttribute("data-page"), 10);
    var hs = PAGES[i] && PAGES[i].hotspot;
    if (!hs) return;
    var a = document.createElement("a");
    a.className = "fb-hotspot" + (hs.kind ? " fb-" + hs.kind : "");
    a.href = hs.href;
    a.target = /^https?:/i.test(hs.href) ? "_blank" : "_self";
    a.rel = "noopener";
    a.title = hs.title || "Tap for more";
    a.style.left = hs.x + "%";
    a.style.top = hs.y + "%";
    a.style.width = hs.w + "%";
    a.style.height = hs.h + "%";
    a.addEventListener("click", function (e) {
      e.stopPropagation();
      if (hs.vpa && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hs.vpa).catch(function () {});
      }
      showToast(hs.toast || "Opening…");
    });
    a.addEventListener("dblclick", function (e) { e.stopPropagation(); });
    a.addEventListener("touchend", function (e) { e.stopPropagation(); });
    img.parentNode.appendChild(a);
  });

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
    return right < PAGES.length ? [left, right] : [left];
  }

  function atStart() { return spread ? flipped === 0 : idx === 0; }
  function atEnd() { return spread ? flipped === LEAVES : idx === PAGES.length - 1; }

  function render() {
    var f = leavesTurned();
    leafEls.forEach(function (el, i) {
      var isF = i < f;
      el.classList.toggle("fb-flipped", isF);
      el.style.zIndex = isF ? (i + 1) : (LEAVES - i);
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
      ? "Page <b>" + (vis[0] + 1) + "–" + (vis[1] + 1) + "</b> of " + PAGES.length
      : "Page <b>" + (vis[0] + 1) + "</b> of " + PAGES.length;

    Array.prototype.forEach.call(chipsBox.children, function (c, i) {
      c.setAttribute("aria-current", vis.indexOf(i) !== -1 ? "true" : "false");
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
      if (n < 0 || n > PAGES.length - 1) return;
      var before = leavesTurned();
      idx = n;
      var after = leavesTurned();
      if (after !== before) mark(Math.min(before, after));
    }
    render();
  }

  function jump(page) {
    if (busy) return;
    if (spread) { flipped = page === 0 ? 0 : Math.floor((page + 1) / 2); }
    else { idx = page; }
    render();
  }

  /* ---------- chips ---------- */
  PAGES.forEach(function (p, i) {
    var b = document.createElement("button");
    b.className = "fb-chip";
    b.type = "button";
    b.textContent = p.label;
    b.addEventListener("click", function () { jump(i); });
    chipsBox.appendChild(b);
  });

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

  /* ---------- lightbox ---------- */
  function openLb(i) {
    lbImg.src = PAGES[i].src;
    lbImg.alt = PAGES[i].label;
    lbImg.classList.remove("fb-zoomed");
    lbCap.textContent = PAGES[i].label + " · page " + (i + 1) + " of " + PAGES.length;
    lb.classList.add("fb-open");
    document.documentElement.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("fb-open");
    document.documentElement.style.overflow = "";
  }
  document.getElementById("fbLbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  lbImg.addEventListener("click", function () { lbImg.classList.toggle("fb-zoomed"); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lb.classList.contains("fb-open")) closeLb();
  });

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

  /* ---------- save page ---------- */
  document.getElementById("fbSave").addEventListener("click", function (e) {
    e.stopPropagation();
    visiblePages().forEach(function (i, k) {
      setTimeout(function () {
        var a = document.createElement("a");
        a.href = PAGES[i].src;
        a.download = "GBA-Durgotsav-2026-" + ("0" + (i + 1)).slice(-2) + "-" +
                     PAGES[i].label.replace(/[^A-Za-z0-9]+/g, "-") + ".jpg";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }, k * 350);
    });
  });

  /* ---------- countdown to Durga Shashthi (India time) ---------- */
  (function () {
    var el = document.getElementById("fbCountdown");
    if (!el) return;
    var start = Date.parse("2026-10-16T00:00:00+05:30");
    var end = Date.parse("2026-10-22T00:00:00+05:30");
    function tick() {
      var now = Date.now();
      if (now < start) {
        var d = Math.ceil((start - now) / 86400000);
        el.innerHTML = "<b>" + d + "</b> day" + (d === 1 ? "" : "s") + " to Durga Shashthi";
      } else if (now < end) {
        el.innerHTML = "Pujo is on — <b>আসুন, আনন্দ করুন</b>";
      } else {
        el.innerHTML = "আসছে বছর আবার হবে";
      }
    }
    tick();
    setInterval(tick, 60000);
  })();

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

  // warm the remaining pages once the main page has finished loading
  window.addEventListener("load", function () {
    setTimeout(function () {
      for (var i = 1; i < PAGES.length; i++) { new Image().src = PAGES[i].src; }
    }, 600);
  });

  onMode();
});
