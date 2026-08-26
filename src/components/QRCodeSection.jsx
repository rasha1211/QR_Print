import { QRCodeCanvas } from "qrcode.react";
import { FiCheckCircle, FiCopy } from "react-icons/fi";
import { useState } from "react";
import "./QRCodeSection.css";

function QRCodeSection({ sessionId, paymentId }) {
  const [copied, setCopied] = useState(false);

const qrValue = `http://10.39.65.10:5173/print/${sessionId}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="qr-section">

      <div className="qr-success-icon">
        <FiCheckCircle />
      </div>

      <div className="qr-section-heading">
        <span>PRINTING ACCESS</span>

        <h2>
          Your print QR is
          <br />
          <strong>ready.</strong>
        </h2>

        <p>
          Scan this QR code with your phone to access
          your printing session.
        </p>
      </div>

      <div className="qr-card">

        <div className="qr-card-label">
          SCAN TO PRINT
        </div>

        <div className="real-qr-wrapper">
          <QRCodeCanvas
            value={qrValue}
            size={220}
            bgColor="#ffffff"
            fgColor="#111111"
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="qr-instruction">
          <strong>Open your phone camera</strong>

          <span>
            Point it at the QR code to continue.
          </span>
        </div>

        <div className="qr-session">

          <div>
            <span>Session ID</span>

            <strong>
              {sessionId}
            </strong>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy QR link"
          >
            <FiCopy />

            {copied ? "Copied" : "Copy link"}
          </button>

        </div>

      </div>

      {paymentId && (
        <div className="qr-payment-status">
          <FiCheckCircle />

          <span>
            Payment confirmed · {paymentId}
          </span>
        </div>
      )}

    </div>
  );
}

export default QRCodeSection;