import React from "react";
import Header from "./../components/Header";
import ContactInfo from "./../components/homeComponents/ContactInfo";
import Footer from "./../components/Footer";

const AboutUs = () => {
  return (
    <>
      <Header />
      <div className="about-us-container">
        <h2 className="about-us-title">Despre noi</h2>
        <p className="about-us-text">
          Suntem o echipă mică și dedicată de profesioniști, pasionați de
          oferirea de produse și servicii de cea mai bună calitate clienților
          noștri. Misiunea noastră este să ajutăm oamenii să-și atingă
          obiectivele și să-și transforme visele în realitate.
        </p>
        <p className="about-us-text">
          Cu ani de experiență în industrie, avem cunoștințele și expertiza
          necesare pentru a ne asigura că clienții noștri primesc cel mai bun
          serviciu posibil. Ne mândrim cu angajamentul nostru față de excelență
          și dedicarea noastră față de satisfacția clienților.
        </p>
      </div>
      <ContactInfo />
      <Footer />
    </>
  );
};

export default AboutUs;
