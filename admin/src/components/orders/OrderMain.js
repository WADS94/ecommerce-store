import React, { useEffect, useState } from "react";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Orders from "./Orders";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listOrders } from "../../Redux/Actions/OrderActions";

const OrderMain = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [searchProd, setSearchProd] = useState("");

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;

  const [pagenumber, setPagenumber] = useState(page);

  const handlePageChange = (e) => {
    e.preventDefault();
    setPagenumber(e.target.text);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setSearchProd(keyword);
    setPagenumber(1);
  };

  useEffect(() => {
    dispatch(listOrders(searchProd, pagenumber));
  }, [dispatch, searchProd, pagenumber]);

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Comenzi</h2>
      </div>

      <div className="card mb-4 shadow-sm">
        <header className="card-header bg-white">
          <div className="row gx-3 py-3">
            <div className="col-lg-4 col-md-6 me-auto">
              <form onSubmit={submitHandler} className="input-group">
                <input
                  type="search"
                  placeholder="Client..."
                  className="form-control p-2"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button type="submit" className="search-button">
                  Cauta
                </button>
              </form>
            </div>
          </div>
        </header>
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <Loading />
            ) : error ? (
              <Message variant="alert-danger">{error}</Message>
            ) : (
              <Orders orders={orders} />
            )}
          </div>
        </div>
      </div>
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
    </section>
  );
};

export default OrderMain;
