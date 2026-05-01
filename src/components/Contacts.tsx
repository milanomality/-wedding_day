import { useReveal } from '../hooks/useReveal';

const CONTACTS = [
  { role: 'Жених', name: 'Ян', tel: '+79246200827', display: '+7 924 620 08 27' },
  { role: 'Невеста', name: 'Алина', tel: '+79914337908', display: '+7 991 433 79 08' },
  { role: 'Организатор', name: 'Алексей Русаков', tel: '+79027600992', display: '+7 902 760 09 92' },
];

const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function Contacts() {
  const headerRef = useReveal<HTMLDivElement>({ childSelector: '.section__head > *' });
  const cardsRef = useReveal<HTMLDivElement>({ childSelector: '.contact', stagger: 0.1 });

  return (
    <section className="section section--contacts" id="contacts">
      <div className="section__head" ref={headerRef}>
        <p className="section__kicker">На связи</p>
        <h2 className="section__title">Контакты</h2>
        <p className="section__lead">
          Если возникнут вопросы — звоните или пишите. Будем рады помочь.
        </p>
      </div>

      <div className="contacts" ref={cardsRef}>
        {CONTACTS.map((c) => (
          <a className="contact" href={`tel:${c.tel}`} key={c.tel}>
            <span className="contact__role">{c.role}</span>
            <span className="contact__name">{c.name}</span>
            <span className="contact__phone">
              <PhoneIcon />
              {c.display}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
