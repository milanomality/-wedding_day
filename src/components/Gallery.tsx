import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from '../hooks/useReveal';
import photo1 from '../../res/photo_2026-05-01_17-09-15.jpg';
import photo2 from '../../res/photo_2026-05-01_17-09-16.jpg';
import photo3 from '../../res/photo_2026-05-01_17-09-17.jpg';

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = [
  { src: photo1, alt: 'Ян и Алина — студийная фотосессия', tall: true },
  { src: photo2, alt: 'Ян и Алина — вечер', tall: false },
  { src: photo3, alt: 'Ян и Алина — на закате', tall: false },
];

export default function Gallery() {
  const headerRef = useReveal<HTMLDivElement>({ childSelector: '.section__head > *' });
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!galleryRef.current) return;
    const ctx = gsap.context(() => {
      const items = galleryRef.current!.querySelectorAll<HTMLElement>('.gallery__item');
      items.forEach((item) => {
        const img = item.querySelector('img');
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.1 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      gsap.fromTo(
        items,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section section--gallery" id="moments">
      <div className="section__head" ref={headerRef}>
        <p className="section__kicker">Наши моменты</p>
        <h2 className="section__title">Мы с тобой</h2>
      </div>

      <div className="gallery" ref={galleryRef}>
        {PHOTOS.map((p, i) => (
          <figure
            key={p.src}
            className={`gallery__item${p.tall ? ' gallery__item--tall' : ''}`}
          >
            <img src={p.src} alt={p.alt} loading={i === 0 ? 'eager' : 'lazy'} />
          </figure>
        ))}
      </div>
    </section>
  );
}
