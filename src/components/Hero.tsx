import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroCanvas from './HeroCanvas';
import Countdown from './Countdown';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const titleSpans = contentRef.current!.querySelectorAll<HTMLElement>('.hero__name span');
      const ampEl = contentRef.current!.querySelector('.hero__amp');
      const sub = contentRef.current!.querySelector('.hero__sub');
      const dateRow = contentRef.current!.querySelector('.hero__date-row');
      const countdownEl = contentRef.current!.querySelector('.countdown');
      const scroll = contentRef.current!.querySelector('.hero__scroll');
      const kicker = contentRef.current!.querySelector('.hero__kicker');

      gsap.set(titleSpans, { yPercent: 110, opacity: 0 });
      gsap.set([ampEl, sub, dateRow, countdownEl, scroll, kicker], { opacity: 0, y: 24 });

      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(kicker, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
        .to(titleSpans, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.04, ease: 'power4.out' }, '-=0.6')
        .to(ampEl, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
        .to(sub, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
        .to(dateRow, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
        .to(countdownEl, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
        .to(scroll, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5');

      // Parallax fade as you scroll past hero
      gsap.to(contentRef.current, {
        yPercent: -8,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const splitChars = (text: string) =>
    Array.from(text).map((ch, i) => (
      <span key={i} aria-hidden="true">
        {ch === ' ' ? ' ' : ch}
      </span>
    ));

  return (
    <header className="hero" id="top" ref={rootRef}>
      <div className="hero__canvas-wrap">
        <HeroCanvas />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content" ref={contentRef}>
        <p className="hero__kicker">Save the date</p>

        <h1 className="hero__names">
          <span className="hero__name" aria-label="Ян">{splitChars('Ян')}</span>
          <span className="hero__amp">&amp;</span>
          <span className="hero__name" aria-label="Алина">{splitChars('Алина')}</span>
        </h1>

        <p className="hero__sub">приглашают вас на свою свадьбу</p>

        <div className="hero__date-row">
          <span>26 июня</span>
          <span className="hero__date-dot" />
          <span>2026</span>
          <span className="hero__date-dot" />
          <span>Иркутск</span>
        </div>

        <Countdown />

        <a href="#schedule" className="hero__scroll">
          <span className="hero__scroll-text">листайте вниз</span>
          <span className="hero__scroll-line" />
        </a>
      </div>
    </header>
  );
}
