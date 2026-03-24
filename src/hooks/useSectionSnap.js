import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const DURATION = 1;
const EASE     = 'power2.inOut';

/**
 * Intercepts wheel / keyboard / touch events and snaps the page to the
 * nearest [data-snap-section] element using a GSAP scrollTo tween.
 */
const useSectionSnap = () => {
  const isAnimating  = useRef(false);
  const currentIndex = useRef(0);
  const touchStartY  = useRef(null);

  useEffect(() => {
    const getSections = () =>
      Array.from(document.querySelectorAll('[data-snap-section]'));

    const goTo = (index) => {
      const sections = getSections();
      if (isAnimating.current) return;
      if (index < 0 || index >= sections.length) return;

      isAnimating.current  = true;
      currentIndex.current = index;

      gsap.to(window, {
        scrollTo:   { y: sections[index], autoKill: false },
        duration:   DURATION,
        ease:       EASE,
        onComplete: () => { isAnimating.current = false; },
      });
    };

    // ── Wheel ─────────────────────────────────────────────────────────────────
    const onWheel = (e) => {
      e.preventDefault();
      if (isAnimating.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      goTo(currentIndex.current + dir);
    };

    // ── Keyboard (ArrowDown / ArrowUp / PageDown / PageUp / Space) ────────────
    const onKeyDown = (e) => {
      const map = {
        ArrowDown:  1, ArrowRight:  1, PageDown: 1, ' ': 1,
        ArrowUp:   -1, ArrowLeft:  -1, PageUp:  -1,
      };
      if (!(e.key in map)) return;
      e.preventDefault();
      if (isAnimating.current) return;
      goTo(currentIndex.current + map[e.key]);
    };

    // ── Touch ─────────────────────────────────────────────────────────────────
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(delta) < 30) return; // ignore small swipes
      if (isAnimating.current) return;
      goTo(currentIndex.current + (delta > 0 ? 1 : -1));
    };

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('keydown',    onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('keydown',    onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, []);
};

export default useSectionSnap;
