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


// Durgotsav 2026 invitation flipbook
document.addEventListener("DOMContentLoaded", function () {
  var stage = document.getElementById("flipbookStage");
  if (!stage) return;

  var topPage = document.getElementById("flipbookTop");
  var underPage = document.getElementById("flipbookUnder");
  var counter = document.getElementById("flipbookCounter");
  var fullLink = document.getElementById("flipbookFull");
  var dotsWrap = document.getElementById("flipbookDots");
  var prevBtn = document.getElementById("flipbookPrev");
  var nextBtn = document.getElementById("flipbookNext");

  var pages = [
    { src: "images/flipbook-1.jpg", alt: "Durgotsav 2026 invitation cover — 45th year celebration, 15 to 21 October 2026" },
    { src: "images/flipbook-2.jpg", alt: "Invitation letter from the President and Secretary of Gurgaon Bengalee Association" },
    { src: "images/flipbook-3.jpg", alt: "Puja schedule with ritual timings from Durga Shashthi to Vijaya Dashami" },
    { src: "images/flipbook-4.jpg", alt: "Payment details for sponsorship and advertisement contributions" }
  ];

  var current = 0;
  var busy = false;
  var TURN = 450;

  pages.forEach(function (p, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "flipbook-dot";
    b.setAttribute("aria-label", "Go to page " + (i + 1));
    b.addEventListener("click", function () { turnTo(i); });
    dotsWrap.appendChild(b);
  });

  var dots = dotsWrap.querySelectorAll(".flipbook-dot");

  function render() {
    topPage.src = pages[current].src;
    topPage.alt = pages[current].alt;
    underPage.src = pages[Math.min(current + 1, pages.length - 1)].src;
    counter.textContent = (current + 1) + " / " + pages.length;
    fullLink.href = pages[current].src;
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("is-active", i === current);
    }
    prevBtn.disabled = (current === 0);
    nextBtn.disabled = (current === pages.length - 1);
  }

  function rest() {
    topPage.style.transition = "none";
    topPage.style.transform = "rotateY(0deg)";
    topPage.style.boxShadow = "none";
    void topPage.offsetWidth;
  }

  function turnTo(target) {
    if (busy || target === current || target < 0 || target >= pages.length) return;
    busy = true;

    if (target > current) {
      // the page on top lifts and turns away, revealing the next page beneath
      underPage.src = pages[target].src;
      topPage.style.transition = "transform " + TURN + "ms ease-in, box-shadow " + TURN + "ms ease-in";
      topPage.style.transform = "rotateY(-105deg)";
      topPage.style.boxShadow = "14px 0 30px rgba(0,0,0,.28)";
    } else {
      // going back: the earlier page swings in from the left and lands on top
      underPage.src = pages[current].src;
      topPage.src = pages[target].src;
      topPage.alt = pages[target].alt;
      topPage.style.transition = "none";
      topPage.style.transform = "rotateY(-105deg)";
      topPage.style.boxShadow = "14px 0 30px rgba(0,0,0,.28)";
      void topPage.offsetWidth;
      topPage.style.transition = "transform " + TURN + "ms ease-out, box-shadow " + TURN + "ms ease-out";
      topPage.style.transform = "rotateY(0deg)";
      topPage.style.boxShadow = "none";
    }

    setTimeout(function () {
      current = target;
      rest();
      render();
      busy = false;
    }, TURN + 20);
  }

  prevBtn.addEventListener("click", function () { turnTo(current - 1); });
  nextBtn.addEventListener("click", function () { turnTo(current + 1); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") turnTo(current + 1);
    if (e.key === "ArrowLeft") turnTo(current - 1);
  });

  var startX = null;
  stage.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  stage.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) turnTo(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  rest();
  render();

  setTimeout(function () {
    for (var i = 1; i < pages.length; i++) { new Image().src = pages[i].src; }
  }, 1200);
});
