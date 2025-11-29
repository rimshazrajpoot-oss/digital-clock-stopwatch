(function initClock() {
  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');

  function pad(n, width=2) {
    return String(n).padStart(width, '0');
  }

  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;

    timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dateStr = `${dayName}, ${monthName} ${now.getDate()}, ${now.getFullYear()}`;
    dateEl.textContent = dateStr;
  }

  updateClock();
  setInterval(updateClock, 1000);
})();

(function themeToggle() {
  const btn = document.getElementById('themeToggle');
  const body = document.body;

  btn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    btn.textContent = isLight ? '☀️' : '🌙';
  });
})();

(function stopwatch() {
  const swTimeEl = document.getElementById('swTime');
  const btnStart = document.getElementById('swStart');
  const btnStop = document.getElementById('swStop');
  const btnReset = document.getElementById('swReset');
  const btnLap = document.getElementById('swLap');
  const lapsList = document.getElementById('lapsList');

  let startTime = 0;      
  let elapsed = 0;        
  let timerInterval = null;
  let lapCounter = 0;

  function formatTime(ms) {
    const totalMilliseconds = ms;
    const msPart = totalMilliseconds % 1000;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(msPart).padStart(3,'0')}`;
  }

  function updateDisplay() {
    const now = Date.now();
    const diff = elapsed + (startTime ? (now - startTime) : 0);
    swTimeEl.textContent = formatTime(diff);
  }

  function start() {
    if (!timerInterval) {
      startTime = Date.now();
      timerInterval = setInterval(updateDisplay, 16); 
      btnStart.textContent = 'Running';
      btnStart.disabled = true;
      btnStop.disabled = false;
      btnReset.disabled = false;
      btnLap.disabled = false;
    }
  }

  function stop() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      elapsed += Date.now() - startTime;
      startTime = 0;
      btnStart.textContent = 'Start';
      btnStart.disabled = false;
      btnStop.disabled = true;
      btnLap.disabled = true;
    }
  }

  function reset() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    startTime = 0;
    elapsed = 0;
    swTimeEl.textContent = '00:00:00.000';
    btnStart.disabled = false;
    btnStop.disabled = true;
    btnLap.disabled = true;
    btnReset.disabled = true;
    lapsList.innerHTML = '';
    lapCounter = 0;
  }

  function lap() {
    const now = Date.now();
    const diff = elapsed + (startTime ? (now - startTime) : 0);
    lapCounter += 1;
    const li = document.createElement('li');
    li.textContent = `Lap ${lapCounter}: ${formatTime(diff)}`;
    lapsList.prepend(li);
  }

  btnStart.addEventListener('click', start);
  btnStop.addEventListener('click', stop);
  btnReset.addEventListener('click', reset);
  btnLap.addEventListener('click', lap);

  reset();
})();
