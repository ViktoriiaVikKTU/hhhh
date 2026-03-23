import React, { useEffect, useRef } from 'react';
import './RevealSection.css';

const RevealSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // ── Canvas sizing ───────────────────────────────────────────────────────
    const resizeCanvas = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ── Mouse trail points ──────────────────────────────────────────────────
    const pts = [];

    const onMouseMove = (e) => {
      pts.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        maxAge: 80 + Math.random() * 40,
        w: 50 + Math.random() * 30,
      });
      if (pts.length > 200) pts.shift();
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Drawing helpers ─────────────────────────────────────────────────────
    const drawPass = (widthMult, alphaMult) => {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const prog = b.age / b.maxAge;
        if (prog >= 1) continue;

        const alpha = (1 - prog) * (1 - prog) * alphaMult;
        const width = b.w * widthMult * (1 - prog * 0.5);

        ctx.beginPath();
        if (i >= 2) {
          const prev = pts[i - 2];
          ctx.moveTo((prev.x + a.x) / 2, (prev.y + a.y) / 2);
          ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        } else {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
        ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx.lineWidth   = width;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();
      }
    };

    let rafId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Parchment overlay
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(247, 236, 216, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Erase along trail to reveal the image below
      ctx.globalCompositeOperation = 'destination-out';
      drawPass(1.5,  0.018); // soft outer halo
      drawPass(2.8,  0.028);
      drawPass(2.2,  0.042);
      drawPass(1.7,  0.062);
      drawPass(1.3,  0.09);
      drawPass(1.0,  0.14);
      drawPass(0.65, 0.55);  // solid core

      ctx.globalCompositeOperation = 'source-over';

      // Age and prune points
      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].age++;
        if (pts[i].age >= pts[i].maxAge) pts.splice(i, 1);
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize',    resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
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

