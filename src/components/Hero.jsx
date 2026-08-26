import {
  FiArrowUpRight,
  FiCheck,
  FiFileText,
  FiPrinter,
} from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import "./Hero.css";

function Hero({ onStartPrinting }) {
  // Real QR code destination
  const qrValue = `${window.location.origin}/#print`;
  return (
    <section className="hero" id="print">
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="hero-container">

        {/* LEFT SIDE */}

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            QR-powered printing
          </div>

          <h1>
            Printing from your phone,
            <br />
            <span>without the hassle.</span>
          </h1>

          <p className="hero-description">
            Scan a QR code, upload your document from your phone,
            and send it straight to the printer. No cables. No complicated setup.
          </p>

          <div className="hero-actions">
            <a
              href="#print"
              className="hero-primary-button"
              onClick={onStartPrinting}
            >
              Start Printing
              <FiArrowUpRight />
            </a>

            <a href="#how-it-works" className="hero-text-button">
              See how it works
            </a>
          </div>

          <div className="hero-proof">
            <div className="proof-item">
              <span className="proof-check">
                <FiCheck />
              </span>
              <span>No app required</span>
            </div>

            <div className="proof-item">
              <span className="proof-check">
                <FiCheck />
              </span>
              <span>Phone-first</span>
            </div>

            <div className="proof-item">
              <span className="proof-check">
                <FiCheck />
              </span>
              <span>Simple workflow</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}

        <motion.div
          className="hero-product"
          initial={{ opacity: 0, scale: 0.94, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: "easeOut",
          }}
        >

          <div className="product-orbit"></div>

          {/* DOCUMENT CARD */}

          <motion.div
            className="floating-card floating-card-file"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="floating-icon">
              <FiFileText />
            </div>

            <div>
              <strong>document.pdf</strong>
              <span>Ready to print</span>
            </div>

            <FiCheck className="floating-check" />
          </motion.div>

          {/* PRINTER READY */}

          <motion.div
            className="floating-card floating-card-status"
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="status-pulse"></span>
            Printer ready
          </motion.div>

          {/* MAIN PRODUCT PANEL */}

          <div className="product-panel">

            <div className="product-panel-header">

              <div className="product-brand">
                <span className="product-brand-icon">
                  <FiPrinter />
                </span>

                <div>
                  <strong>QR Print</strong>
                  <span>Smart printing</span>
                </div>
              </div>

              <span className="online-status">
                <span></span>
                Online
              </span>

            </div>

            {/* SCANNER + PRINTER */}

            <div className="printing-workflow">

              {/* QR SCANNER */}

              <div className="scanner-section">

                <div className="qr-display">

                  <div className="qr-corner qr-corner-tl"></div>
                  <div className="qr-corner qr-corner-tr"></div>
                  <div className="qr-corner qr-corner-bl"></div>
                  <div className="qr-corner qr-corner-br"></div>

                  {/* REAL QR CODE */}

                  <div className="qr-code">
                    <QRCodeCanvas
                      value={qrValue}
                      size={150}
                      bgColor="#ffffff"
                      fgColor="#111111"
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div className="qr-scan-line"></div>

                </div>

                <div className="scan-label">
                  <strong>Scan to print</strong>
                  <span>Use your phone camera</span>
                </div>

              </div>

              {/* CONNECTION */}

              <div className="workflow-connection">

                <span className="connection-arrow">→</span>

                <span className="connection-text">
                  PRINTING
                </span>

              </div>

              {/* PRINTER */}

              <div className="printer-section">

                <div className="printer-machine">

                  <div className="printer-top">

                    <div className="printer-display">
                      <span></span>
                      PRINTING
                    </div>

                  </div>

                  <div className="printer-body">

                    <div className="printer-slot"></div>

                    <div className="printer-light"></div>

                  </div>

                  {/* PRINTED PAGES */}

                  <div className="printed-pages">

                    <div className="printed-page page-one">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="printed-page page-two">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="printed-page page-three">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="printed-page page-four">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                  </div>

                </div>

                <div className="printer-label">
                  <strong>Printing</strong>
                  <span>Pages coming out</span>
                </div>

              </div>

            </div>

            {/* BOTTOM STATUS */}

            <div className="product-bottom">

              <div className="connection-line">
                <span className="connection-dot"></span>
                Connected
              </div>

              <div className="printing-status">
                <FiPrinter />
                <span>Printing automatically</span>
              </div>

            </div>

          </div>

        </motion.div>

      </div>

      <div className="hero-scroll">
        <span>Scroll to explore</span>
        <div className="scroll-line"></div>
      </div>

    </section>
  );
}

export default Hero;