import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import { register } from "../Redux/Actions/userActions";
import Header from "./../components/Header";
import Footer from "./../components/Footer";

const Register = ({ location, history }) => {
  window.scrollTo(0, 0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo } = userRegister;

  const onChangeAvatar = (e) => {
    const file = e.target.files[0];

    setAvatar("");

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password, avatar));
  };

  return (
    <>
      <Header />
      <div className="container d-flex flex-column justify-content-center align-items-center login-center">
        {error && <Message variant="alert-danger">{error}</Message>}
        {loading && <Loading />}

        <form
          className="Login col-md-8 col-lg-4 col-11"
          onSubmit={submitHandler}
        >
          <input
            type="text"
            placeholder="Nume"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="mb-4"
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mb-4">
            <label htmlFor="user_avatar" className="form-label">
              Avatar
            </label>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="user_avatar"
                onChange={onChangeAvatar}
                style={{ display: "none" }}
              />
              <label
                className="custom-file-label btn btn-secondary"
                htmlFor="user_avatar"
              >
                Selecteaza imagine
              </label>
            </div>
            {avatar && (
              <img
                src={avatar}
                key={avatar}
                alt="Images Preview"
                className="mt-3 mr-2"
                width="100"
                height="100"
              />
            )}
          </div>
          <button type="submit">Inregistrare</button>
          <p>
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Am deja cont <strong>Autentificare</strong>
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
