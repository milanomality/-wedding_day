(function () {
  'use strict';

  // Дата свадьбы: 26 июня 2026, 14:10 по иркутскому времени (UTC+8)
  var TARGET = new Date('2026-06-26T14:10:00+08:00').getTime();

  // ───── Countdown ─────
  var cd = document.getElementById('countdown');
  if (cd) {
    var elDays = cd.querySelector('[data-days]');
    var elHours = cd.querySelector('[data-hours]');
    var elMinutes = cd.querySelector('[data-minutes]');
    var elSeconds = cd.querySelector('[data-seconds]');

    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };

    var tick = function () {
      var diff = TARGET - Date.now();
      if (diff <= 0) {
        cd.classList.add('countdown--done');
        cd.innerHTML = 'Сегодня наш день ✦';
        clearInterval(timer);
        return;
      }
      var sec = Math.floor(diff / 1000);
      var d = Math.floor(sec / 86400);
      var h = Math.floor((sec % 86400) / 3600);
      var m = Math.floor((sec % 3600) / 60);
      var s = sec % 60;
      elDays.textContent = d;
      elHours.textContent = pad(h);
      elMinutes.textContent = pad(m);
      elSeconds.textContent = pad(s);
    };

    tick();
    var timer = setInterval(tick, 1000);
  }

  // ───── Smooth scroll для якорей ─────
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ───── Reveal on scroll ─────
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ───── RSVP ─────
  var form = document.getElementById('rsvp-form');
  var okBox = document.getElementById('rsvp-success');
  var errBox = document.getElementById('rsvp-error');

  if (form) {
    var endpoint = form.getAttribute('action') || '';
    var configured = endpoint.indexOf('REPLACE_ME') === -1;

    if (!configured) {
      console.warn('[RSVP] Formspree endpoint не настроен. Замените REPLACE_ME в action формы на ваш ID с formspree.io.');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      okBox.hidden = true;
      errBox.hidden = true;

      if (!configured) {
        errBox.querySelector('p').textContent = 'Форма пока не подключена. Свяжитесь с нами напрямую.';
        errBox.hidden = false;
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Отправляем…';

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            form.style.display = 'none';
            okBox.hidden = false;
            okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            return res.json().then(function (data) {
              throw new Error((data && data.error) || 'Ошибка отправки');
            }).catch(function () { throw new Error('Ошибка отправки'); });
          }
        })
        .catch(function () {
          errBox.hidden = false;
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }
})();
