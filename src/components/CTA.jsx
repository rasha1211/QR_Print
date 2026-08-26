import { FiArrowRight, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import "./CTA.css";

function CTA({ onStartPrinting }) {
  return (
    <section className="cta" id="start-printing">
      <div className="cta-container">

        <div className="cta-glow cta-glow-one"></div>
        <div className="cta-glow cta-glow-two"></div>

        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="cta-eyebrow">
            <span></span>
            READY WHEN YOU ARE
          </div>

          <h2>
            Ready to print
            <br />
            <span>smarter?</span>
          </h2>

          <p>
            Scan. Upload. Print.
            <br />
            A simpler way to get your documents printed.
          </p>

          <div className="cta-actions">
            <button
              className="cta-primary"
              onClick={onStartPrinting}
            >
              Start Printing
              <FiArrowRight />
            </button>

            <div className="cta-trust">
              <FiCheck />
              <span>No complicated setup</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="cta-qr-area"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="cta-qr-glow"></div>

          <div className="cta-qr-card">

            <div className="cta-qr-top">
              <span>QR PRINT</span>

              <div className="cta-live">
                <span></span>
                LIVE
              </div>
            </div>

            {/* REAL QR CODE */}
            <div className="cta-qr">

              <QRCodeCanvas
                value={window.location.origin}
                size={210}
                bgColor="#ffffff"
                fgColor="#101522"
                level="H"
                includeMargin={true}
              />

              <div className="qr-scan-line"></div>

            </div>

            <div className="cta-qr-bottom">
              <strong>Scan to start</strong>
              <span>Your printing journey begins here.</span>
            </div>

          </div>

          <div className="floating-badge badge-top">
            <FiCheck />
            Ready
          </div>

          <div className="floating-badge badge-bottom">
            Print instantly
          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default CTA;