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

  function positionDialog() {
    var cardRect = triggerCard.getBoundingClientRect();
    var dialogHeight = dialog.offsetHeight;
    var margin = 12;

    var top = cardRect.bottom - dialogHeight;

    // Keep it fully on screen even if the card is scrolled near an edge
    var maxTop = window.innerHeight - dialogHeight - margin;
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
    positionDialog();
    dialog.style.transition = "opacity .2s ease";
    dialog.style.visibility = "";
    // Force a reflow so the opacity transition actually plays
    // eslint-disable-next-line no-unused-expressions
    dialog.offsetHeight;
    dialog.style.opacity = "1";
  });

  window.addEventListener("resize", function () {
    if (auditionModal.classList.contains("show")) positionDialog();
  });
});
