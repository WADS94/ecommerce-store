import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../Redux/Actions/cartActions";
import Header from "./../components/Header";
import Footer from "./../components/Footer";

const PaymentScreen = ({ history }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };
  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center login-center">
        <form
          className="Login2 col-md-8 col-lg-4 col-11"
          onSubmit={submitHandler}
        >
          <h6>Alege metoda de plata</h6>
          <div className="payment-container">
            <div className="radio-container">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                value={"PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label">
                PayPal(plata se va face in USD)
              </label>
            </div>
            <div className="radio-container">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                value={"CreditCard"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label">Credit Card</label>
            </div>
          </div>

          <button type="submit" disabled={!paymentMethod}>
            Continua
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default PaymentScreen;
