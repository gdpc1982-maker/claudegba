// Gurgaon Bengalee Association Website
console.log("Website Loaded");

// Durga Puja 2026 countdown (Maha Panchami = 15 Oct 2026)
document.addEventListener("DOMContentLoaded", function () {
  var badge = document.getElementById("countdownBadge");
  if (!badge) return;

  var pujaStart = new Date("2026-10-15T00:00:00");
  var today = new Date();
  var diffMs = pujaStart - today;
  var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    badge.textContent = diffDays + " Days to Go — Durga Puja 2026";
  } else if (diffDays === 1) {
    badge.textContent = "Tomorrow — Durga Puja 2026 Begins!";
  } else if (diffDays === 0) {
    badge.textContent = "Today — Durga Puja 2026 Begins!";
  } else {
    badge.textContent = "Durga Puja 2026 Celebrations Are Here!";
  }
});
