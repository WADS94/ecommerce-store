import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PRODUCT_CREATE_RESET } from "../../Redux/Constants/ProductConstants";
import { createProduct } from "./../../Redux/Actions/ProductActions";
import Toast from "../LoadingError/Toast";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import DescriptionEditor from "../Editor/DescriptionEditor";
import { convertToRaw } from 'draft-js';

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const AddProductMain = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [gallery, setGallery] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Telecomenzi");
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

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, product } = productCreate;

  useEffect(() => {
    if (product) {
      toast.success("Produs adaugat", ToastObjects);
      dispatch({ type: PRODUCT_CREATE_RESET });
      setName("");
      setDescription("");
      setCountInStock(0);
      setGallery("");
      setCategory("");
      setPrice(0);
    }
  }, [product, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct(name, price, description, gallery, countInStock, category)
    );
  };

  const handleEditorChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    setDescription(JSON.stringify(rawContent));
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
            <h2 className="content-title">Adauga produs</h2>
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
                    <label htmlFor="product_category" className="form-label">
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
                      Pret
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
                    <label htmlFor="product_price" className="form-label">
                      Stoc
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
                    <DescriptionEditor handleEditorChange={handleEditorChange} initialContent={description} />
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
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;
