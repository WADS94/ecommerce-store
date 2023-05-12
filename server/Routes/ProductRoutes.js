import express from "express";
import asyncHandler from "express-async-handler";
import Product from "./../Models/ProductModel.js";
import { admin, protect, user } from "./../Middleware/AuthMiddleware.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const productRoute = express.Router();

// GET ALL PRODUCT
productRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const priceFilter =
      isNaN(minPrice) || isNaN(maxPrice)
        ? {}
        : {
            price: {
              $gte: minPrice,
              $lte: maxPrice,
            },
          };

    // Extract categories from the request query and create a filter
    const category = req.query.category ? req.query.category.split(",") : [];
    const categoryFilter = category.length
      ? {
          category: {
            $in: category,
          },
        }
      : {};

    // Extract ratings from the request query and create a filter
    const rating = req.query.rating ? req.query.rating.split(",") : [];
    const ratingFilter = rating.length
      ? {
          rating: {
            $in: rating,
          },
        }
      : {};

    // Extract sort option from the request query and create a sort object
    const sort = req.query.sort || "price_asc";
    const sortMapping = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_asc: { rating: 1 },
      rating_desc: { rating: -1 },
    };
    const sortObject = sortMapping[sort] || { price: 1 };

    const count = await Product.countDocuments({
      ...keyword,
      ...priceFilter,
      ...categoryFilter,
      ...ratingFilter,
    });
    const products = await Product.find({
      ...keyword,
      ...priceFilter,
      ...categoryFilter,
      ...ratingFilter,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortObject); // Apply the sortObject to the MongoDB query

    const minProductPrice = await Product.find().sort({ price: 1 }).limit(1);
    const maxProductPrice = await Product.find().sort({ price: -1 }).limit(1);

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      minPrice: minProductPrice[0].price,
      maxPrice: maxProductPrice[0].price,
      count,
    });
  })
);

// ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PAGINATION
productRoute.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  })
);

// GET SINGLE PRODUCT
productRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Produsul nu mai exista");
    }
  })
);

// PRODUCT REVIEW
productRoute.post(
  "/:id/review",
  protect,
  user,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Ai revizuit deja acest produs");
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Rating adaugat" });
    } else {
      res.status(404);
      throw new Error("Produsul nu mai exista");
    }
  })
);

// DELETE PRODUCT
productRoute.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Deleting images associated with the product
      for (let i = 0; i < product.gallery.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.gallery[i].public_id
        );
      }

      await product.remove();
      res.json({ message: "Produsul a fost sters" });
    } else {
      res.status(404);
      throw new Error("Produsul nu mai exista");
    }
  })
);

// CREATE PRODUCT
productRoute.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    let images = [];
    if (typeof req.body.gallery === "string") {
      images.push(req.body.gallery);
    } else {
      images = req.body.gallery;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imagesLinks[0].url;
    req.body.gallery = imagesLinks;
    console.log(req.body);
    const { name, price, description, image, countInStock, gallery, category } =
      req.body;
    const productExist = await Product.findOne({ name });
    if (productExist) {
      res.status(400);
      throw new Error("Produsul exista deja");
    } else {
      const product = new Product({
        name,
        price,
        description,
        image,
        countInStock,
        gallery,
        category,
        user: req.user._id,
      });
      if (product) {
        const createdproduct = await product.save();
        res.status(201).json(createdproduct);
      } else {
        res.status(400);
        throw new Error("Produsul nu este valid");
      }
    }
  })
);

// UPDATE PRODUCT
productRoute.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      let images = [];
      if (typeof req.body.gallery === "string") {
        images.push(req.body.gallery);
      } else {
        images = req.body.gallery;
      }

      if (images !== undefined && images.length > 0) {
        // Deleting images associated with the product
        for (let i = 0; i < product.gallery.length; i++) {
          const result = await cloudinary.v2.uploader.destroy(
            product.gallery[i].public_id
          );
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
        req.body.image = imagesLinks[0].url;
        req.body.gallery = imagesLinks;
      }

      const {
        name,
        price,
        description,
        image,
        countInStock,
        gallery,
        category,
      } = req.body;
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.countInStock = countInStock || product.countInStock;
      product.gallery = gallery || product.gallery;
      product.category = category || product.category;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Produsul nu mai exista");
    }
  })
);
productRoute.get(
  "/with-reviews/:id",
  asyncHandler(async (req, res) => {
    const productWithAvatar = await Product.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "users",
          localField: "reviews.user",
          foreignField: "_id",
          as: "user_avatars",
        },
      },
      {
        $addFields: {
          reviews: {
            $map: {
              input: "$reviews",
              as: "review",
              in: {
                $mergeObjects: [
                  "$$review",
                  {
                    avatar: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: "$user_avatars",
                                as: "user_avatar",
                                cond: {
                                  $eq: ["$$user_avatar._id", "$$review.user"],
                                },
                              },
                            },
                            as: "user_avatar",
                            in: "$$user_avatar.avatar.url",
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $unset: "user_avatars" },
    ]);

    if (productWithAvatar && productWithAvatar.length > 0) {
      res.json(productWithAvatar[0]);
    } else {
      res.status(404);
      throw new Error("Produsul nu mai exista");
    }
  })
);
export default productRoute;
