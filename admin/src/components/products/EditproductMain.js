import React, { useState, useEffect } from "react";
import Toast from "./../LoadingError/Toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  editProduct,
  updateProduct,
} from "./../../Redux/Actions/ProductActions";
import { PRODUCT_UPDATE_RESET } from "../../Redux/Constants/ProductConstants";
import { toast } from "react-toastify";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const EditProductMain = (props) => {
  const { productId } = props;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [gallery, setGallery] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);

  const dispatch = useDispatch();

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

  const productEdit = useSelector((state) => state.productEdit);
  const { loading, error, product } = productEdit;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      toast.success("Produs updatat", ToastObjects);
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(editProduct(productId));
      } else {
        setName(product.name);
        setDescription(product.description);
        setCountInStock(product.countInStock);
        setGallery([]);
        setCategory(product.category);
        setPrice(product.price);
        setImagesPreview([]);
      }
    }
  }, [product, dispatch, productId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        description,
        gallery,
        countInStock,
        category,
      })
    );
  };
  const onChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          const imageBase64 = reader.result;

          // Check if the image is already in the collection
          if (!gallery.includes(imageBase64)) {
            setImagesPreview((oldArray) => [...oldArray, imageBase64]);
            setGallery((oldArray) => [...oldArray, imageBase64]);
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagesPreview((prevImages) =>
      prevImages.filter((_, imgIndex) => imgIndex !== index)
    );
    setGallery((prevImages) =>
      prevImages.filter((_, imgIndex) => imgIndex !== index)
    );
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: "1200px" }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Produse
            </Link>
            <h2 className="content-title">Editeaza produs</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Salveaza
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {errorUpdate && (
                    <Message variant="alert-danger">{errorUpdate}</Message>
                  )}
                  {loadingUpdate && <Loading />}
                  {loading ? (
                    <Loading />
                  ) : error ? (
                    <Message variant="alert-danger">{error}</Message>
                  ) : (
                    <>
                      <div className="mb-4">
                        <label htmlFor="product_title" className="form-label">
                          Nume produs
                        </label>
                        <input
                          type="text"
                          placeholder="Scrie aici"
                          className="form-control"
                          id="product_title"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Price
                        </label>
                        <input
                          type="number"
                          placeholder="Scrie aici"
                          className="form-control"
                          id="product_price"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="product_category"
                          className="form-label"
                        >
                          Categorie produs
                        </label>
                        <select
                          className="form-control"
                          id="product_category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="product_price" className="form-label">
                          Count In Stock
                        </label>
                        <input
                          type="number"
                          placeholder="Scrie aici"
                          className="form-control"
                          id="product_price"
                          required
                          value={countInStock}
                          onChange={(e) => setCountInStock(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Descriere</label>
                        <textarea
                          placeholder="Scrie aici"
                          className="form-control"
                          rows="7"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Galerie</label>
                        <div className="custom-file">
                          <input
                            type="file"
                            name="product_images"
                            className="custom-file-input"
                            id="customFile"
                            onChange={onChange}
                            multiple
                            style={{ display: "none" }}
                          />
                          <label
                            className="custom-file-label btn btn-primary"
                            htmlFor="customFile"
                          >
                            Selecteaza imagini
                          </label>
                        </div>

                        <div className="mt-3">
                          {imagesPreview.map((img, index) => (
                            <div
                              className="image-container mr-2"
                              key={img}
                              style={{
                                display: "inline-block",
                                position: "relative",
                              }}
                            >
                              <img
                                src={img}
                                alt="Images Preview"
                                width="55"
                                height="52"
                              />
                              <i
                                className="fa fa-times remove-image-icon"
                                style={{
                                  position: "absolute",
                                  top: "0",
                                  right: "0",
                                  cursor: "pointer",
                                  background: "rgba(0, 0, 0, 0.5)",
                                  borderRadius: "50%",
                                  padding: "2px",
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                                onClick={() => removeImage(index)}
                              ></i>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProductMain;
