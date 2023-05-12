import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../Middleware/AuthMiddleware.js";
import generateToken from "../utils/generateToken.js";
import User from "./../Models/UserModel.js";
import cloudinary from "cloudinary";

const userRouter = express.Router();

// LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401);
      throw new Error("Email sau parola gresita");
    }
  })
);

// REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("Utilizatorul exista deja");
    }

    let avatar = {};
    if (typeof req.body.avatar === "string" && req.body.avatar.length > 0) {
      avatar = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Date invalide");
    }
  })
);

// ADD USER
userRouter.post(
  "/add",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    const userExists = await User.findOne({ email });
    let avatar = {};

    if (userExists) {
      res.status(400);
      throw new Error("Utilizatorul exista deja");
    }

    if (typeof req.body.avatar === "string" && req.body.avatar.length > 0) {
      avatar = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      avatar,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      });
    } else {
      res.status(400);
      throw new Error("Date invalide");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("Utilizatorul nu a fost gasit");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      if (typeof req.body.avatar === "string" && req.body.avatar.length > 0) {
        user.avatar = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
        });
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("Utilizatorul nu a fost gasit");
    }
  })
);

// GET ALL USER ADMIN
userRouter.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    let userTypeFilter = {};
    if (req.query.userTypeFilter && req.query.userTypeFilter.length > 0) {
      userTypeFilter = {
        isAdmin: req.query.userTypeFilter,
      };
    }

    const count = await User.countDocuments({ ...keyword, ...userTypeFilter });
    const users = await User.find({
      ...keyword,
      ...userTypeFilter,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
    });
  })
);

export default userRouter;
