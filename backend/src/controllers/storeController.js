import Store from "../models/Store.js";
import Product from "../models/Product.js";
import { getAuthenticatedUserId } from "../middleware/auth.js";

export async function createStore(req, res) {
  const ownerId = getAuthenticatedUserId(req);
  const existing = await Store.findOne({ ownerId });
  if (existing) {
    return res.status(409).json({ success: false, message: "You already have a store application." });
  }

  const store = await Store.create({ ...req.validatedBody, ownerId });
  res.status(201).json({ success: true, data: store });
}

export async function getMyStore(req, res) {
  const ownerId = getAuthenticatedUserId(req);
  const store = await Store.findOne({ ownerId });
  res.json({ success: true, data: store });
}

export async function getStoreByUsername(req, res) {
  const store = await Store.findOne({
    username: req.params.username.toLowerCase(),
    status: "approved",
    isActive: true
  }).lean();

  if (!store) {
    return res.status(404).json({ success: false, message: "Store not found." });
  }

  const products = await Product.find({ store: store._id, inStock: true })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: { store, products } });
}
