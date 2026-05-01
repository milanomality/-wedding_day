import { useReveal } from '../hooks/useReveal';

const ITEMS = [
  { time: '13:30', text: 'Сбор гостей' },
  { time: '14:10', text: 'Регистрация брака' },
  { time: '14:40', text: 'Лёгкий фуршет' },
  { time: '15:00', text: 'Трансфер' },
  { time: '16:30 — 17:30', text: 'Welcome, встреча гостей' },
  { time: '17:30 — 22:30', text: 'Праздничный ужин и шоу-программа' },
  { time: '22:30 — 00:00', text: 'Дискотека' },
  { time: '00:00', text: 'Трансфер' },
];

export default function Schedule() {
  const headerRef = useReveal<HTMLDivElement>({ childSelector: '.section__head > *' });
  const listRef = useReveal<HTMLOListElement>({ childSelector: '.timeline__item', stagger: 0.1 });

  return (
    <section className="section section--schedule" id="schedule">
      <div className="section__head" ref={headerRef}>
        <p className="section__kicker">26 июня 2026</p>
        <h2 className="section__title">Программа дня</h2>
        <p className="section__lead">
          Чтобы вам было проще спланировать день — собрали ключевые моменты в одно расписание.
        </p>
      </div>

      <ol className="timeline" ref={listRef}>
        {ITEMS.map((item) => (
          <li className="timeline__item" key={item.time + item.text}>
            <span className="timeline__time">{item.time}</span>
            <span className="timeline__text">{item.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
