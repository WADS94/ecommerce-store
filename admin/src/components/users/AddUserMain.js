import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { USER_ADD_RESET } from "../../Redux/Constants/UserContants";
import { createUser } from "../../Redux/Actions/userActions";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const AddUserMain = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatar, setAvatar] = useState("");

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, user } = userRegister;

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
    if (user) {
      toast.success("Utilizator adaugat", ToastObjects);
      dispatch({ type: USER_ADD_RESET });
      setName("");
      setEmail("");
      setPassword("");
      setIsAdmin(false);
      setAvatar("");
    }
  }, [user, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createUser(name, email, password, isAdmin, avatar));
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/users" className="btn btn-danger text-white">
              Utilizatori
            </Link>
            <h2 className="content-title">Adauga utilizator</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Adauga
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />}
                  <div className="mb-4">
                    <label htmlFor="user_name" className="form-label">
                      Nume
                    </label>
                    <input
                      type="text"
                      placeholder="Nume"
                      className="form-control"
                      id="user_name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="user_email" className="form-label">
                      Email
                    </label>
                    <input
                      className="form-control"
                      placeholder="Email"
                      type="email"
                      id="user_email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="user_password" className="form-label">
                      Parola
                    </label>
                    <input
                      className="form-control"
                      placeholder="Parola"
                      type="password"
                      id="user_password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
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
                        width="55"
                        height="52"
                      />
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="user_isadmin" className="form-label">
                      Este admin
                    </label>
                    <select
                      className="form-control"
                      id="user_isadmin"
                      value={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.value)}
                    >
                      <option key={false} value={false}>
                        Nu
                      </option>
                      <option key={true} value={true}>
                        Da
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddUserMain;
