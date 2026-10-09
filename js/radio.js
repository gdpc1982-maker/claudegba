/* =====================================================
   Durga Puja Radio — Agomoni by GBA (radio.html only)
   Live Akashvani FM Rainbow Kolkata stream, Mahalaya and
   Pujo playlists through a hidden YouTube player, Dhak,
   reminder, auto-start, countdowns and dates.
   Plain JavaScript, no build step.

   Testing: open radio.html?phase=before | live | after
   to simulate the time around the broadcast.
===================================================== */

(function () {
  "use strict";

  /* ---------- Festival dates (IST). Update these each year. ---------- */

  var MAHALAYA = Date.parse("2026-10-10T04:00:00+05:30");
  var BROADCAST_END = MAHALAYA + 2 * 3600000;
  var PUJA_START = Date.parse("2026-10-15T00:00:00+05:30"); // Maha Panchami, as on durga-puja-2026.html
  var PUJA_END = Date.parse("2026-10-21T23:59:59+05:30");

  var DATES = [
    { bn: "মহালয়া", en: "Mahalaya", from: "2026-10-10", hi: true },
    { bn: "পঞ্চমী", en: "Maha Panchami", from: "2026-10-15" },
    { bn: "ষষ্ঠী", en: "Maha Shashthi", from: "2026-10-16" },
    { bn: "সপ্তমী", en: "Maha Saptami", from: "2026-10-17", to: "2026-10-18" },
    { bn: "অষ্টমী", en: "Maha Ashtami", from: "2026-10-19" },
    { bn: "নবমী", en: "Maha Navami", from: "2026-10-20" },
    { bn: "বিজয়া দশমী", en: "Vijaya Dashami", from: "2026-10-21" }
  ];

  /* ---------- Sources ---------- */

  // Akashvani (All India Radio) Kolkata FM Rainbow, which carries the Mahalaya broadcast.
  var LIVE_STREAM = "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio058/hlspbaudio05864kbps.m3u8";
  var HLS_JS = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
  // Optional recording; if the file is missing a built-in drum pattern plays instead.
  var DHAK_AUDIO = "audio/dhak.mp3";
  var STORE = "gba.radio.v1";

  /* ---------- Tracks ---------- */

  var LIVE = {
    id: "live", kind: "live", live: true, hidden: true,
    title: "Akashvani FM Rainbow · Live",
    artist: "Akashvani FM Rainbow Kolkata"
  };

  function list(kind, rows) {
    return rows.map(function (r) {
      return { id: r[0], yt: r[1], title: r[2], artist: r[3], dur: r[4], kind: kind };
    });
  }

  var TRACKS = {
    mahalaya: [LIVE].concat(list("mahalaya", [
      ["yt1", "YQyo8QeoYhc", "Mahishasuramardini · Full", "Birendra Krishna Bhadra · Saregama", 5358]
    ])),
    songs: list("songs", [
      ["s1", "6ZCfPaz28_U", "Ya Chandi", "Chorus", 96],
      ["s2", "Zzi8ib_jFec", "Simhastha Sashisekhara", "Chorus", 55],
      ["s3", "2Zqlb00ttCU", "Bajlo Tomar Aalor Benu With Narration", "Supriti Ghosh", 264],
      ["s6", "MgRe-FltkYo", "Tabo Achintya Rupa-Charita-Mahima", "Manabendra Mukherjee", 238],
      ["s7", "4Dt1gbgfGYY", "Aham Rudrebhirvasubhischara", "Chorus", 240],
      ["s9", "y1BxrvXleT8", "Jayanati Mangala Kali", "Chorus", 31],
      ["s11", "h5O3igngxCU", "Jatajutasamayuktamardhendukrita-Sekharam", "Chorus", 266],
      ["s12", "rxdEEnCRSgU", "Namo Chandi Namo Chandi", "Bimal Bhushan", 183],
      ["s13", "qdx842oMwnA", "Ma Go Tabu Beene Sangeeta", "Sumitra Sen", 212],
      ["s16", "zuVw7KFPQnk", "He Chinmoyi", "Tarun Banerjee", 176],
      ["s20", "_RmN29SHVS8", "Ogo Amar Agamani-Alo", "Sipra Basu", 200]
    ]),
    pujo: list("pujo", [
      ["d1", "CLdcGCxFfds", "Dugga Elo", "Monali Thakur, Guddu", 147],
      ["d2", "-me3KW1B1zo", "Ebar Jeno Onno Rokom Pujo", "Nakash Aziz, Antara Mitra, Indraadip Dasgupta +4", 213],
      ["d3", "3Gg0GP8DxhU", "Dugga Ma", "Arijit Singh, Arindom, Priyo Chattopadhyay +5", 270],
      ["d4", "EDfxdED-uRE", "Baja Sanai Aar Baja Re Dhol", "Abhijeet, Nilakshi Bhattacharya, Dev Sen +1", 284],
      ["d5", "E_6K3no0PD0", "Shundori Komola", "Armaan Malik, Antara Mitra", 194],
      ["d6", "id5_3dKvEBg", "Dhak Baja Kashor Baja", "Shreya Ghoshal, Jeet Gannguli", 265],
      ["d7", "NAUA2LM9hZc", "Elo Je Maa", "Abhijeet", 308],
      ["d8", "z4Vc5wHoLiY", "Dhaker Taley", "Abhijeet, Parineeta, Sudipto +1", 283],
      ["d11", "XyatKcoBrPw", "Bolo Dugga Elo", "Sunidhi Chauhan, Kaushik-Guddu", 199],
      ["d13", "9OkzYV4R9nc", "Durga Maa", "Akassh, Haimanti", 220],
      ["d14", "3E_qefwPA0E", "Joy Joy Durga Maa", "Abhijit Bhattacharya, Jeet Gannguli, Shaan", 209],
      ["d15", "Icgq6OE7b30", "Maa Ashchhe - From \"Maa Ashchhe\"", "Sanjeev Tiwari", 207],
      ["d16", "bQtuffhU6_4", "Esho Maa Durga", "Shamik Guha Roy, Suman Mickey Chatterjee, Abhirup Biswas +1", 236],
      ["d17", "60tSbJWJCr0", "Maa Go Tui", "Manomay Bhattacharya, Somchanda Bhattacharya", 120],
      ["d19", "G7CdEseBpwc", "Dhak Baaja Komor Nacha", "Jeet, Akriti Kakar, Dev Negi", 212],
      ["d20", "EbcdDXEPukk", "Aigiri Nandini - Rock Version", "Sowrabha, Samarthan, Ramprakash", 296],
      ["d21", "p_hqO0sJh-I", "Ailo Uma Barite", "Antara Nandy, MONAMI GHOSH", 233],
      ["d22", "JrcqCpFjE7Q", "Aaj Baaje", "Somchanda Bhattacharya", 213],
      ["d23", "tP6MIon3S5c", "Yoddhar Saathe Ebar Pujo Katan", "Nakash Aziz, Savvy, Riddhi +3", 226],
      ["d26", "aUO_yI7Hcfo", "Pujor Gaan", "Poushali Bhattacharya, Abritte Talukdar, Alivia Das +5", 284],
      ["d27", "4h5DXcN6cd4", "Aamaar Dugga", "Monali Thakur, Tyohaar, Anindya Chatterjee", 199],
      ["d28", "asdoVzpUFsE", "Gouri Elo (From \"Raktabeej\")", "Dohar, Tirtha Bhattacharya", 236],
      ["d29", "zZ4dYYcPxUY", "Aham Rudre", "Students of Sourendro-Soumyojit Academy of Music, Sourendro-Soumyojit", 159],
      ["d30", "xUMhpMmwAmM", "O Menoka O Menoka", "Antara Nandy, Ankita Nandy", 196],
      ["d31", "hnkfDCbULxk", "Uma Ashe Notun Saje", "Ankita Bhattacharyya", 186],
      ["d32", "UElpQ1D3CkA", "Elo Re Pujo Elo", "Nakash Aziz, Senjuti Das", 193],
      ["d33", "mDEzESGA0h8", "Chaarpashe Aalo Hok", "Indraadip Dasgupta, Ajoy Chakrabarty, Kaushiki Chakraborty +7", 694],
      ["d34", "7GYJcXSLwYo", "O Thakur", "Upal Sengupta, Prosmita Pal", 171],
      ["d35", "IbDqRfeqjDo", "Rupang Dehi", "Snita Pramanik Ghosh", 258],
      ["d36", "PEiFJAy_zsM", "Shubho Shubho", "Amit Trivedi, Altamash Faridi", 194],
      ["d38", "Ghem4nJZXwE", "Durga Maa Eseche", "Akassh", 187],
      ["d41", "LLer3VPOcxg", "Dugga Ma Asche", "Infra", 214],
      ["d43", "HNF9LyxTH7U", "Boisakher Bikelbelay", "Akassh", 183],
      ["d44", "W-YAf-bHkCw", "Gouri Elo Dekhe Jalo", "Dohar", 340],
      ["d45", "Ku7mJminJxI", "Durge Durge Durgatinashini", "Asha Bhosle", 309],
      ["d46", "XpZ0mqdwFOg", "Aigiri Nandini - Mahishasura Mardini Stotram", "Rajalakshmee Sanjay", 901],
      ["d47", "uVTuUieyO7o", "Pujor Dhaak Theme", "Bibhabendu Bhattacharya", 1005],
      ["d48", "sto9TBxGibE", "Jago Uma", "Rupankar Bagchi, Anupam Roy", 317],
      ["d49", "hDukD5TJmV4", "Kolki", "MONAMI GHOSH, Prativa Dutta, Rathijit Bhattacharjee", 245],
      ["d50", "I5uMBp5wDhI", "Abar Elo Maa", "Rahul Dutta, Ankita Bhattacharyya", 187],
      ["d51", "MgOAjrDnY7A", "Dugga Elo", "Akriti Kakar, Debanjali B Joshi", 238],
      ["d52", "CWtqPoZrUoA", "Joy Joy Durga Ma", "Agnibha Bandopadhyay", 351],
      ["d53", "avySoa5OW1w", "Eseche Maa Durga Maa (DJ Remix)", "Keshab Dey, Ankita Bhattacharyya, DJ Suman Raj", 183],
      ["d54", "haJg9VgzMM0", "Pujo Pujo Gondho", "Anupam Roy", 167],
      ["d55", "YnU9c1aj5hY", "He Maa Durga Maa", "Aseema Panda", 312],
      ["d56", "BvIcx9ev8X0", "Debi Sajer Gaan", "Rupak Tiary, Pragya Dutta", 181],
      ["d57", "MYShSi_QCqc", "Tomake Chai", "Arindom, Arijit Singh", 254],
      ["d58", "j9_MLElmS9g", "Meri Maa Ke Barabar Koi Nahi", "Jubin Nautiyal", 299],
      ["d59", "cFsCf0MGuuA", "Bajlo Tomar Aalor Benu", "Debolina Nandy", 316],
      ["d60", "63X0l49OyjI", "Durge Durge Durgatinashini", "Debolinaa Nandy", 223],
      ["d61", "_GUdZJQun2I", "Madhukaitava Vidhwangsi", "Tushar Dutta, Trishit, Supratik Das, Roompa", 589],
      ["d62", "QvhNGDZhJvE", "Kalo Jole Kuchla Tole", "Iman Chakraborty", 263],
      ["d63", "j7nWykTLEMs", "Bajlo Tomar Alor Benu", "Sriparna Das", 284],
      ["d64", "wLVkrgkoPro", "Mahishasura Mardhini", "Sri Vardhini, Sharath", 353],
      ["d65", "YC4ERU01ZxY", "Jago Tumi Jago", "Trissha Chatterjee", 149],
      ["d66", "Z7kpAzbC66E", "Borondala Saaja", "Madhuraa Bhattacharya, Jeet Gannguli, Chandrani Ganguli", 161],
      ["d67", "43_oBh4YsQs", "Phagun Haoyay Haoyay (From \"Bhalobashar Bari\")", "Jayati Chakraborty, Dipanwita Choudhury", 155],
      ["d68", "PRTXLKCV6Nk", "ওগো আমার আগমনী আলো", "Samadrita Ghosh", 291],
      ["d69", "ocCQ1UVsel8", "Agomonir Gaan", "Anupam Roy", 347],
      ["d70", "707QgEnx8Hs", "Saajan Rock the Dotara (Folk - Bandish Mix)", "Timir Biswas, Iman Chakraborty", 268],
      ["d71", "d-NMikRHMQQ", "Pujar Gaan (From \"Hooligaanism\")", "Hooligaanism, Anirban Bhattacharya, Subhadeep Guha, Debraj Bhattacharya", 393],
      ["d72", "ADpMft-PUb8", "Gouri Elo", "Aritra Dasgupta", 335],
      ["d73", "S-XOArX0faE", "Doob De Re Mon", "Nirmalya Roy", 136],
      ["d74", "-umiui0IOLc", "Apur Paayer Chhaap", "Arijit Singh", 247],
      ["d75", "AFOg5wPxduc", "Esho Hey", "Shreya Ghoshal, Ishan Mitra", 354],
      ["d76", "jkCWHTt2ml4", "Laage Ura Dhura (From \"Toofan\")", "Pritom Hasan, Debosrie Antara", 194],
      ["d77", "NwjbjGQXkdU", "Dushtu Kokil", "Kona, Akassh", 211],
      ["d78", "G2tTYmSzR6U", "Mala Re", "Jeet Gannguli", 248],
      ["d79", "hZ13SJfADoc", "Desi Chhori", "Neha Kakkar, Satrujit Dasgupta", 231],
      ["d80", "tMD3VtUyGz8", "Bujhina Toh Tai", "Nusraat Faria, Mumzy Stranger", 185],
      ["d81", "eoLZVAk9t_U", "Lady Killer Romeo", "Jeet Gannguli", 227],
      ["d82", "Akl5VLc4LQg", "Baundule Ghuri (From \"Dawshom Awbotaar\")", "Arijit Singh, Shreya Ghoshal, Anupam Roy", 344],
      ["d83", "Cz65HSIy18o", "Tumi Jantei Paro Naa (From \"Cheeni 2\")", "Mahtim Shakib, Mainak Mazoomdar", 225],
      ["d84", "1rYkwE0rAo4", "Taakey Olpo Kachhe Dakchhi", "Mahtim Shakib", 195],
      ["d85", "Ev1NLm7Kd4g", "Egiye De", "Arijit Singh, Madhubanti Bagchi, Arindom", 254],
      ["d86", "-L34Afos8MQ", "Shudhu Tomari Jonyo", "Arijit Singh", 200],
      ["d87", "h584yKCkw8E", "Amake Nao", "Debayan Banerjee", 190],
      ["d88", "GuA_q56Lqx0", "Sajani (From \"Dilkhush\")", "Nilayan Chatterjee", 208],
      ["d89", "GdT5tpNLkgY", "Pheshey Jaai", "Habib Wahid, Shithi Saha", 251],
      ["d90", "xXAJpbz7Ync", "Ure Geche", "Ash King, Monali Thakur", 267],
      ["d91", "jZc7DGsZkY0", "Aashona", "Arijit Singh, Prashmita Paul, Arindom", 244],
      ["d92", "KGjpdIsaogY", "Era Sukher Laagi", "Debojyoti Mishra", 165],
      ["d93", "QMyj2QHZXBU", "Tumi Aashe Paashe", "Monali Thakur, Nakash Aziz", 262],
      ["d94", "dJHzCyjCsLU", "Hey Shokha", "Somlata Acharyya Chowdhury, Arindom", 264]
    ])
  };

  var TABS = [
    { id: "mahalaya", label: "Mahalaya" },
    { id: "songs", label: "Mahalaya Songs" },
    { id: "pujo", label: "Durga Pujo" }
  ];

  var ICON = { live: "bi-broadcast", mahalaya: "bi-moon-stars-fill", songs: "bi-music-note-beamed", pujo: "bi-flower1" };

  var ALL = [].concat(TRACKS.mahalaya, TRACKS.songs, TRACKS.pujo);

  function byId(id) {
    for (var i = 0; i < ALL.length; i++) if (ALL[i].id === id) return ALL[i];
    return LIVE;
  }

  function tabOf(id) {
    for (var k in TRACKS) {
      for (var i = 0; i < TRACKS[k].length; i++) if (TRACKS[k][i].id === id) return k;
    }
    return "mahalaya";
  }

  /* ---------- Helpers ---------- */

  function $(id) { return document.getElementById(id); }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function mmss(s) {
    s = Math.max(0, Math.floor(s || 0));
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    return h ? h + ":" + pad(m) + ":" + pad(x) : m + ":" + pad(x);
  }

  function parts(ms) {
    var l = Math.max(0, Math.ceil(ms / 1000));
    return { d: Math.floor(l / 86400), h: Math.floor(l % 86400 / 3600), m: Math.floor(l % 3600 / 60), s: l % 60 };
  }

  function dayIST(ms) { return Math.floor((ms + 19800000) / 86400000); }

  function istDay(ms) {
    var o = {};
    try {
      new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" })
        .formatToParts(ms).forEach(function (p) { o[p.type] = p.value; });
    } catch (e) {}
    return o;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
    });
  }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (e) { return {}; }
  }

  function save(patch) {
    try {
      var o = load();
      for (var k in patch) o[k] = patch[k];
      localStorage.setItem(STORE, JSON.stringify(o));
    } catch (e) {}
  }

  // Broadcast time in the visitor's own time zone (null when they are already on IST).
  var LOCAL_WHEN = (function () {
    try {
      if (-new Date(MAHALAYA).getTimezoneOffset() === 330) return null;
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZoneName: "short"
      }).format(MAHALAYA);
    } catch (e) { return null; }
  })();

  /* ---------- Clock (with ?phase= simulation for testing) ---------- */

  var offset = 0;

  (function () {
    try {
      var p = new URLSearchParams(location.search).get("phase");
      var real = Date.now(), at = null;
      if (p === "before") at = real < MAHALAYA ? real : MAHALAYA - 6 * 3600000;
      else if (p === "live") at = MAHALAYA + 12 * 60000;
      else if (p === "after") at = BROADCAST_END + 40 * 60000;
      if (at !== null) offset = at - real;
    } catch (e) {}
  })();

  function now() { return Date.now() + offset; }

  function phase() {
    var t = now();
    return t < MAHALAYA ? "before" : t < BROADCAST_END ? "live" : "after";
  }

  /* ---------- State ---------- */

  var stored = load();

  var S = {
    trackId: "live",
    tab: "mahalaya",
    playing: false,
    progress: 0,
    ytDur: 0,
    ytBuf: false,
    shuffle: false,
    repeat: false,
    muted: false,
    dhak: false,
    reminded: !!stored.reminded,
    autoStart: !!stored.autoStart
  };

  function cur() { return byId(S.trackId); }

  /* ---------- Toast ---------- */

  var toastT = null;

  function toast(text) {
    var el = $("radioToast");
    if (!el) return;
    el.textContent = text;
    el.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove("is-on"); }, 2800);
  }

  /* ---------- Live radio (HLS) ---------- */

  var au = new Audio();
  au.preload = "none";

  var nativeHls = !!(au.canPlayType && au.canPlayType("application/vnd.apple.mpegurl"));
  var hls = null, hlsP = null, liveReady = false, liveLoading = false, auCmdT = 0;

  function loadHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    return hlsP || (hlsP = loadScript(HLS_JS).then(function () { return window.Hls; }, function (e) { hlsP = null; throw e; }));
  }

  function liveFail(msg) {
    liveLoading = false;
    if (cur().live && S.playing) {
      S.playing = false;
      render();
      toast(msg);
    }
  }

  function playAu() {
    // Jump back to the live edge after a long pause.
    try {
      if (au.seekable && au.seekable.length) {
        var edge = au.seekable.end(au.seekable.length - 1);
        if (edge - au.currentTime > 20) au.currentTime = edge - 3;
      }
    } catch (e) {}
    var p = au.play();
    if (p && p.catch) {
      p.catch(function (err) {
        if (cur().live && S.playing) {
          S.playing = false;
          render();
          toast(err && err.name === "NotAllowedError" ? "Tap play to start the radio" : "Couldn't reach the radio stream · try again");
        }
      });
    }
  }

  function startLive() {
    if (liveReady) { playAu(); return; }
    if (liveLoading) return;
    liveLoading = true;

    if (nativeHls) {
      au.src = LIVE_STREAM;
      liveReady = true;
      liveLoading = false;
      playAu();
      return;
    }

    loadHls().then(function (Hls) {
      if (!Hls || !Hls.isSupported()) { liveFail("This browser can't play the live stream"); return; }
      hls = new Hls({ lowLatencyMode: false });
      hls.on(Hls.Events.ERROR, function (_, d) {
        if (!d.fatal) return;
        if (d.type === Hls.ErrorTypes.NETWORK_ERROR) { hls.startLoad(); return; }
        try { hls.destroy(); } catch (e) {}
        hls = null;
        liveReady = false;
        liveFail("Live stream interrupted · tap play to retry");
      });
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        liveReady = true;
        liveLoading = false;
        if (cur().live && S.playing) playAu();
      });
      hls.loadSource(LIVE_STREAM);
      hls.attachMedia(au);
    }, function () {
      liveFail("Couldn't load the live player · check your connection");
    });
  }

  function pauseAu() {
    if (!au.paused) {
      auCmdT = Date.now();
      au.pause();
    }
  }

  // Paused from outside our buttons (a call, the OS, headphones).
  au.addEventListener("pause", function () {
    if (Date.now() - auCmdT > 600 && cur().live && S.playing) {
      S.playing = false;
      render();
    }
  });

  /* ---------- Playlist songs (hidden YouTube player) ---------- */

  var yt = null, ytP = null, ytReady = false, ytLoading = false, ytId = null, ytCmdT = 0, ytWatchT = null, ytEndedFor = null;

  function loadYtApi() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    return ytP || (ytP = new Promise(function (res, rej) {
      var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (prev) { try { prev(); } catch (e) {} }
        res(window.YT);
      };
      loadScript("https://www.youtube.com/iframe_api").catch(function () { ytP = null; rej(); });
    }));
  }

  function makeYt() {
    if (yt || ytLoading) return;
    ytLoading = true;
    loadYtApi().then(function (YT) {
      var holder = document.createElement("div");
      $("ytHidden").appendChild(holder);
      yt = new YT.Player(holder, {
        width: 200,
        height: 113,
        host: "https://www.youtube-nocookie.com",
        playerVars: { playsinline: 1, controls: 0, rel: 0, fs: 0, disablekb: 1, modestbranding: 1, origin: location.origin },
        events: {
          onReady: function () {
            ytReady = true;
            ytLoading = false;
            applyMute();
            sync();
          },
          onStateChange: function (e) { onYtState(e.data); },
          onError: function () {
            if (!cur().yt) return;
            S.playing = false;
            S.ytBuf = false;
            render();
            toast("This song can't play here · open it on YouTube");
          }
        }
      });
    }, function () {
      ytLoading = false;
      if (cur().yt && S.playing) {
        S.playing = false;
        render();
        toast("Couldn't load YouTube · check your connection");
      }
    });
  }

  function ytState() {
    try { return yt.getPlayerState(); } catch (e) { return -2; }
  }

  // If the browser blocks the start, show the play button again instead of a stuck pause button.
  function watchYt(n) {
    clearTimeout(ytWatchT);
    ytWatchT = setTimeout(function () {
      if (!S.playing || !cur().yt) return;
      var st = ytState();
      if (st === 1) return;
      if ((st === 3 || st === -1) && n < 3) { watchYt(n + 1); return; }
      S.playing = false;
      S.ytBuf = false;
      render();
      toast("Tap play to start the song");
    }, 8000);
  }

  function driveYt() {
    var t = cur();
    if (!ytReady) {
      if (t.yt && S.playing) makeYt();
      return;
    }
    var st = ytState();
    if (!t.yt) {
      if (st === 1 || st === 3) { ytCmdT = Date.now(); try { yt.pauseVideo(); } catch (e) {} }
      return;
    }
    if (ytId !== t.yt) {
      ytId = t.yt;
      ytEndedFor = null;
      ytCmdT = Date.now();
      S.ytDur = 0;
      try {
        if (S.playing) { S.ytBuf = true; yt.loadVideoById(t.yt); watchYt(0); }
        else yt.cueVideoById(t.yt);
      } catch (e) {}
      return;
    }
    if (S.playing && st !== 1 && st !== 3) {
      ytCmdT = Date.now();
      try { yt.playVideo(); } catch (e) {}
      watchYt(0);
    } else if (!S.playing && (st === 1 || st === 3)) {
      ytCmdT = Date.now();
      try { yt.pauseVideo(); } catch (e) {}
    }
  }

  function onYtState(st) {
    if (!cur().yt) return;
    if (st === 1) {
      clearTimeout(ytWatchT);
      try { var d = yt.getDuration(); if (d) S.ytDur = d; } catch (e) {}
      S.ytBuf = false;
      S.playing = true;
      render();
    } else if (st === 3) {
      if (S.playing && !S.ytBuf) { S.ytBuf = true; renderProgress(); }
    } else if (st === 2) {
      if (S.playing && Date.now() - ytCmdT > 1500) { S.playing = false; render(); }
    } else if (st === 0) {
      if (ytEndedFor === ytId) return;
      ytEndedFor = ytId;
      if (S.repeat) {
        ytEndedFor = null;
        ytCmdT = Date.now();
        try { yt.seekTo(0, true); yt.playVideo(); } catch (e) {}
      } else {
        step(1);
      }
    }
  }

  var scrubbing = false;

  function ytPoll() {
    if (!ytReady || !S.playing || scrubbing || !cur().yt || ytId !== cur().yt) return;
    try {
      var c = yt.getCurrentTime();
      if (c >= 0 && Math.floor(c) !== Math.floor(S.progress)) {
        S.progress = c;
        renderProgress();
      }
    } catch (e) {}
  }

  /* ---------- Playback control ---------- */

  function applyMute() {
    au.muted = S.muted;
    if (ytReady) { try { if (S.muted) yt.mute(); else yt.unMute(); } catch (e) {} }
    if (dhakEl) dhakEl.muted = S.muted;
    if (acGain) acGain.gain.value = S.muted ? 0 : 0.7;
  }

  function updateMediaSession() {
    try {
      var ms = navigator.mediaSession;
      if (!ms || !window.MediaMetadata) return;
      var t = cur();
      ms.metadata = new MediaMetadata({
        title: t.title,
        artist: t.live ? "Akashvani FM Rainbow Kolkata" : t.artist,
        album: "Agomoni by GBA",
        artwork: [{ src: "images/logo.png", type: "image/png" }]
      });
      ms.playbackState = S.playing ? "playing" : "paused";
    } catch (e) {}
  }

  function sync() {
    var t = cur();
    if (t.live) {
      driveYt();
      if (S.playing) startLive();
      else pauseAu();
    } else {
      pauseAu();
      driveYt();
    }
    applyMute();
    updateMediaSession();
  }

  function pick(id) {
    var t = byId(id);
    S.trackId = id;
    S.progress = 0;
    S.ytDur = 0;
    S.playing = true;
    sync();
    render();
    if (!t.live) toast("Now playing · " + t.title);
  }

  function step(dir) {
    var q = TRACKS[tabOf(S.trackId)];
    var i = -1;
    for (var k = 0; k < q.length; k++) if (q[k].id === S.trackId) i = k;
    var next;
    if (S.shuffle && q.length > 1) {
      do { next = q[Math.floor(Math.random() * q.length)]; } while (next.id === S.trackId);
    } else {
      next = q[(i + dir + q.length) % q.length];
    }
    S.trackId = next.id;
    S.progress = 0;
    S.ytDur = 0;
    sync();
    render();
  }

  function togglePlay() {
    S.playing = !S.playing;
    sync();
    render();
  }

  function seekTo(f) {
    var t = cur();
    if (t.live) return;
    var dur = S.ytDur || t.dur;
    if (!dur) return;
    var p = Math.max(0, Math.min(1, f)) * dur;
    S.progress = p;
    if (ytReady && t.yt && ytId === t.yt) {
      ytCmdT = Date.now();
      try { yt.seekTo(p, true); } catch (e) {}
    }
    renderProgress();
  }

  /* ---------- Dhak ---------- */

  var dhakEl = null, dhakWant = false, dhakFileBad = false;
  var ac = null, acGain = null, noiseBuf = null, synthIv = null, nextBar = 0;
  var STEP = 0.12, PATTERN = "dttdtdttdtttdtdt", BAR_LEN = 16 * STEP;

  function thump(t, f) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f * 2, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.09);
    g.gain.setValueAtTime(1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    o.connect(g);
    g.connect(acGain);
    o.start(t);
    o.stop(t + 0.4);
  }

  function tak(t, a) {
    var s = ac.createBufferSource(), g = ac.createGain(), bp = ac.createBiquadFilter();
    s.buffer = noiseBuf;
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    g.gain.setValueAtTime(a, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    s.connect(bp);
    bp.connect(g);
    g.connect(acGain);
    s.start(t);
    s.stop(t + 0.12);
  }

  function scheduleBar(t0) {
    for (var i = 0; i < 16; i++) {
      var t = t0 + i * STEP;
      if (PATTERN.charAt(i) === "d") { thump(t, 70); tak(t, 0.5); }
      else tak(t, 0.28);
    }
  }

  function startSynth() {
    if (synthIv || !dhakWant) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ac = new AC();
      if (ac.state === "suspended") ac.resume();
      acGain = ac.createGain();
      acGain.gain.value = S.muted ? 0 : 0.7;
      acGain.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.12), ac.sampleRate);
      var nd = noiseBuf.getChannelData(0);
      for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      nextBar = ac.currentTime + 0.05;
      var fill = function () {
        if (!ac) return;
        while (nextBar < ac.currentTime + 1.5) { scheduleBar(nextBar); nextBar += BAR_LEN; }
      };
      fill();
      synthIv = setInterval(fill, 400);
    } catch (e) {}
  }

  function stopSynth() {
    clearInterval(synthIv);
    synthIv = null;
    if (ac) { try { ac.close(); } catch (e) {} }
    ac = null;
    acGain = null;
  }

  function startDhak() {
    dhakWant = true;
    if (dhakFileBad) { startSynth(); return; }
    try {
      if (!dhakEl) {
        dhakEl = new Audio(DHAK_AUDIO);
        dhakEl.loop = true;
        dhakEl.preload = "auto";
        dhakEl.addEventListener("error", function () {
          dhakFileBad = true;
          if (dhakWant) startSynth();
        });
      }
      dhakEl.muted = S.muted;
      dhakEl.volume = 0.8;
      var p = dhakEl.play();
      if (p && p.then) {
        p.then(function () {
          if (!dhakWant) dhakEl.pause();
        }, function (err) {
          if (!dhakWant) return;
          if (err && err.name === "NotAllowedError") {
            dhakWant = false;
            S.dhak = false;
            renderChips();
            toast("Tap Dhak again to start the sound");
          } else {
            dhakFileBad = true;
            startSynth();
          }
        });
      }
    } catch (e) {
      dhakFileBad = true;
      startSynth();
    }
  }

  function stopDhak() {
    dhakWant = false;
    if (dhakEl) {
      try { dhakEl.pause(); dhakEl.currentTime = 0; } catch (e) {}
    }
    stopSynth();
  }

  /* ---------- Reminder ---------- */

  var remT = null;

  function armReminder() {
    clearTimeout(remT);
    var ms = MAHALAYA - now();
    if (ms <= 0 || ms > 2147483000) return;
    remT = setTimeout(function () {
      toast("Mahishasuramardini is on air now");
      try {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Mahishasuramardini is on air", {
            body: "Akashvani FM Rainbow Kolkata · 4:00 AM IST · Agomoni by GBA",
            icon: "images/logo.png"
          });
        }
      } catch (e) {}
    }, ms);
  }

  function setReminder(on) {
    S.reminded = on;
    save({ reminded: on });
    render();
    if (!on) {
      clearTimeout(remT);
      toast("Reminder removed");
      return;
    }
    if (!("Notification" in window)) {
      armReminder();
      toast("Reminder set for 4:00 AM IST · keep this tab open");
      return;
    }
    var called = false;
    var done = function (perm) {
      if (called) return;
      called = true;
      armReminder();
      if (perm === "granted") toast("We'll remind you at 4:00 AM IST · keep this tab open");
      else toast("Notifications are blocked · you'll only see the reminder on this page");
    };
    if (Notification.permission === "granted") { done("granted"); return; }
    try {
      var r = Notification.requestPermission(done);
      if (r && r.then) r.then(done, function () { done("denied"); });
    } catch (e) { done("denied"); }
  }

  function remindAction() {
    var ph = phase();
    if (ph === "live") {
      S.trackId = "live";
      S.playing = true;
      sync();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (ph === "after") return;
    setReminder(!S.reminded);
  }

  /* ---------- Share + copy ---------- */

  function copyText(text, msg) {
    var ok = function () { toast(msg); };
    var fallback = function () {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        ok();
      } catch (e) {
        toast("Couldn't copy · please copy it manually");
      }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  function share() {
    var url = location.href.split("?")[0].split("#")[0];
    var data = {
      title: "Agomoni by GBA · Durga Puja Radio",
      text: "Mahalaya live at 4:00 AM IST, Pujo songs and the countdown to Durga Puja, from Gurgaon Bengalee Association.",
      url: url
    };
    if (navigator.share) {
      navigator.share(data).catch(function (e) {
        if (!e || e.name !== "AbortError") copyText(url, "Link copied");
      });
      return;
    }
    copyText(url, "Link copied · share the dawn");
  }

  /* ---------- Rendering ---------- */

  function setCover(el, kind) {
    el.className = "radio-cover k-" + kind;
    el.innerHTML = '<i class="bi ' + ICON[kind] + '"></i>';
  }

  function renderProgress() {
    var t = cur(), bar = $("rpBar"), fill = $("rpFill");
    if (t.live) {
      bar.classList.add("is-live");
      fill.style.width = "100%";
      $("rpLeft").textContent = S.playing ? "Listening live" : "On air";
      $("rpRight").textContent = "LIVE";
      bar.setAttribute("aria-valuenow", "100");
      bar.setAttribute("aria-valuetext", "Live");
      bar.setAttribute("aria-disabled", "true");
      return;
    }
    var dur = S.ytDur || t.dur || 1;
    var pct = Math.min(100, S.progress / dur * 100);
    bar.classList.remove("is-live");
    fill.style.width = pct + "%";
    $("rpLeft").textContent = S.playing && S.ytBuf ? "Loading…" : mmss(S.progress);
    $("rpRight").textContent = mmss(dur);
    bar.setAttribute("aria-valuenow", String(Math.round(pct)));
    bar.setAttribute("aria-valuetext", mmss(S.progress) + " of " + mmss(dur));
    bar.setAttribute("aria-disabled", "false");
  }

  function renderPlayer() {
    var t = cur(), ph = phase();
    setCover($("rpCover"), t.kind);
    $("rpTitle").textContent = t.title;
    $("rpLive").hidden = !t.live;
    $("rpArtist").textContent = t.live
      ? (ph === "live" ? "On air now · Mahishasuramardini" : "Akashvani FM Rainbow Kolkata · live stream")
      : t.artist;
    $("rpExt").hidden = !t.yt;
    if (t.yt) $("rpYt").href = "https://music.youtube.com/watch?v=" + t.yt;

    $("rpPlayIcon").className = "bi " + (S.playing ? "bi-pause-fill" : "bi-play-fill");
    $("rpPlay").setAttribute("aria-label", S.playing ? "Pause" : "Play");

    $("rpShuffle").classList.toggle("is-on", S.shuffle);
    $("rpShuffle").setAttribute("aria-pressed", String(S.shuffle));
    $("rpRepeat").classList.toggle("is-on", S.repeat);
    $("rpRepeat").setAttribute("aria-pressed", String(S.repeat));
    $("rpMute").classList.toggle("is-on", S.muted);
    $("rpMute").setAttribute("aria-pressed", String(S.muted));
    $("rpMuteIcon").className = "bi " + (S.muted ? "bi-volume-mute-fill" : "bi-volume-up-fill");

    renderProgress();
  }

  function renderChips() {
    var ph = phase();

    $("chipDhak").classList.toggle("is-on", S.dhak);
    $("chipDhak").setAttribute("aria-pressed", String(S.dhak));

    var chip = $("chipRemind"), btn = $("remindBtn");
    chip.hidden = ph === "after";
    btn.disabled = ph === "after";
    btn.classList.toggle("is-set", ph === "before" && S.reminded);

    if (ph === "live") {
      chip.classList.add("is-on");
      $("chipRemindIcon").className = "bi bi-broadcast";
      $("chipRemindText").textContent = "Listen live";
      btn.textContent = "Listen live now";
    } else if (ph === "before" && S.reminded) {
      chip.classList.add("is-on");
      $("chipRemindIcon").className = "bi bi-bell-fill";
      $("chipRemindText").textContent = "Reminder set";
      btn.textContent = "Reminder set · 4:00 AM IST";
    } else if (ph === "before") {
      chip.classList.remove("is-on");
      $("chipRemindIcon").className = "bi bi-bell";
      $("chipRemindText").textContent = "Remind me";
      btn.textContent = "Remind me at 4:00 AM IST";
    } else {
      chip.classList.remove("is-on");
      btn.textContent = "Mahalaya 2026 has passed";
    }
    chip.setAttribute("aria-pressed", String(ph === "before" && S.reminded));
  }

  function renderTabs() {
    $("radioTabs").innerHTML = TABS.map(function (t) {
      var on = t.id === S.tab;
      return '<button type="button" role="tab" class="radio-tab' + (on ? " is-active" : "") + '" data-tab="' + t.id +
        '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '">' + esc(t.label) + "</button>";
    }).join("");
  }

  function renderList() {
    var rows = TRACKS[S.tab].filter(function (t) { return !t.hidden; });
    $("radioList").innerHTML = rows.map(function (t, i) {
      return '<button type="button" class="radio-row" data-id="' + t.id + '">' +
        '<span class="radio-row-num" data-num="' + (i + 1) + '">' + (i + 1) + "</span>" +
        '<span class="radio-cover k-' + t.kind + '" aria-hidden="true"><i class="bi ' + ICON[t.kind] + '"></i></span>' +
        '<span class="radio-row-text"><span class="radio-row-title">' + esc(t.title) + '</span>' +
        '<span class="radio-row-artist">' + esc(t.artist) + "</span></span>" +
        '<span class="radio-row-dur">' + mmss(t.dur) + "</span></button>";
    }).join("");
    markCurrent();
  }

  function markCurrent() {
    var rows = $("radioList").querySelectorAll(".radio-row");
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i], isCur = r.getAttribute("data-id") === S.trackId, num = r.querySelector(".radio-row-num");
      r.classList.toggle("is-current", isCur);
      if (isCur) r.setAttribute("aria-current", "true");
      else r.removeAttribute("aria-current");
      num.innerHTML = isCur
        ? '<span class="radio-eq' + (S.playing ? " is-playing" : "") + '" aria-hidden="true"><i></i><i></i><i></i></span>'
        : num.getAttribute("data-num");
    }
  }

  var dateEls = [];

  function renderDates() {
    $("radioDates").innerHTML = DATES.map(function (d, i) {
      var a = istDay(Date.parse(d.from + "T00:00:00+05:30"));
      var label = a.weekday + " " + a.day + " " + a.month;
      if (d.to) {
        var b = istDay(Date.parse(d.to + "T00:00:00+05:30"));
        label = a.weekday + " " + a.day + " – " + b.weekday + " " + b.day + " " + b.month;
      }
      return '<div class="radio-date' + (d.hi ? " is-hi" : "") + '" data-i="' + i + '">' +
        '<div><span class="radio-date-bn" lang="bn">' + d.bn + '</span><span class="radio-date-en">' + esc(d.en) + "</span></div>" +
        '<div class="radio-date-when"><div class="radio-date-day">' + label + '</div><div class="radio-date-rel"></div></div></div>';
    }).join("");
    dateEls = Array.prototype.slice.call($("radioDates").querySelectorAll(".radio-date"));
    renderDateRel();
  }

  function renderDateRel() {
    var today = dayIST(now());
    dateEls.forEach(function (el, i) {
      var d = DATES[i];
      var start = dayIST(Date.parse(d.from + "T00:00:00+05:30"));
      var end = d.to ? dayIST(Date.parse(d.to + "T00:00:00+05:30")) : start;
      var txt, past = false, isToday = false;
      if (today > end) { txt = "Done"; past = true; }
      else if (today >= start) { txt = d.hi ? "Today · 4:00 AM IST" : "Today"; isToday = true; }
      else {
        var n = start - today;
        txt = n === 1 ? "Tomorrow" : "in " + n + " days";
      }
      el.classList.toggle("is-past", past);
      el.classList.toggle("is-today", isToday);
      el.querySelector(".radio-date-rel").textContent = txt;
    });
  }

  function cd(p, secs) {
    return (p.d ? p.d + "d " : "") + p.h + "h " + pad(p.m) + "m" + (secs ? " " + pad(p.s) + "s" : "");
  }

  function setTiles(p) {
    $("rcDays").textContent = pad(p.d);
    $("rcHours").textContent = pad(p.h);
    $("rcMinutes").textContent = pad(p.m);
    $("rcSeconds").textContent = pad(p.s);
  }

  function renderStatus() {
    var t = now(), ph = phase(), dot = $("radioStatusDot"), txt, cap;

    dot.classList.toggle("is-live", ph === "live");

    if (ph === "before") {
      txt = "Mahalaya goes live in " + cd(parts(MAHALAYA - t), true);
      setTiles(parts(MAHALAYA - t));
      cap = "Until Mahalaya begins · 4:00 AM IST";
    } else if (ph === "live") {
      txt = "On air now · Mahishasuramardini";
      setTiles(parts(BROADCAST_END - t));
      cap = "Mahishasuramardini is on air · time left in the broadcast";
    } else if (t < PUJA_START) {
      txt = "Mahalaya has ended · Durga Puja begins in " + cd(parts(PUJA_START - t), false);
      setTiles(parts(PUJA_START - t));
      cap = "Until GBA's Durga Puja begins · Maha Panchami";
    } else if (t <= PUJA_END) {
      txt = "Durga Puja is on · HUDA Community Center, Sector 9";
      setTiles(parts(PUJA_END - t));
      cap = "Until the celebrations end · Vijaya Dashami";
    } else {
      txt = "Shubho Bijoya · see you next year";
      setTiles(parts(0));
      cap = "Durga Puja 2026 has concluded";
    }

    $("radioStatusText").textContent = txt;
    $("rcCaption").textContent = cap;

    var showLocal = !!LOCAL_WHEN && ph !== "after";
    $("radioLocal").hidden = !showLocal;
    $("schedLocal").hidden = !showLocal;
    if (showLocal) {
      $("radioLocal").textContent = "Your time: " + LOCAL_WHEN;
      $("schedLocal").textContent = "Your time: " + LOCAL_WHEN;
    }
  }

  function render() {
    renderPlayer();
    renderChips();
    markCurrent();
    updateMediaSession();
  }

  /* ---------- Tick ---------- */

  var lastPhase = null, lastDay = null;

  function tick() {
    var ph = phase();
    if (lastPhase !== null && ph !== lastPhase) {
      if (lastPhase === "before" && ph === "live" && S.autoStart) {
        S.trackId = "live";
        S.playing = true;
        sync();
        toast("On air now · Mahishasuramardini");
      }
      render();
    }
    lastPhase = ph;

    var day = dayIST(now());
    if (day !== lastDay) { lastDay = day; renderDateRel(); }

    renderStatus();
  }

  /* ---------- Wiring ---------- */

  function init() {
    if (!$("rpPlay")) return;

    renderTabs();
    renderList();
    renderDates();
    render();
    tick();

    $("autoStart").checked = S.autoStart;

    $("rpPlay").addEventListener("click", togglePlay);

    $("rpPrev").addEventListener("click", function () {
      if (!cur().live && S.progress > 3) seekTo(0);
      else step(-1);
    });

    $("rpNext").addEventListener("click", function () { step(1); });

    $("rpShuffle").addEventListener("click", function () { S.shuffle = !S.shuffle; render(); });

    $("rpRepeat").addEventListener("click", function () { S.repeat = !S.repeat; render(); });

    $("rpMute").addEventListener("click", function () {
      S.muted = !S.muted;
      applyMute();
      render();
    });

    $("rpBack").addEventListener("click", function () { pick("live"); });

    var bar = $("rpBar");
    var frac = function (e) {
      var r = bar.getBoundingClientRect();
      return (e.clientX - r.left) / r.width;
    };
    bar.addEventListener("pointerdown", function (e) {
      if (cur().live) return;
      try { bar.setPointerCapture(e.pointerId); } catch (er) {}
      scrubbing = true;
      seekTo(frac(e));
    });
    bar.addEventListener("pointermove", function (e) { if (scrubbing) seekTo(frac(e)); });
    var endScrub = function () { scrubbing = false; };
    bar.addEventListener("pointerup", endScrub);
    bar.addEventListener("pointercancel", endScrub);
    bar.addEventListener("keydown", function (e) {
      var t = cur(), dur = S.ytDur || t.dur;
      if (t.live || !dur) return;
      var d = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0;
      if (!d) return;
      e.preventDefault();
      seekTo((S.progress + d) / dur);
    });

    $("chipDhak").addEventListener("click", function () {
      S.dhak = !dhakWant;
      if (S.dhak) startDhak();
      else stopDhak();
      renderChips();
      toast(S.dhak ? "Dhak on" : "Dhak off");
    });

    $("chipRemind").addEventListener("click", remindAction);
    $("remindBtn").addEventListener("click", remindAction);

    $("chipShare").addEventListener("click", share);

    $("autoStart").addEventListener("change", function () {
      S.autoStart = this.checked;
      save({ autoStart: S.autoStart });
      toast(S.autoStart ? "The radio will start at 4:00 AM IST · keep this tab open" : "Auto-start off");
    });

    $("copyUpi").addEventListener("click", function () {
      copyText($("upiId").textContent, "UPI ID copied");
    });

    $("radioTabs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]");
      if (!b) return;
      S.tab = b.getAttribute("data-tab");
      renderTabs();
      renderList();
      $("radioList").scrollTop = 0;
    });

    $("radioTabs").addEventListener("keydown", function (e) {
      var k = e.key;
      if (k !== "ArrowRight" && k !== "ArrowLeft") return;
      e.preventDefault();
      var i = 0;
      for (var j = 0; j < TABS.length; j++) if (TABS[j].id === S.tab) i = j;
      i = (i + (k === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
      S.tab = TABS[i].id;
      renderTabs();
      renderList();
      $("radioList").scrollTop = 0;
      var active = $("radioTabs").querySelector(".is-active");
      if (active) active.focus();
    });

    $("radioList").addEventListener("click", function (e) {
      var b = e.target.closest("[data-id]");
      if (b) pick(b.getAttribute("data-id"));
    });

    try {
      var ms = navigator.mediaSession;
      if (ms) {
        ms.setActionHandler("play", function () { if (!S.playing) togglePlay(); });
        ms.setActionHandler("pause", function () { if (S.playing) togglePlay(); });
        ms.setActionHandler("previoustrack", function () { step(-1); });
        ms.setActionHandler("nexttrack", function () { step(1); });
      }
    } catch (e) {}

    if (S.reminded && phase() === "before") armReminder();

    // Warm up the players so the first tap starts quickly.
    if (!nativeHls) setTimeout(function () { loadHls().catch(function () {}); }, 1500);
    setTimeout(makeYt, 4000);

    setInterval(tick, 1000);
    setInterval(ytPoll, 500);

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) tick();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
