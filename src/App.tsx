import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Projects from './components/Projects';
import MobileMenuOverlay from './components/MobileMenuOverlay';
import './App.css'; // Keep existing CSS if it's used elsewhere

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="App">
      {/* Header and Burger Menu (always visible) */}
      <div className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center">
        <img src="/images/Portfolio-logo.svg" alt="Portfolio Logo" className="h-12" />
        <Header isOpen={isMobileMenuOpen} toggleMenu={toggleMenu} />
      </div>

      <HeroSection />
      <Projects />

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Dark Overlay for Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-500 ${
          isMobileMenuOpen ? 'opacity-60 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu} // Close menu if overlay is clicked
      ></div>
    </div>
  );
}

export default App;


