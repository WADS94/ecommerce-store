import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import cors from "cors";
import cloudinary from "cloudinary";
import path from "path";
import stripeRouter from "./Routes/stripeRoutes.js";

dotenv.config();
connectDatabase();
const app = express();
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cors());

// Setting up cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_secret,
});

// API
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/stripe", stripeRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// Serve the client app
app.use(express.static(path.join(process.cwd(), "client/build")));

// Serve the admin app
app.use("/admin", express.static(path.join(process.cwd(), "admin/build")));

// Catch-all handler for client app (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "client/build", "index.html"));
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  console.error(err);
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err,
  });
});
