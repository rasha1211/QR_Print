import { useState } from "react";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <a href="#home" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mark">
            <span></span>
            <span></span>
            <span></span>
          </span>

          <span className="logo-text">
            QR<span>Print</span>
          </span>
        </a>

        <nav className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>

          <a href="#home" onClick={closeMenu}>
            Home
          </a>

          <a href="#how-it-works" onClick={closeMenu}>
            How It Works
          </a>

          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#smart-printing" onClick={closeMenu}>
            Smart Printing
          </a>

          <a
            href="#start-printing"
            className="mobile-start"
            onClick={closeMenu}
          >
            Start Printing
            <FiArrowRight />
          </a>

        </nav>

        <a href="#start-printing" className="navbar-button">
          Start Printing
          <FiArrowRight />
        </a>

        <button
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

      </div>
    </header>
  );
}

export default Navbar;