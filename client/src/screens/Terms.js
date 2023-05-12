import React from "react";
import Header from "./../components/Header";
import ContactInfo from "./../components/homeComponents/ContactInfo";
import Footer from "./../components/Footer";

const Terms = () => {
  return (
    <>
      <Header />
      <div className="about-us-container">
        <h2 className="terms-title">Termeni și Condiții</h2>
        <p className="terms-text">
          Aici vor fi termenii și condițiile dumneavoastră. Asigurați-vă că
          detaliați toate politicile și reglementările necesare pentru clienții
          dumneavoastră.
        </p>
        <p className="terms-text">
          Al doilea paragraf pentru termenii și condițiile dumneavoastră. Aici
          puteți adăuga mai multe detalii sau informații suplimentare dacă este
          necesar.
        </p>
      </div>
      <ContactInfo />
      <Footer />
    </>
  );
};

export default Terms;
