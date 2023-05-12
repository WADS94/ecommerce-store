import React from "react";

const ContactInfo = () => {
  return (
    <div className="contactInfo container">
      <div className="row">
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <i className="fas fa-phone-alt"></i>
            </div>
            <h5>Suna 24x7</h5>
            <a href="tel:04072 222 333">+4072 222 333</a>
          </div>
        </div>
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <h5>Sediu</h5>
            <p>Bucuresti Splaiul Unirii 165</p>
          </div>
        </div>
        <div className="col-12 col-md-4 contact-Box">
          <div className="box-info">
            <div className="info-image">
              <i className="fas fa-envelope"></i>
            </div>
            <h5>Email</h5>
            <a href="mailtocasa.viitorului.magazin@gmail.com">
              casa.viitorului.magazin@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
