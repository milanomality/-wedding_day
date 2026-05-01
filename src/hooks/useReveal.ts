import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Options = {
  delay?: number;
  y?: number;
  duration?: number;
  stagger?: number;
  childSelector?: string;
};

export function useReveal<T extends HTMLElement = HTMLDivElement>(opts: Options = {}) {
  const ref = useRef<T | null>(null);
  const { delay = 0, y = 32, duration = 1, stagger = 0.08, childSelector } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets: HTMLElement[] = childSelector
      ? Array.from(el.querySelectorAll<HTMLElement>(childSelector))
      : [el];

    if (targets.length === 0) return;

    gsap.set(targets, { opacity: 0, y });

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, y, duration, stagger, childSelector]);

  return ref;
}
