import React from 'react';
import './index.css';
import Header from './components/Header';
import ParallaxSection from './components/ParallaxSection';
import RevealSection from './components/RevealSection';

const App = () => {
  return (
    <div>
      <Header />
      <ParallaxSection />
      <RevealSection />
    </div>
  );
};

export default App;
