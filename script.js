/* ============================================
   COUNTDOWN — next occurrence of month/day,
   evaluated against India Standard Time
   ============================================ */
(function () {
  const el = document.getElementById('countdown');
  const month = parseInt(el.dataset.month, 10); // 1-12
  const day = parseInt(el.dataset.day, 10);

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  const arrivedEl = document.getElementById('countdownArrived');
  let timerId = null;

  function nowInIST() {
    // Get current time expressed as IST wall-clock fields
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).formatToParts(new Date());

    const get = (t) => parseInt(parts.find(p => p.type === t).value, 10);
    // Build a UTC timestamp representing that IST wall-clock moment
    return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  }

  function nextBirthdayIST() {
    const ist = nowInIST();
    const istDate = new Date(ist);
    let year = istDate.getUTCFullYear();

    let target = Date.UTC(year, month - 1, day, 0, 0, 0);
    if (target <= ist) {
      target = Date.UTC(year + 1, month - 1, day, 0, 0, 0);
    }
    return target;
  }

  function isBirthdayTodayIST() {
    const istDate = new Date(nowInIST());
    return (istDate.getUTCMonth() + 1) === month && istDate.getUTCDate() === day;
  }

  function showArrived() {
    el.style.display = 'none';
    arrivedEl.style.display = 'block';
    if (timerId) clearInterval(timerId);
  }

  function tick() {
    if (isBirthdayTodayIST()) {
      showArrived();
      return;
    }

    const target = nextBirthdayIST();
    const diff = Math.max(0, target - nowInIST());

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  tick();
  timerId = setInterval(tick, 1000);
})();

/* ============================================
   MUSIC PLAYER
   ============================================ */
(function () {
  const player = document.getElementById('player');
  const toggle = document.getElementById('playerToggle');
  const audio = document.getElementById('audioEl');
  const sub = player.querySelector('.player-sub');
  const iconPlay = toggle.querySelector('.icon-play');
  const iconPause = toggle.querySelector('.icon-pause');

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        sub.textContent = 'add audio/song.mp3';
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    player.classList.add('is-playing');
    sub.textContent = 'playing';
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
  });

  audio.addEventListener('pause', () => {
    player.classList.remove('is-playing');
    sub.textContent = 'tap play';
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
  });
})();

/* ============================================
   GALLERY TABS
   ============================================ */
(function () {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('is-active'));

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelector(`.tab-panel[data-panel="${tab.dataset.tab}"]`).classList.add('is-active');
    });
  });
})();

/* ============================================
   QUOTE CAROUSEL
   ============================================ */
(function () {
  const quotes = [
    "Distance means so little when someone means so much.",
    "I'd rather do long distance with you than be close to anyone else.",
    "The comfort of being loved by you erases the fear of missing you.",
    "You are my favorite notification.",
    "Every countdown ends. This one ends in your arms."
  ];

  const textEl = document.getElementById('quoteText');
  const dotsEl = document.getElementById('quoteDots');
  let i = 0;

  quotes.forEach((_, idx) => {
    const dot = document.createElement('span');
    if (idx === 0) dot.classList.add('is-active');
    dotsEl.appendChild(dot);
  });

  function show(idx) {
    textEl.style.opacity = 0;
    setTimeout(() => {
      textEl.textContent = `"${quotes[idx]}"`;
      textEl.style.opacity = 1;
    }, 400);
    [...dotsEl.children].forEach((d, di) => d.classList.toggle('is-active', di === idx));
  }

  setInterval(() => {
    i = (i + 1) % quotes.length;
    show(i);
  }, 4500);
})();

/* ============================================
   TAP / CLICK HEARTS
   ============================================ */
(function () {
  const layer = document.getElementById('heartLayer');
  const glyphs = ['❤', '💕','💞','🎀', '💗', '💖'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) return;

  function spawnHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'tap-heart';
    heart.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    layer.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }

  document.addEventListener('click', (e) => spawnHeart(e.clientX, e.clientY));
  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (t) spawnHeart(t.clientX, t.clientY);
  }, { passive: true });
})();
