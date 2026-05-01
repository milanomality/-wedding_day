import { FormEvent, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const ENDPOINT = 'https://formspree.io/f/mqenaezy';
const DRINKS = [
  'Красное сухое',
  'Красное полусладкое',
  'Белое сухое',
  'Белое полусладкое',
  'Шампанское',
  'Водка',
  'Коньяк',
  'Пиво',
  'Самогон',
  'Б/А',
];

type Status = 'idle' | 'sending' | 'ok' | 'error' | 'unconfigured';

export default function Rsvp() {
  const headerRef = useReveal<HTMLDivElement>({ childSelector: '.section__head > *' });
  const formRef = useReveal<HTMLFormElement>();
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (ENDPOINT.includes('REPLACE_ME')) {
      setStatus('unconfigured');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (res.ok) {
        form.reset();
        setStatus('ok');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="section section--rsvp" id="rsvp">
      <div className="section__head" ref={headerRef}>
        <p className="section__kicker">Один маленький шаг</p>
        <h2 className="section__title">Подтверждение присутствия</h2>
        <p className="section__lead">
          Дайте знать, ждать ли вас рядом 26 июня. Это поможет всё спланировать.
        </p>
      </div>

      {status !== 'ok' && (
        <form className="rsvp-form" onSubmit={onSubmit} noValidate ref={formRef}>
          <label className="field">
            <span className="field__label">Имя и фамилия</span>
            <input className="field__input" type="text" name="name" required autoComplete="name" />
          </label>

          <label className="field">
            <span className="field__label">Телефон</span>
            <input
              className="field__input"
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              placeholder="+7 ___ ___ __ __"
            />
          </label>

          <fieldset className="field field--radio">
            <legend className="field__label">Сможете быть с нами?</legend>
            <label className="radio">
              <input type="radio" name="attendance" value="Буду" required />
              <span>С радостью буду</span>
            </label>
            <label className="radio">
              <input type="radio" name="attendance" value="Не смогу" />
              <span>К сожалению, не смогу</span>
            </label>
          </fieldset>

          <label className="field">
            <span className="field__label">Сколько вас будет</span>
            <input
              className="field__input"
              type="number"
              name="guests"
              min={1}
              max={10}
              defaultValue={1}
              required
            />
          </label>

          <fieldset className="field field--checks">
            <legend className="field__label">Что предпочитаете из напитков</legend>
            <p className="field__hint">Можно выбрать несколько — поможет нам подобрать барное меню</p>
            <div className="checks">
              {DRINKS.map((d) => (
                <label className="check" key={d}>
                  <input type="checkbox" name="drinks" value={d} />
                  <span>{d === 'Б/А' ? 'Только б/а' : d}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span className="field__label">Особые пожелания по меню</span>
            <textarea
              className="field__input field__input--area"
              name="menu"
              rows={2}
              placeholder="Аллергии, вегетарианство и т.п."
            />
          </label>

          <label className="field">
            <span className="field__label">Комментарий</span>
            <textarea className="field__input field__input--area" name="comment" rows={2} />
          </label>

          <button className="btn btn--primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Отправляем…' : 'Отправить ответ'}
          </button>
        </form>
      )}

      {status === 'ok' && (
        <div className="rsvp-status rsvp-status--ok">
          <p>Спасибо! Ваш ответ принят ✦</p>
        </div>
      )}
      {status === 'error' && (
        <div className="rsvp-status rsvp-status--err">
          <p>Не удалось отправить. Попробуйте позже или свяжитесь с нами напрямую.</p>
        </div>
      )}
      {status === 'unconfigured' && (
        <div className="rsvp-status rsvp-status--err">
          <p>Форма пока не подключена. Свяжитесь с нами по телефону из раздела «Контакты».</p>
        </div>
      )}
    </section>
  );
}
