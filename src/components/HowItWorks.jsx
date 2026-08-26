import {
  FiArrowRight,
  FiFileText,
  FiSmartphone,
  FiCreditCard,
  FiPrinter,
} from "react-icons/fi";
import { motion } from "framer-motion";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Scan the QR",
    description:
      "Scan the QR code displayed on the printer using your phone camera.",
    icon: <FiSmartphone />,
    label: "SCAN",
  },
  {
    number: "02",
    title: "Upload your file",
    description:
      "Choose a PDF, image, or document directly from your smartphone.",
    icon: <FiFileText />,
    label: "UPLOAD",
  },
  {
    number: "03",
    title: "Make payment",
    description:
      "Review your print job and complete the payment securely.",
    icon: <FiCreditCard />,
    label: "PAY",
  },
  {
    number: "04",
    title: "Get your print",
    description:
      "Your document is sent to the printer and printed instantly.",
    icon: <FiPrinter />,
    label: "PRINT",
  },
];

function QRAnimation() {
  return (
    <div className="qr-animation">
      <div className="qr-frame">
        <div className="qr-corner top-left"></div>
        <div className="qr-corner top-right"></div>
        <div className="qr-corner bottom-left"></div>

        <div className="qr-pattern">
          <span></span>
          <span></span>
          <span></span>
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

        <motion.div
          className="scan-line"
          animate={{ top: ["15%", "82%", "15%"] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="scan-status">
        <span></span>
        SCANNING
      </div>
    </div>
  );
}

function UploadAnimation() {
  return (
    <div className="upload-animation">
      <div className="phone-preview">
        <FiSmartphone />

        <motion.div
          className="upload-file"
          animate={{
            y: [8, -12, 8],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
        >
          <FiFileText />
        </motion.div>

        <div className="upload-arrow">↑</div>
      </div>

      <span>UPLOADING</span>
    </div>
  );
}

function PaymentAnimation() {
  return (
    <div className="payment-animation">
      <motion.div
        className="payment-circle"
        animate={{
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
      >
        <FiCreditCard />
      </motion.div>

      <div className="payment-lines">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <small>SECURE PAYMENT</small>
    </div>
  );
}

function PrintAnimation() {
  return (
    <div className="print-animation">
      <div className="printer-machine">
        <FiPrinter />

        <motion.div
          className="paper"
          animate={{
            y: [12, -2],
            opacity: [0, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.7,
          }}
        >
          <FiFileText />
        </motion.div>
      </div>

      <div className="print-status">
        <span></span>
        PRINTING
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">

        <motion.div
          className="how-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="how-label">
            <span></span>
            HOW IT WORKS
          </div>

          <h2>
            Printing made
            <br />
            <span>ridiculously simple.</span>
          </h2>

          <p>
            Scan, upload, pay and print.
            Everything happens directly from your phone.
          </p>
        </motion.div>

        <div className="how-steps">

          {steps.map((step, index) => (
            <motion.div
              className="how-step"
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
            >

              <div className="step-top">
                <span className="step-number">
                  {step.number}
                </span>

                <span className="step-label">
                  {step.label}
                </span>
              </div>

              <div className="step-visual">
                {index === 0 && <QRAnimation />}
                {index === 1 && <UploadAnimation />}
                {index === 2 && <PaymentAnimation />}
                {index === 3 && <PrintAnimation />}
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

              {index < steps.length - 1 && (
                <div className="step-arrow">
                  <FiArrowRight />
                </div>
              )}

            </motion.div>
          ))}

        </div>

        <div className="how-bottom">

          <div className="how-mini-card">
            <span className="mini-dot active"></span>
            <strong>01</strong>
            <span>Scan</span>
          </div>

          <div className="how-line"></div>

          <div className="how-mini-card">
            <span className="mini-dot"></span>
            <strong>02</strong>
            <span>Upload</span>
          </div>

          <div className="how-line"></div>

          <div className="how-mini-card">
            <span className="mini-dot"></span>
            <strong>03</strong>
            <span>Pay</span>
          </div>

          <div className="how-line"></div>

          <div className="how-mini-card">
            <span className="mini-dot"></span>
            <strong>04</strong>
            <span>Print</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;