import express from "express";
import Stripe from "stripe";
import Order from "./../Models/OrderModel.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_KEY);

const stripeRouter = express.Router();

stripeRouter.post("/create-checkout-session", async (req, res) => {
  const { orderId, orderUrl } = req.body;
  const order = await Order.findById(orderId).populate("user", "name email");

  const line_items = order.orderItems.map((item) => {
    return {
      price_data: {
        currency: "ron",
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            id: item._id.toString(),
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    client_reference_id: orderId,
    invoice_creation: {
      enabled: true,
      invoice_data: {
        description: `Factura pentru comanda ${req.params.orderId}`,
        metadata: {
          order: req.params.orderId,
        },
        footer: "Magazinul Casa Viitorului",
      },
    },
    customer_email: order.user.email,
    locale: "ro",
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Curier",
          type: "fixed_amount",
          delivery_estimate: {
            minimum: {
              unit: "day",
              value: 2,
            },
            maximum: {
              unit: "day",
              value: 5,
            },
          },
          fixed_amount: {
            amount: order.shippingPrice * 100,
            currency: "RON",
          },
        },
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    success_url: orderUrl,
    cancel_url: orderUrl,
  });
  res.send({ url: session.url });
});

// Stripe webhoook

stripeRouter.post("/webhook", async (req, res) => {
  let data;
  let eventType;

  // Check if webhook signing is configured.
  let webhookSecret;

  webhookSecret = process.env.STRIPE_WEB_HOOK;

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      // console.log(`⚠️  Webhook signature verification failed:  ${err}`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data.object;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the checkout.session.completed event
  if (
    eventType === "checkout.session.completed" &&
    data.payment_status === "paid"
  ) {
    const orderId = data.client_reference_id;
    const order = await Order.findById(orderId);

    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: data.id,
        status: data.payment_status,
        update_time: order.paidAt,
        email_address: data.customer_email,
      };

      await order.save();
    }

    res.status(200).end();
  }

  res.status(200).end();
});

export default stripeRouter;
