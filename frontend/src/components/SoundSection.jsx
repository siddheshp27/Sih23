<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";
export const SoundSection = () => {
  const handleLearnMore = () => {
    const element = document.querySelector(".display-section");
    window.scrollTo({
      top: element?.getBoundingClientRect().bottom,
      left: 0,
      behavior: "smooth",
=======
import React from 'react';
import { Link } from 'react-router-dom';
export const SoundSection = () => {
  const handleLearnMore = () => {
    const element = document.querySelector('.display-section');
    window.scrollTo({
      top: element?.getBoundingClientRect().bottom,
      left: 0,
      behavior: 'smooth'
>>>>>>> b11a4a1 (Changed UserRegistration)
    });
  };

  return (
    <div className="sound-section wrapper">
      <div className="body">
        <div className="sound-section-content content">
          <p className="text text-center">Blockchain based E-wallet</p>
<<<<<<< HEAD
          <span className="description">
            Document Wallet to Empower Citizens
          </span>
          <ul className="links">
            <li>
              <Link to="/register" className="button">
=======
          <span className="description">Document Wallet to Empower Citizens</span>
          <ul className="links">
            <li>
              <Link to="/login" className="button">
>>>>>>> b11a4a1 (Changed UserRegistration)
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
