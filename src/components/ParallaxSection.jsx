import React from 'react';
import './ParallaxSection.css';  // Підключаємо стилі для секції

const ParallaxSection = () => {
  return (
    <section
      className="parallax"
      style={{
        background: 'linear-gradient(rgba(29, 20, 8, 0.868), rgba(29, 20, 8, 0.912)), url("img/main_background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100%',
      }}
    >
      <div className="lost-found-dup">
        <img className="frame-main" src="img/frame-MAIN.png" alt="Main Frame" />
        <div className="lost-found-orig">
          <span className="lost-found-lit" id="litText">
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
