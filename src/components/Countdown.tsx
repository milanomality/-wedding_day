import { useEffect, useState } from 'react';

const TARGET = new Date('2026-06-26T14:10:00+08:00').getTime();

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function Countdown() {
  const [done, setDone] = useState(false);
  const [parts, setParts] = useState({ d: '--', h: '--', m: '--', s: '--' });

  useEffect(() => {
    const tick = () => {
      const diff = TARGET - Date.now();
      if (diff <= 0) {
        setDone(true);
        return;
      }
      const sec = Math.floor(diff / 1000);
      setParts({
        d: `${Math.floor(sec / 86400)}`,
        h: pad(Math.floor((sec % 86400) / 3600)),
        m: pad(Math.floor((sec % 3600) / 60)),
        s: pad(sec % 60),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (done) {
    return <div className="countdown countdown--done">Сегодня наш день ✦</div>;
  }

  return (
    <div className="countdown" aria-label="Обратный отсчёт">
      {[
        { v: parts.d, label: 'дней' },
        { v: parts.h, label: 'часов' },
        { v: parts.m, label: 'минут' },
        { v: parts.s, label: 'секунд' },
      ].map((cell) => (
        <div className="countdown__cell" key={cell.label}>
          <span className="countdown__num">{cell.v}</span>
          <span className="countdown__label">{cell.label}</span>
        </div>
      ))}
    </div>
  );
}
