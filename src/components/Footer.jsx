import {
  FiPrinter,
  FiMail,
  FiArrowUp,
} from "react-icons/fi";
import "./Footer.css";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-main">

          <div className="footer-brand">
            <a href="#print" className="footer-logo">
              <span>
                <FiPrinter />
              </span>
              QR Print
            </a>

            <p>
              Smart printing from your phone.
              Simple, fast, and accessible.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h4>Explore</h4>
              <a href="#how-it-works">How It Works</a>
              <a href="#features">Features</a>
              <a href="#smart-printing">Smart Printing</a>
            </div>

            <div>
              <h4>Contact</h4>
              <a href="Phone: 7489096378"></a>
              <a href="Phone: 7489096378">
                <FiPrinter />
                7489096378
              </a>
              <a href="mailto:hello@qrprint.com">
                <FiMail />
                hello@qrprint.com
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>
            © 2026 QR Print. All rights reserved.
          </span>

          <button
            className="footer-top-button"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            Back to top
            <FiArrowUp />
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;