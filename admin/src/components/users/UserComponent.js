import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listUser } from "../../Redux/Actions/userActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const UserComponent = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState([""]);
  const [searchUser, setSearchUser] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");

  const userList = useSelector((state) => state.userList);
  const { loading, error, users, page, pages } = userList;

  const [pagenumber, setPagenumber] = useState(page);

  const handlePageChange = (e) => {
    e.preventDefault();
    setPagenumber(e.target.text);
  };

  const handleUserTypeFilterChange = (e) => {
    setUserTypeFilter(e.target.value);
    setPagenumber(1);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setSearchUser(keyword);
    setPagenumber(1);
  };

  useEffect(() => {
    dispatch(listUser(searchUser, userTypeFilter, pagenumber));
  }, [dispatch, searchUser, userTypeFilter, pagenumber]);
  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Utilizatori</h2>
        <div>
          <Link to="/adduser" className="btn btn-primary">
            <i className="material-icons md-plus"></i> Adauga
          </Link>
        </div>
      </div>

      <div className="card mb-4">
        <header className="card-header">
          <div className="row gx-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <form onSubmit={submitHandler} className="input-group">
                <input
                  type="search"
                  placeholder="Nume..."
                  className="form-control p-2"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="search-button">
                  Cauta
                </button>
              </form>
            </div>
            <div className="col-lg-4 col-md-6 me-auto">
              <select
                className="form-select"
                value={userTypeFilter}
                onChange={handleUserTypeFilterChange}
              >
                <option value="">Toti</option>
                <option value="true">Administratori</option>
                <option value="false">Clienti</option>
              </select>
            </div>
          </div>
        </header>

        {/* Card */}
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
              {users.map((user) => (
                <div className="col" key={user._id}>
                  <div className="card card-user shadow-sm">
                    <div className="card-header">
                      <img
                        className="img-md img-avatar"
                        src={user.avatar ? user.avatar.url : "/favicon.png"}
                        alt="User pic"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title mt-5">{user.name}</h5>
                      <div className="card-text text-muted">
                        {user.isAdmin === true ? (
                          <p className="m-0">Admin</p>
                        ) : (
                          <p className="m-0">Client</p>
                        )}

                        <p>
                          <a href={`mailto:${user.email}`}>{user.email}</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <nav className="float-end mt-4" aria-label="Page navigation">
            <ul className="pagination">
              {[...Array(pages).keys()].map((x) => (
                <li
                  className={`page-item ${x + 1 === page ? "active" : ""}`}
                  key={x + 1}
                >
                  <Link
                    className="page-link"
                    to="#"
                    value={x + 1}
                    onClick={handlePageChange}
                  >
                    {x + 1}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default UserComponent;
