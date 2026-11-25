import mongoose from "mongoose";
import Address from "../models/Address.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { getAuthenticatedUserId } from "../middleware/auth.js";

export async function createOrder(req, res) {
  const buyerId = getAuthenticatedUserId(req);
  if (!mongoose.isValidObjectId(req.validatedBody.addressId)) {
    return res.status(400).json({ success: false, message: "Invalid delivery address." });
  }

  const address = await Address.findOne({
    _id: req.validatedBody.addressId,
    userId: buyerId
  }).lean();
  if (!address) return res.status(404).json({ success: false, message: "Delivery address not found." });

  const quantities = new Map();
  for (const item of req.validatedBody.items) {
    if (!mongoose.isValidObjectId(item.productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
  }

  const productIds = [...quantities.keys()];
  const products = await Product.find({ _id: { $in: productIds }, inStock: true })
    .populate("store", "name username status isActive")
    .lean();

  if (products.length !== productIds.length) {
    return res.status(400).json({ success: false, message: "One or more products are unavailable." });
  }

  const productById = new Map(products.map(product => [String(product._id), product]));
  const items = [];
  let total = 0;

  for (const [productId, quantity] of quantities) {
    const product = productById.get(productId);
    if (!product.store?._id || product.store.status !== "approved" || !product.store.isActive) {
      return res.status(409).json({ success: false, message: "A product is not linked to an active approved store." });
    }
    total += product.price * quantity;
    items.push({
      product: product._id,
      store: product.store._id,
      name: product.name,
      image: product.images?.[0] || "",
      quantity,
      unitPrice: product.price
    });
  }

  const order = await Order.create({
    orderNumber: `CQ-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
    buyerId,
    items,
    address: {
      name: address.name,
      email: address.email,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone
    },
    total,
    paymentMethod: "COD"
  });

  res.status(201).json({ success: true, data: order });
}

export async function listMyOrders(req, res) {
  const orders = await Order.find({ buyerId: getAuthenticatedUserId(req) })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data: orders });
}

export async function listStoreOrders(req, res) {
  const store = await (await import("../models/Store.js")).default.findOne({
    ownerId: getAuthenticatedUserId(req),
    status: "approved",
    isActive: true
  }).lean();

  if (!store) return res.status(403).json({ success: false, message: "An approved active store is required." });

  const orders = await Order.find({ "items.store": store._id }).sort({ createdAt: -1 }).lean();
  const data = orders.map(order => ({
    ...order,
    items: order.items.filter(item => String(item.store) === String(store._id))
  }));
  res.json({ success: true, data });
}

export async function updateStoreOrderStatus(req, res) {
  const store = await (await import("../models/Store.js")).default.findOne({
    ownerId: getAuthenticatedUserId(req),
    status: "approved",
    isActive: true
  });

  if (!store) return res.status(403).json({ success: false, message: "An approved active store is required." });
  if (!mongoose.isValidObjectId(req.params.orderId)) {
    return res.status(400).json({ success: false, message: "Invalid order ID." });
  }

  const { status } = req.body;
  if (!["PROCESSING", "SHIPPED", "DELIVERED"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid fulfillment status." });
  }

  const order = await Order.findOne({
    _id: req.params.orderId,
    "items.store": store._id
  });

  if (!order) return res.status(404).json({ success: false, message: "Order not found for your store." });

  for (const item of order.items) {
    if (String(item.store) === String(store._id)) item.storeStatus = status;
  }

  const statuses = order.items.map(item => item.storeStatus);
  if (statuses.every(value => value === "DELIVERED")) order.status = "DELIVERED";
  else if (statuses.some(value => value === "SHIPPED")) order.status = "SHIPPED";
  else if (statuses.some(value => value === "PROCESSING")) order.status = "PROCESSING";
  else order.status = "ORDER_PLACED";

  await order.save();
  res.json({ success: true, data: order });
}
