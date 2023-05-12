import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Product from "./Product";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../Redux/Actions/ProductActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const MainProducts = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState([""]);
  const [searchProd, setSearchProd] = useState("");

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const [pagenumber, setPagenumber] = useState(page);

  const productDelete = useSelector((state) => state.productDelete);
  const { error: errorDelete, success: successDelete } = productDelete;

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
    dispatch(listProducts(searchProd, pagenumber));
  }, [dispatch, successDelete, searchProd, pagenumber]);

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Produse</h2>
        <div>
          <Link to="/addproduct" className="btn btn-primary">
            Adauga
          </Link>
        </div>
      </div>

      <div className="card mb-4 shadow-sm">
        <header className="card-header bg-white ">
          <div className="row gx-3 py-3">
            <div className="col-lg-4 col-md-6 me-auto ">
              <form onSubmit={submitHandler} className="input-group">
                <input
                  type="search"
                  placeholder="Produs..."
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
          {errorDelete && (
            <Message variant="alert-danger">{errorDelete}</Message>
          )}
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : (
            <div className="row">
              {/* Products */}
              {products.map((product) => (
                <Product product={product} key={product._id} />
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

export default MainProducts;
