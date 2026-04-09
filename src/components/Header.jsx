import React from 'react';
import ReactDOM from 'react-dom';
import './Header.css';

const Header = () => {
  return ReactDOM.createPortal(
    <header className="header">
      <a className="header__logo" href="/">LOST &amp; FOUND</a>
      <nav>
        <ul className="header__nav">
          <li><a href="#about">About</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>,
    document.body
  );
};

export default Header;
