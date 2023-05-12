import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import Rating from "./Rating";
import Pagination from "./pagination";
import { useDispatch, useSelector } from "react-redux";
import { listProduct } from "../../Redux/Actions/ProductActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const ShopSection = (props) => {
  const { keyword } = props;
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages, minPrice, maxPrice, count } =
    productList;

  const [pagenumber, setPagenumber] = useState(page);
  const [price, setPrice] = useState([minPrice, maxPrice]);
  const [currentSliderPrice, setCurrentSliderPrice] = useState([
    minPrice,
    maxPrice,
  ]);
  const [category, setCategory] = useState([]);
  const [rating, setRating] = useState([]);
  const [sort, setSort] = useState("price_asc");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "Telecomenzi",
    "Intrerupatoare",
    "Senzori",
    "Priza",
    "Accesorii",
    "Butoane",
    "Becuri",
    "Sisteme de alarma",
    "Panouri de control",
  ];

  const ratings = ["1", "2", "3", "4", "5"];

  const handleSliderChange = (price) => {
    setCurrentSliderPrice(price);
    setPagenumber(1);
  };

  const handleSliderAfterChange = (price) => {
    setPrice(price);
    setPagenumber(1);
  };

  const handleCategoryCheckChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategory((prevCategory) => [...prevCategory, value]);
    } else {
      setCategory((prevCategory) =>
        prevCategory.filter((cat) => cat !== value)
      );
    }
    setPagenumber(1);
  };

  const handleRatingCheckChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRating((prevRating) => [...prevRating, value]);
    } else {
      setRating((prevRating) => prevRating.filter((rat) => rat !== value));
    }
    setPagenumber(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handlePageChange = (e) => {
    e.preventDefault();
    setPagenumber(e.target.text);
  };

  useEffect(() => {
    dispatch(
      listProduct(
        keyword,
        pagenumber,
        price[0],
        price[1],
        category,
        rating,
        sort // Pass the sort option to the listProduct action
      )
    );
  }, [dispatch, keyword, pagenumber, price, category, rating, sort]); // Add sort to the dependency array

  useEffect(() => {
    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      currentSliderPrice[0] == currentSliderPrice[1]
    ) {
      setCurrentSliderPrice([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setPagenumber(1);
  }, [keyword]);

  return (
    <>
      <div className="container">
        <div className="section">
          <div className="row">
            <button
              className="filters-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fas fa-filter"></i>
            </button>
            <div className="col-lg-3 col-md-4 filters">
              <div className={`filters-wrapper ${showFilters ? "show" : ""}`}>
                <div className="filter-container">
                  {loading ? (
                    <Loading />
                  ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                  ) : (
                    <>
                      <div className="price-range mb4">
                        <Range
                          marks={{
                            [minPrice]: `${minPrice} Lei`,
                            [maxPrice]: `${maxPrice} Lei`,
                          }}
                          min={minPrice}
                          max={maxPrice}
                          defaultValue={[minPrice, maxPrice]}
                          tipFormatter={(value) => `${value} Lei`}
                          tipProps={{
                            placement: "top",
                            visible: true,
                          }}
                          value={currentSliderPrice}
                          onChange={(price) => handleSliderChange(price)}
                          onAfterChange={(price) =>
                            handleSliderAfterChange(price)
                          }
                        />
                      </div>
                      <div className="category-select mt-4">
                        <h4 className="category-title">Categorie:</h4>
                        <ul className="category-list">
                          {categories.map((cat, index) => (
                            <li key={index} className="category-item">
                              <input
                                type="checkbox"
                                id={`category-${index}`}
                                name={`category-${index}`}
                                value={cat}
                                checked={category.includes(cat)}
                                onChange={handleCategoryCheckChange}
                                className="category-input"
                              />
                              <label
                                htmlFor={`category-${index}`}
                                className="category-label"
                              >
                                {cat}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rating-select mt-4">
                        <h4 className="rating-title">Rating:</h4>
                        <ul className="rating-list">
                          {ratings.map((rat) => (
                            <li key={rat} className="rating-item">
                              <input
                                type="checkbox"
                                id={`rating-${rat}`}
                                name={`rating-${rat}`}
                                value={rat}
                                checked={rating.includes(rat)}
                                onChange={handleRatingCheckChange}
                                className="rating-input"
                              />
                              <label
                                htmlFor={`rating-${rat}`}
                                className="rating-label"
                              >
                                <Rating
                                  value={rat}
                                  size={20}
                                  activeColor="#ffd700"
                                  edit={false}
                                />
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-9 col-md-8 article">
              {loading ? (
                <div className="mb-5">
                  <Loading />
                </div>
              ) : error ? (
                <Message variant="alert-danger">{error}</Message>
              ) : (
                <>
                  <div className="sorting-info mb-2 d-flex align-items-center">
                    <span className="total-products mr-4">
                      Total produse: {count}
                    </span>
                    <select
                      className="sort-selector"
                      value={sort}
                      onChange={handleSortChange}
                    >
                      <option value="price_asc">Pret (crescator)</option>
                      <option value="price_desc">Pret (descrescator)</option>
                      <option value="rating_asc">Rating (crescator)</option>
                      <option value="rating_desc">Rating (descrescator)</option>
                    </select>
                  </div>
                  <div className="shopcontainer row">
                    {products.map((product) => (
                      <div
                        className="shop col-lg-4 col-md-6 col-sm-6"
                        key={product._id}
                      >
                        <div className="border-product">
                          <Link to={`/products/${product._id}`}>
                            <div className="shopBack">
                              <img src={product.image} alt={product.name} />
                            </div>
                          </Link>

                          <div className="shoptext">
                            <p>
                              <Link to={`/products/${product._id}`}>
                                {product.name}
                              </Link>
                            </p>

                            <Rating
                              value={product.rating}
                              text={`${product.numReviews} recenzii`}
                            />
                            <h3>{product.price} Lei</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pagination */}
              <nav>
                <ul className="pagination justify-content-center">
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
        </div>
      </div>
    </>
  );
};

export default ShopSection;
