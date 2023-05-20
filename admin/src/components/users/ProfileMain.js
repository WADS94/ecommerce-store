import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Toast from "./../LoadingError/Toast";
import Loading from "./../LoadingError/Loading";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../Redux/Actions/userActions";

const ProfileMain = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const toastId = React.useRef(null);

  const Toastobjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false,
    autoClose: 2000,
  };

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { loading: updateLoading } = userUpdateProfile;

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
    // console.log(user);
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Password match
    if (password !== confirmPassword) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Parola nu se potriveste", Toastobjects);
      }
    } else {
      dispatch(
        updateUserProfile({ id: user._id, name, email, password, avatar })
      );
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Profil Updatat", Toastobjects);
      }
    }
  };
  return (
    <>
      <Toast />
      {error && <Message variant="alert-danger">{error}</Message>}
      {loading && <Loading />}
      {updateLoading && <Loading />}
      <form onSubmit={submitHandler}>
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
                  <div className="form">
                    <label htmlFor="account-confirm-pass">
                      Confirma parola
                    </label>
                    <input
                      className="form-control"
                      type="password"
                      value={confirmPassword ?? ""}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
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
              </div>
              <button type="submit" className="btn btn-primary">
                Updateaza profilul
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ProfileMain;
