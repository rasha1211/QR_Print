import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import SmartPrinting from "./components/SmartPrinting";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import PrintApp from "./components/PrintApp";

function App() {
  const [showPrintApp, setShowPrintApp] = useState(
    window.location.pathname.startsWith("/print/")
  );

  const openPrintApp = () => {
    setShowPrintApp(true);

    window.history.pushState({}, "", "/print");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closePrintApp = () => {
    setShowPrintApp(false);

    window.history.pushState({}, "", "/");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  if (showPrintApp) {
    return (
      <div className="app">
        <Navbar />

        <main>
          <PrintApp onBack={closePrintApp} />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero onStartPrinting={openPrintApp} />

        <HowItWorks />

        <Features />

        <SmartPrinting />

        <CTA onStartPrinting={openPrintApp} />
      </main>

      <Footer />
    </div>
  );
}

export default App;