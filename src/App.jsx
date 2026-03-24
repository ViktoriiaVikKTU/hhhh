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
      <RevealSection caption={<>Your second line one here,<br />and your second line two here.</>} />
    </div>
  );
};

export default App;
