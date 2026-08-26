import {
  FiArrowRight,
  FiCheck,
  FiFileText,
  FiPrinter,
  FiUpload,
} from "react-icons/fi";
import { motion } from "framer-motion";
import "./SmartPrinting.css";

function SmartPrinting() {
  return (
    <section className="smart-printing" id="smart-printing">
      <div className="smart-printing-container">

        <motion.div
          className="smart-copy"
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <div className="smart-eyebrow">
            <span></span>
            SMART PRINTING
          </div>

          <h2>
            Your phone.
            <br />
            Your file.
            <br />
            <span>One simple connection.</span>
          </h2>

          <p>
            QR Print removes the unnecessary steps between your phone
            and the printer. Upload your document and let the system
            handle the rest.
          </p>

          <div className="smart-benefits">

            <div className="smart-benefit">
              <div className="smart-benefit-icon">
                <FiUpload />
              </div>

              <div>
                <strong>Upload from your phone</strong>
                <span>
                  Select your document without moving it to another device.
                </span>
              </div>
            </div>

            <div className="smart-benefit">
              <div className="smart-benefit-icon">
                <FiPrinter />
              </div>

              <div>
                <strong>Send directly to print</strong>
                <span>
                  Once submitted, your document moves through the print workflow.
                </span>
              </div>
            </div>

          </div>
        </motion.div>

        <motion.div
          className="smart-system"
          initial={{ opacity: 0, x: 35, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >

          <div className="system-grid"></div>

          <div className="system-node node-phone">

            <div className="phone-frame">
              <div className="phone-speaker"></div>

              <div className="phone-screen">
                <div className="phone-screen-top">
                  <span>QR Print</span>
                  <FiCheck />
                </div>

                <div className="phone-file-icon">
                  <FiFileText />
                </div>

                <strong>document.pdf</strong>

                <span className="phone-file-status">
                  Ready to print
                </span>

                <div className="phone-progress">
                  <span></span>
                </div>

                <button className="phone-print-button">
                  Send to printer
                  <FiArrowRight />
                </button>
              </div>
            </div>

            <span className="node-label">YOUR PHONE</span>

          </div>

          <div className="system-connection connection-one">
            <span></span>
            <div className="connection-pulse"></div>
          </div>

          <div className="system-center">

            <div className="center-ring center-ring-one"></div>
            <div className="center-ring center-ring-two"></div>

            <div className="center-qr">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="center-scan"></div>

          </div>

          <div className="system-connection connection-two">
            <span></span>
            <div className="connection-pulse"></div>
          </div>

          <div className="system-node node-printer">

            <div className="printer-visual">

              <div className="printer-paper">
                <div></div>
                <div></div>
                <div></div>
              </div>

              <div className="printer-body">
                <div className="printer-status"></div>
                <div className="printer-slot"></div>
              </div>

              <div className="printer-base"></div>

            </div>

            <span className="node-label">PRINTER</span>

          </div>

          <div className="system-status">
            <span></span>
            System connected
          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default SmartPrinting;