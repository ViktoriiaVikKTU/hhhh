import React, { useEffect, useRef } from 'react';
import './ParallaxSection.css';  // Підключаємо стилі для секції

const ParallaxSection = () => {
  const sectionRef = useRef(null);
  const litTextRef = useRef(null);
  const frameRef   = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const litText = litTextRef.current;
    const frame   = frameRef.current;

    // ── Lit-text spotlight ──────────────────────────────────────────────────
    const onSectionMouseMove = (e) => {
      const rect = litText.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      litText.style.backgroundImage = `
        radial-gradient(
          circle at ${x}% ${y}%,
          #FFF9C4 0%,
          #FFD700 9%,
          #FF9500 18%,
          transparent 27%
        )
      `;
    };

    const onSectionMouseLeave = () => {
      litText.style.backgroundImage =
        'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)';
    };

    section.addEventListener('mousemove',  onSectionMouseMove);
    section.addEventListener('mouseleave', onSectionMouseLeave);

    // ── Frame 3-D tilt ──────────────────────────────────────────────────────
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId;

    const onFrameMouseMove = (e) => {
      const rect = frame.getBoundingClientRect();
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top  - cy) / cy;
      targetX = dy * -10;
      targetY = dx *  10;
    };

    const onFrameMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    frame.addEventListener('mousemove',  onFrameMouseMove);
    frame.addEventListener('mouseleave', onFrameMouseLeave);

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);
      const moveX = (currentY / 10) * 14;
      const moveY = (currentX / -10) * 14;
      frame.style.transform = `
        translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))
        rotateX(${currentX}deg)
        rotateY(${currentY}deg)
      `;
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      section.removeEventListener('mousemove',  onSectionMouseMove);
      section.removeEventListener('mouseleave', onSectionMouseLeave);
      frame.removeEventListener('mousemove',    onFrameMouseMove);
      frame.removeEventListener('mouseleave',   onFrameMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="parallax"
      style={{
        background: 'linear-gradient(rgba(29, 20, 8, 0.868), rgba(29, 20, 8, 0.912)), url("img/main_background.png") center/cover no-repeat',
        height: '100vh',
        width: '100%',
      }}
    >
      <div className="lost-found-dup">
        <img ref={frameRef} className="frame-main" src="img/frame-MAIN.png" alt="Main Frame" />
        <div className="lost-found-orig">
          <span ref={litTextRef} className="lost-found-lit" id="litText">
            <span className="lost-found-orig-span">LOST</span>
            <span className="lost-found-orig-span2"> &amp; </span>
            <span className="lost-found-orig-span">FOUND</span>
          </span>
          <span>
            <span className="lost-found-orig-span">LOST</span>
            <span className="lost-found-orig-span2"> &amp; </span>
            <span className="lost-found-orig-span">FOUND</span>
          </span>
        </div>
      </div>

      <p className="scroll-to-explore">Scroll to explore</p>
    </section>
  );
};

export default ParallaxSection;
