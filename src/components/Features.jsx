import {
  FiZap,
  FiShield,
  FiSmartphone,
  FiPrinter,
  FiFileText,
  FiWifi,
} from "react-icons/fi";
import { motion } from "framer-motion";
import "./Features.css";

const features = [
  {
    icon: <FiSmartphone />,
    title: "Phone-first",
    text: "Print directly from your smartphone without moving files to another device.",
    tag: "MOBILE",
    large: true,
  },
  {
    icon: <FiZap />,
    title: "Fast workflow",
    text: "Scan, upload and send your document in just a few simple steps.",
    tag: "FAST",
  },
  {
    icon: <FiPrinter />,
    title: "Printer friendly",
    text: "Designed to work with the printing setup you already have.",
    tag: "COMPATIBLE",
  },
  {
    icon: <FiFileText />,
    title: "Multiple files",
    text: "Keep the experience flexible for documents and everyday print jobs.",
    tag: "FLEXIBLE",
  },
  {
    icon: <FiWifi />,
    title: "Connected",
    text: "A simple QR connection removes unnecessary cables and transfers.",
    tag: "CONNECTED",
  },
  {
    icon: <FiShield />,
    title: "Simple & secure",
    text: "Keep the printing process straightforward while protecting the user experience.",
    tag: "SECURE",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">

        <motion.div
          className="features-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="features-eyebrow">
            <span></span>
            WHY QR PRINT
          </div>

          <h2>
            Everything you need.
            <br />
            <span>Nothing you don't.</span>
          </h2>

          <p>
            Built around one simple idea: printing should be as easy
            as sending a file from your phone.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.article
              className={`feature-card ${
                feature.large ? "feature-card-large" : ""
              }`}
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
            >
              <div className="feature-card-top">
                <span className="feature-tag">{feature.tag}</span>

                <div className="feature-icon">
                  {feature.icon}
                </div>
              </div>

              <div className="feature-card-content">
                <h3>{feature.title}</h3>

                <p>{feature.text}</p>
              </div>

              <div className="feature-decoration">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="features-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="features-bottom-icon">
            <FiZap />
          </div>

          <div>
            <strong>Built for everyday printing</strong>
            <span>
              From a single document to a busy print counter,
              QR Print keeps the workflow simple.
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Features;