import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaFacebook, FaYoutube, FaTiktok, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <Container fluid className="bg-dark text-white py-3 footer-container">
      <Row className="mb-2 footer-section pt-3">
        <Col sm={4} className="text-center">
          <h6 className="footer-title">Casa viitorului</h6>
          <ul className="list-unstyled">
            <li>
              <a href="/" className="footer-link">
                Produse
              </a>
            </li>
            <li>
              <a href="/aboutus" className="footer-link">
                Despre noi
              </a>
            </li>
          </ul>
        </Col>

        <Col sm={4} className="text-center">
          <h6 className="footer-title">Informatii Utile</h6>
          <ul className="list-unstyled">
            <li>
              <a href="/delivery" className="footer-link">
                Livrare
              </a>
            </li>
            <li>
              <a href="/return" className="footer-link">
                Retur
              </a>
            </li>
            <li>
              <a href="/terms" className="footer-link">
                Termeni si Conditii
              </a>
            </li>
          </ul>
        </Col>

        <Col sm={4} className="text-center">
          <h6 className="footer-title mb-4">Urmareste-ne</h6>
          <div className="d-flex social-icons justify-content-center">
            <a href="https://www.facebook.com" className="social-icon">
              <FaFacebook size={30} />
            </a>
            <a href="https://www.youtube.com" className="social-icon">
              <FaYoutube size={30} />
            </a>
            <a href="https://www.tiktok.com" className="social-icon">
              <FaTiktok size={30} />
            </a>
            <a href="https://www.instagram.com" className="social-icon">
              <FaInstagram size={30} />
            </a>
          </div>
        </Col>
      </Row>

      <Row className="mb-2 justify-content-center">
        <Col xs={12} className="text-center">
          <div className="d-flex justify-content-center payment-icons">
            <img
              src="/visa_logo.svg"
              alt="Visa"
              style={{ height: "25px", width: "auto" }}
            />
            <img
              src="/mastercard_logo.svg"
              alt="Mastercard"
              style={{ height: "30px", width: "auto" }}
            />
            <img
              src="/paypal_logo.svg"
              alt="Paypal"
              style={{ height: "40px", width: "auto" }}
            />
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Magazinul Casa Viitorului
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
