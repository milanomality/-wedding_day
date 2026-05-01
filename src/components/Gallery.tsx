import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from '../hooks/useReveal';

gsap.registerPlugin(ScrollTrigger);

// Pick up every photo in res/ automatically. New files appear next build.
const modules = import.meta.glob<{ default: string }>('../../res/photo_*.jpg', { eager: true });
const PHOTOS: string[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, mod]) => mod.default);

export default function Gallery() {
  const headerRef = useReveal<HTMLDivElement>({ childSelector: '.section__head > *' });
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Desktop / tablet: horizontal pinned scroll
    mm.add('(min-width: 768px)', () => {
      const ctx = gsap.context(() => {
        const items = track.querySelectorAll<HTMLElement>('.gallery-h__item');

        // Initial state for in-view animation when entering scrub
        gsap.set(items, { opacity: 0.6, scale: 0.96 });

        const distance = () => track.scrollWidth - window.innerWidth + 32;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Each item perks up a bit when it crosses screen center
        items.forEach((item) => {
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              containerAnimation: tween,
              start: 'left 80%',
              end: 'left 30%',
              scrub: true,
            },
          });

          // Photo parallax inside its frame
          const img = item.querySelector('img');
          if (img) {
            gsap.fromTo(
              img,
              { xPercent: -6 },
              {
                xPercent: 6,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  containerAnimation: tween,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              }
            );
          }
        });
      }, section);

      return () => ctx.revert();
    });

    // Mobile: vertical column with stagger reveal + soft parallax per image
    mm.add('(max-width: 767px)', () => {
      const ctx = gsap.context(() => {
        const items = track.querySelectorAll<HTMLElement>('.gallery-h__item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power3.out',
            duration: 0.9,
            stagger: 0.08,
            scrollTrigger: { trigger: track, start: 'top 75%', once: true },
          }
        );
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="section section--gallery" id="moments" ref={sectionRef}>
      <div className="section__head" ref={headerRef}>
        <p className="section__kicker">Наши моменты · {PHOTOS.length}</p>
        <h2 className="section__title">Мы с тобой</h2>
        <p className="section__lead">Прокручивайте — кадры плывут навстречу.</p>
      </div>

      <div className="gallery-h">
        <div className="gallery-h__track" ref={trackRef}>
          {PHOTOS.map((src, i) => (
            <figure
              key={src}
              className="gallery-h__item"
              style={{ '--i': i } as React.CSSProperties}
            >
              <img src={src} alt={`Ян и Алина — кадр ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} />
              <figcaption className="gallery-h__caption">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>/ {String(PHOTOS.length).padStart(2, '0')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
