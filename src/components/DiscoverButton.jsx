import React from 'react';
import './DiscoverButton.css';

const DiscoverButton = ({ label = 'Discover', onClick }) => (
  <button className="discover-btn" aria-label={label} onClick={onClick}>
    <span className="discover-btn__text">{label}</span>
    <span className="discover-btn__circle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path className="discover-btn__arrow" d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#F4EDDD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  </button>
);

export default DiscoverButton;
