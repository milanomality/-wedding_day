import { useReveal } from '../hooks/useReveal';

const PALETTE = [
  { color: '#b8d2b3', name: 'Зелёный' },
  { color: '#bcd4e0', name: 'Голубой' },
  { color: '#e6d3a3', name: 'Песочный' },
  { color: '#e8dcc4', name: 'Бежевый' },
  { color: '#f5c9a8', name: 'Персиковый' },
];

export default function DressCode() {
  const headerRef = useReveal<HTMLDivElement>({ childSelector: '.section__head > *' });
  const paletteRef = useReveal<HTMLDivElement>({ childSelector: '.palette__chip', stagger: 0.08 });

  return (
    <section className="section section--dress" id="dress">
      <div className="section__head" ref={headerRef}>
        <p className="section__kicker">Несколько слов о стиле</p>
        <h2 className="section__title">Дресс-код</h2>
        <p className="dress__text">
          Будем благодарны, если в ваших нарядах найдётся место пастельным оттенкам —{' '}
          <em>зелёному, голубому, песочному, бежевому и персиковому</em>.
        </p>
      </div>

      <div className="palette" ref={paletteRef}>
        {PALETTE.map((p) => (
          <div className="palette__chip" key={p.name}>
            <span className="palette__circle" style={{ background: p.color }} />
            <span className="palette__caption">{p.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
