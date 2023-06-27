import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Header from "./../components/Header";
import Rating from "../components/homeComponents/Rating";
import { Link } from "react-router-dom";
import Message from "./../components/LoadingError/Error";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductReview,
  listProductDetails,
} from "../Redux/Actions/ProductActions";
import Loading from "../components/LoadingError/Loading";
import { PRODUCT_CREATE_REVIEW_RESET } from "../Redux/Constants/ProductConstants";
import moment from "moment";
import "moment/locale/ro";
import Footer from "./../components/Footer";
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';

const SingleProduct = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const productId = match.params.id;
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingCreateReview,
    error: errorCreateReview,
    success: successCreateReview,
  } = productReviewCreate;

  let descriptionHTML = '';
  try {
    const rawContent = JSON.parse(product.description);
    descriptionHTML = stateToHTML(convertFromRaw(rawContent));
  } catch (error) {
    // If product.description is not a valid JSON string, assume it's plain text
    descriptionHTML = product.description;
  }

  useEffect(() => {
    if (successCreateReview) {
      //   alert("Recenzie trimisa");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(productId));
  }, [dispatch, productId, successCreateReview]);

  const AddToCartHandle = (e) => {
    e.preventDefault();
    history.push(`/cart/${productId}?qty=${qty}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(productId, {
        rating,
        comment,
      })
    );
  };
  return (
    <>
      <Header />
      <div className="container single-product">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="single-image img-fluid" id="product_image">
                  <Carousel pause="hover" variant="dark">
                    {product.gallery &&
                      product.gallery.map((image) => (
                        <Carousel.Item key={image.public_id}>
                          <img
                            className="d-block w-100"
                            src={image.url}
                            alt={product.title}
                          />
                        </Carousel.Item>
                      ))}
                  </Carousel>
                </div>
              </div>
              <div className="col-md-6">
                <div className="product-dtl">
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: descriptionHTML }}></p>

                  <div className="product-count col-lg-7 ">
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Categorie</h6>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Pret</h6>
                      <span>{product.price} Lei</span>
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Status</h6>
                      {product.countInStock > 0 ? (
                        <span>in stoc</span>
                      ) : (
                        <span>indisponibil</span>
                      )}
                    </div>
                    <div className="flex-box d-flex justify-content-between align-items-center">
                      <h6>Recenzii</h6>
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} recenzii`}
                      />
                    </div>
                    {product.countInStock > 0 ? (
                      <>
                        <div className="flex-box d-flex justify-content-between align-items-center">
                          <h6>Cantitate</h6>
                          <select
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        <button
                          onClick={AddToCartHandle}
                          className="round-black-btn"
                        >
                          Adauga in cos
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* RATING */}
            <div className="row my-5">
              <div className="col-md-6">
                <h6 className="mb-3">Recenzii</h6>
                {product.reviews.length === 0 && (
                  <Message variant={"alert-info mt-3"}>Fara Recenzii</Message>
                )}
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="mb-5 mb-md-3 bg-light p-3 shadow-sm rounded"
                  >
                    {review.avatar && (
                      <img
                        src={review.avatar}
                        alt={`${review.name}'s avatar`}
                        className="review-avatar"
                      />
                    )}
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <span>{moment(review.createdAt).format("Do MMM YYYY")}</span>
                    <div className="alert alert-info mt-3">
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                <h6>Adauga recenzie</h6>
                <div className="my-4">
                  {loadingCreateReview && <Loading />}
                  {errorCreateReview && (
                    <Message variant="alert-danger">
                      {errorCreateReview}
                    </Message>
                  )}
                </div>
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="my-4">
                      <strong>Rating</strong>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      >
                        <option value="">Selecteaza...</option>
                        <option value="1">1 - Slab</option>
                        <option value="2">2 - Decent</option>
                        <option value="3">3 - Bun</option>
                        <option value="4">4 - Foarte bun</option>
                        <option value="5">5 - Excelent</option>
                      </select>
                    </div>
                    <div className="my-4">
                      <strong>Comentariu</strong>
                      <textarea
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="col-12 bg-light p-3 mt-2 border-0 rounded"
                      ></textarea>
                    </div>
                    <div className="my-3">
                      <button
                        disabled={loadingCreateReview}
                        className="col-12 bg-black border-0 p-3 rounded text-white"
                      >
                        Adauga
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="my-3">
                    <Message variant={"alert-warning"}>
                      Te rugam{" "}
                      <Link to="/login">
                        <strong>sa te autentifici</strong>
                      </Link>{" "}
                      pentru a adauga o recenzie{" "}
                    </Message>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SingleProduct;
