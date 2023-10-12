import React from 'react';
import { Link } from 'react-router-dom';
export const SoundSection = () => {
  const handleLearnMore = () => {
    const element = document.querySelector('.display-section');
    window.scrollTo({
      top: element?.getBoundingClientRect().bottom,
      left: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="sound-section wrapper">
      <div className="body">
        <div className="sound-section-content content">
          <p className="text text-center">Blockchain based E-wallet</p>
          <span className="description">Document Wallet to Empower Citizens</span>
          <ul className="links">
            <li>
              <Link to="/login" className="button">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
