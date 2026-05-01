import { useReveal } from '../hooks/useReveal';

const ZAGS_ADDR =
  '%D0%A3%D1%81%D0%BE%D0%BB%D1%8C%D0%B5-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA%D0%BE%D0%B5%2C%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%20%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D1%85%20%D0%9F%D0%B0%D1%80%D1%82%D0%B8%D0%B7%D0%B0%D0%BD%2C%2057%D0%B0';
const BANKET_ADDR =
  '%D0%98%D1%80%D0%BA%D1%83%D1%82%D1%81%D0%BA%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%9B%D0%B5%D0%BD%D0%B8%D0%BD%D0%B0%2C%2046';

const VENUES = [
  {
    time: '14:10',
    name: 'Регистрация брака',
    address: ['г. Усолье-Сибирское,', 'проспект Красных Партизан, 57а'],
    encoded: ZAGS_ADDR,
    title: 'Карта: ЗАГС',
  },
  {
    time: '16:30',
    name: 'Банкет',
    address: ['г. Иркутск,', 'улица Ленина, 46'],
    encoded: BANKET_ADDR,
    title: 'Карта: банкет',
  },
];

export default function Venues() {
  const headerRef = useReveal<HTMLDivElement>({ childSelector: '.section__head > *' });
  const listRef = useReveal<HTMLDivElement>({ childSelector: '.venue', stagger: 0.18 });

  return (
    <section className="section section--venues" id="venues">
      <div className="section__head" ref={headerRef}>
        <p className="section__kicker">Где нас ждать</p>
        <h2 className="section__title">Места проведения</h2>
      </div>

      <div ref={listRef}>
        {VENUES.map((v) => (
          <article className="venue" key={v.name}>
            <header className="venue__header">
              <p className="venue__time">{v.time}</p>
              <h3 className="venue__name">{v.name}</h3>
              <p className="venue__address">
                {v.address[0]}
                <br />
                {v.address[1]}
              </p>
            </header>
            <div className="venue__map-wrap">
              <iframe
                className="venue__map"
                src={`https://yandex.ru/map-widget/v1/?text=${v.encoded}&z=17`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title={v.title}
              />
            </div>
            <a
              className="btn"
              href={`https://yandex.ru/maps/?rtext=~${v.encoded}&rtt=auto`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Построить маршрут
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
