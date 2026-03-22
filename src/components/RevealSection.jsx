import React, { useEffect, useRef } from 'react';
import './RevealSection.css';

const RevealSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Static context properties — extracted so they can be reapplied after
    // a canvas resize (resizing resets all canvas context state).
    const initCtx = () => {
      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';
    };
    initCtx();

    // ── Canvas sizing (debounced to avoid thrashing on resize) ──────────────
    let resizeTimer;
    const resizeCanvas = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        // Resizing the canvas resets all context state; reapply.
        initCtx();
      }, 100);
    };
    // Initial sizing is immediate
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', resizeCanvas);

    // ── Mouse trail points ──────────────────────────────────────────────────
    const pts = [];
    // Only capture a new point when the mouse moves at least 5px from the last
    const MIN_DIST_SQ = 25;

    const onMouseMove = (e) => {
      const last = pts[pts.length - 1];
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        if (dx * dx + dy * dy < MIN_DIST_SQ) return;
      }
      pts.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        maxAge: 180 + Math.random() * 80,
        w: 100 + Math.random() * 80,
      });
      if (pts.length > 200) pts.shift();
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Drawing helpers ─────────────────────────────────────────────────────
    const PASSES = [
      [1.5,  0.018], // soft outer halo
      [2.8,  0.028],
      [2.2,  0.042],
      [1.7,  0.062],
      [1.3,  0.09],
      [1.0,  0.14],
      [0.65, 0.55],  // solid core
    ];

    const drawPass = (widthMult, alphaMult) => {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const prog = b.age / b.maxAge;
        if (prog >= 1) continue;

        ctx.strokeStyle = `rgba(0,0,0,${((1 - prog) * (1 - prog) * alphaMult).toFixed(4)})`;
        ctx.lineWidth   = b.w * widthMult * (1 - prog * 0.5);

        ctx.beginPath();
        if (i >= 2) {
          const prev = pts[i - 2];
          ctx.moveTo((prev.x + a.x) / 2, (prev.y + a.y) / 2);
          ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        } else {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
      }
    };

    let rafId;
    // Track whether the last frame had live points so we paint one final
    // parchment-restore frame after all points expire, then go fully idle.
    let hadPoints = false;

    const draw = () => {
      // Age and prune every frame (cheap; keeps pts tidy)
      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].age++;
        if (pts[i].age >= pts[i].maxAge) pts.splice(i, 1);
      }

      const hasPoints = pts.length > 1;

      // Skip expensive canvas work when there is nothing to draw and the
      // previous frame already restored a clean state.
      if (hasPoints || hadPoints) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Parchment overlay
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(247, 236, 216, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (hasPoints) {
          // Erase along trail to reveal the image below
          ctx.globalCompositeOperation = 'destination-out';
          for (let p = 0; p < PASSES.length; p++) {
            drawPass(PASSES[p][0], PASSES[p][1]);
          }
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      hadPoints = hasPoints;
      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize',    resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div className="scene">
      <img className="photo-under" src="img/photo.png" alt="Photo" />
      <img className="flowers" src="img/flower.png" alt="Flowers" />
      <canvas ref={canvasRef} id="revealCanvas" />
    </div>
  );
};

export default RevealSection;

