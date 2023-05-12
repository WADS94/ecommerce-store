import React from "react";
import Header from "./../components/Header";
import ContactInfo from "./../components/homeComponents/ContactInfo";
import Footer from "./../components/Footer";

const ReturnTerms = () => {
  return (
    <>
      <Header />
      <div className="about-us-container">
        <h2 className="delivery-title">Politica de Retur</h2>
        <p className="delivery-text">
          Aici puteți detalia politica de retur. Includeți toate informațiile
          relevante, cum ar fi costurile de retur, durata de retur, politica de
          returnare și orice alte detalii care ar putea fi relevante pentru
          clienți.
        </p>
        <p className="delivery-text">
          Al doilea paragraf pentru politica de retur. Adăugați orice alte
          detalii sau informații suplimentare aici, pentru a asigura că clienții
          dumneavoastră sunt pe deplin informați.
        </p>
      </div>
      <ContactInfo />
      <Footer />
    </>
  );
};

export default ReturnTerms;
