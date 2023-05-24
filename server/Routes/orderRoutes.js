import express from "express";
import asyncHandler from "express-async-handler";
import { admin, protect } from "../Middleware/AuthMiddleware.js";
import Order from "./../Models/OrderModel.js";
import Product from "./../Models/ProductModel.js";

const orderRouter = express.Router();

// CREATE ORDER
orderRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("Comanda este goala");
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  })
);

// ADMIN GET ALL ORDERS
orderRouter.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          "user.name": {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      { $match: keyword },
      { $sort: { _id: -1 } },
    ];

    const orders = await Order.aggregate(pipeline)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    const count = await Order.aggregate([...pipeline, { $count: "count" }]);
    const totalCount = count.length ? count[0].count : 0;

    res.json({
      orders,
      count: totalCount,
      page,
      pages: Math.ceil(totalCount / pageSize),
    });
  })
);
// USER LOGIN ORDERS
orderRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);
orderRouter.get(
  "/dashboard",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const [productsCnt, ordersCnt, totalValueOfPaidOrdersResults, lastOrders] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { isPaid: true } },
          { $group: { _id: null, totalValue: { $sum: "$totalPrice" } } },
        ]),
        Order.find()
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    const ordersValue = totalValueOfPaidOrdersResults.length
      ? totalValueOfPaidOrdersResults[0].totalValue
      : 0;

    res.json({
      info: {
        productsCnt,
        ordersCnt,
        ordersValue,
        lastOrders,
      },
    });
  })
);
// GET ORDER BY ID
orderRouter.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Comanda nu a fost gasita");
    }
  })
);

// ORDER IS PAID
orderRouter.put(
  "/:id/pay",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Comanda nu a fost gasita");
    }
  })
);

// ORDER IS PAID
orderRouter.put(
  "/:id/delivered",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Comanda nu a fost gasita");
    }
  })
);

export default orderRouter;
